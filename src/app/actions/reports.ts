"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { EvidenceKind, Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertRateLimit, getClientIp } from "@/lib/rate-limit";
import { resolveUserRole } from "@/lib/rbac";
import { scoreReportText } from "@/lib/urgency";
import { createReportSchema } from "@/lib/validators/report";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function createReportAction(
  input: unknown
): Promise<ActionResult<{ publicId: string }>> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return { ok: false, error: "Tu dois être connecté pour signaler." };

  const role = await resolveUserRole(session.user);
  if (role && role !== Role.VICTIM) {
    return { ok: false, error: "Les signalements publics sont réservés aux comptes victimes." };
  }

  try {
    assertRateLimit(`report:create:${getClientIp(h)}:${session.user.id}`, 10, 60 * 60 * 1000);
  } catch {
    return { ok: false, error: "Trop de signalements en peu de temps. Réessaie plus tard." };
  }

  const parsed = createReportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const data = parsed.data;
  const { priority: reportPriority, urgent, score } = scoreReportText(data.description);

  const occurredAt = data.occurredAt ? new Date(data.occurredAt) : undefined;

  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.report.create({
      data: {
        reporterUserId: session.user.id,
        isAnonymous: Boolean(data.isAnonymous),
        displayName: data.displayName,
        categoryId: data.categoryId || undefined,
        harassmentType: data.harassmentType,
        description: data.description,
        occurredAt,
        platform: data.platform,
        region: data.region,
        status: "NEW",
        priority: reportPriority,
        aiScore: score,
        aiUrgent: urgent,
        aiDisclaimer:
          "Évaluation heuristique automatique, à titre indicatif uniquement. Elle ne remplace pas l’analyse humaine.",
      },
    });

    const evidences: { kind: EvidenceKind; url?: string; text?: string }[] = [];
    for (const url of data.evidenceUrls ?? []) {
      evidences.push({ kind: EvidenceKind.URL, url });
    }
    for (const text of data.evidenceNotes ?? []) {
      evidences.push({ kind: EvidenceKind.TEXT, text });
    }

    if (evidences.length) {
      await tx.evidence.createMany({
        data: evidences.map((e) => ({
          reportId: created.id,
          kind: e.kind,
          url: e.url,
          text: e.text,
        })),
      });
    }

    const admins = await tx.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    if (admins.length) {
      await tx.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          reportId: created.id,
          title: "Nouveau signalement",
          body: `Dossier ${created.publicId} - priorité ${created.priority}`,
        })),
      });
    }

    return created;
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { ok: true, data: { publicId: report.publicId } };
}
