"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ReportStatus, Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessReport, resolveUserRole } from "@/lib/rbac";

export type ActionResult = { ok: true } | { ok: false; error: string };

const statusSchema = z.object({
  publicId: z.string(),
  status: z.enum([
    ReportStatus.NEW,
    ReportStatus.IN_REVIEW,
    ReportStatus.NEED_INFO,
    ReportStatus.ASSIGNED,
    ReportStatus.RESOLVED,
    ReportStatus.CLOSED,
  ]),
});

export async function updateReportStatusAction(input: unknown): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Non authentifié." };

  const role = await resolveUserRole(session.user);
  if (role !== Role.ADMIN) {
    return { ok: false, error: "Action réservée à l’administration." };
  }

  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Statut invalide." };
  }

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

  await prisma.report.update({
    where: { id: report.id },
    data: { status: parsed.data.status },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: session.user.id,
      reportId: report.id,
      action: "admin.status",
      metadata: { status: parsed.data.status },
    },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/${parsed.data.publicId}`);
  revalidatePath(`/dashboard/${parsed.data.publicId}`);
  return { ok: true };
}
