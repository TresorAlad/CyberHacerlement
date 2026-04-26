import type { ReactNode } from "react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { Role } from "@/generated/prisma/client";
import { requireRoles } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { session } = await requireRoles([Role.ADMIN], { next: "/admin" });

  return (
    <DashboardAppShell
      variant="admin"
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardAppShell>
  );
}
