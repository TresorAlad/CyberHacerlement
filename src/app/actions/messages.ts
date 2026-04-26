"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertRateLimit, getClientIp } from "@/lib/rate-limit";
import { canAccessReport, resolveUserRole } from "@/lib/rbac";

export type ActionResult = { ok: true } | { ok: false; error: string };

const schema = z.object({
  publicId: z.string().min(1),
  body: z.string().min(1).max(8000),
});

export async function sendMessageAction(input: unknown): Promise<ActionResult> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return { ok: false, error: "Non authentifié." };

  try {
    assertRateLimit(`message:send:${getClientIp(h)}:${session.user.id}`, 120, 60 * 60 * 1000);
  } catch {
    return { ok: false, error: "Trop de messages en peu de temps. Réessaie plus tard." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Message invalide." };
  }

  const role = await resolveUserRole(session.user);
  if (!role) return { ok: false, error: "Rôle inconnu." };

  const report = await prisma.report.findUnique({
    where: { publicId: parsed.data.publicId },
    select: {
      id: true,
      publicId: true,
      reporterUserId: true,
      assignedModeratorId: true,
      assignedPsychologistId: true,
      assignedLawyerId: true,
    },
  });

  if (!report) return { ok: false, error: "Dossier introuvable." };

  if (!canAccessReport(session.user.id, role, report)) {
    return { ok: false, error: "Accès refusé." };
  }

  await prisma.message.create({
    data: {
      reportId: report.id,
      senderUserId: session.user.id,
      senderRole: role,
      body: parsed.data.body,
    },
  });

  revalidatePath(`/dashboard/${report.publicId}`);
  revalidatePath(`/admin/${report.publicId}`);
  return { ok: true };
}
