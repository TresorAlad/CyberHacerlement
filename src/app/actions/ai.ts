"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { z } from "zod";

import { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertRateLimit, getClientIp } from "@/lib/rate-limit";
import { canAccessReport, resolveUserRole } from "@/lib/rbac";

export type ActionResult = { ok: true } | { ok: false; error: string };

const schema = z.object({ publicId: z.string().min(1) });

export async function summarizeReportAction(input: unknown): Promise<ActionResult> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return { ok: false, error: "Non authentifié." };

  const role = await resolveUserRole(session.user);
  if (role !== Role.ADMIN) {
    return { ok: false, error: "Action réservée à l’administration." };
  }

  try {
    assertRateLimit(`ai:summary:${getClientIp(h)}:${session.user.id}`, 20, 60 * 60 * 1000);
  } catch {
    return { ok: false, error: "Trop de requêtes IA. Réessaie plus tard." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Requête invalide." };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "...") {
    return { ok: false, error: "OPENAI_API_KEY manquant." };
  }

  const report = await prisma.report.findUnique({
    where: { publicId: parsed.data.publicId },
    include: { evidences: true, messages: { orderBy: { createdAt: "asc" }, take: 50 } },
  });

  if (!report) return { ok: false, error: "Dossier introuvable." };
  if (!canAccessReport(session.user.id, role, report)) {
    return { ok: false, error: "Accès refusé." };
  }

  const client = new OpenAI({ apiKey });

  const prompt = [
    "Tu es un assistant pour une plateforme anti cyberharcèlement au Togo.",
    "Résume le dossier suivant en français, ton neutre, 10-15 lignes max.",
    "Ne fais pas de diagnostic clinique. Signale l’incertitude si nécessaire.",
    "",
    `Type: ${report.harassmentType}`,
    `Description: ${report.description}`,
    "",
    "Preuves:",
    ...report.evidences.map((e) => `- ${e.kind}: ${e.url ?? e.text ?? ""}`),
    "",
    "Messages récents:",
    ...report.messages.map((m) => `- ${m.senderRole}: ${m.body}`),
  ].join("\n");

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const summary = completion.choices[0]?.message?.content?.trim();
  if (!summary) return { ok: false, error: "Réponse IA vide." };

  await prisma.report.update({
    where: { id: report.id },
    data: {
      aiSummary: summary,
      aiDisclaimer:
        "Résumé généré par IA à titre indicatif. Il ne remplace pas une analyse humaine ni un avis juridique.",
    },
  });

  revalidatePath(`/admin/${report.publicId}`);
  revalidatePath(`/dashboard/${report.publicId}`);
  return { ok: true };
}
