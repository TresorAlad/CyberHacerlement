import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Role } from "@/generated/prisma/client";
import { Role as RoleEnum } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/role-utils";

export { getUserRole } from "@/lib/role-utils";

type ReportAccessFields = {
  reporterUserId: string | null;
  assignedModeratorId: string | null;
  assignedPsychologistId: string | null;
  assignedLawyerId: string | null;
};

export function canAccessReport(
  userId: string,
  role: Role,
  report: ReportAccessFields
): boolean {
  if (role === RoleEnum.ADMIN) return true;
  if (report.reporterUserId && report.reporterUserId === userId) return true;
  return false;
}

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Rôle depuis la session ; repli DB si Better Auth n’expose pas encore `role` sur `user`. */
export async function resolveUserRole(
  sessionUser: { id: string } & Record<string, unknown>
): Promise<Role | null> {
  const fromSession = getUserRole(sessionUser);
  if (fromSession) return fromSession;
  const row = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { role: true },
  });
  return row?.role ?? null;
}

export async function requireSession(options?: { next?: string }) {
  const session = await getServerSession();
  if (!session) {
    const next = options?.next ?? "/dashboard";
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }
  return session;
}

export async function requireRoles(allowed: Role[], options?: { next?: string }) {
  const session = await requireSession({ next: options?.next });
  const role = await resolveUserRole(session.user);
  if (!role || !allowed.includes(role)) {
    redirect("/");
  }
  return { session, role };
}
