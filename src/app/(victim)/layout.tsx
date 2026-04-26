import type { ReactNode } from "react";

import { DashboardAppShell } from "@/components/dashboard/dashboard-app-shell";
import { Role } from "@/generated/prisma/client";
import { requireRoles } from "@/lib/rbac";

export default async function VictimLayout({ children }: { children: ReactNode }) {
  const { session } = await requireRoles([Role.VICTIM], { next: "/dashboard" });

  return (
    <DashboardAppShell
      variant="victim"
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardAppShell>
  );
}
