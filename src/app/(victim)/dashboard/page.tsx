import Link from "next/link";
import { headers } from "next/headers";
import { AlertTriangle, FileText, FolderOpen } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Priority, ReportStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function VictimDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const reports = await prisma.report.findMany({
    where: { reporterUserId: session.user.id },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  const open = reports.filter(
    (r) => r.status !== ReportStatus.CLOSED && r.status !== ReportStatus.RESOLVED
  ).length;
  const urgent = reports.filter((r) => r.priority === Priority.URGENT).length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Vue synthétique de tes dossiers et prochaines actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Mes dossiers"
          value={reports.length}
          hint="Tous statuts"
          icon={FolderOpen}
          accent="violet"
        />
        <MetricCard
          title="En suivi"
          value={open}
          hint="Non clôturés / non résolus"
          icon={FileText}
          accent="cyan"
        />
        <MetricCard
          title="Priorité urgente"
          value={urgent}
          hint="À surveiller"
          icon={AlertTriangle}
          accent="amber"
        />
      </div>

      {reports.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/60 p-10 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Tu n’as pas encore de dossier enregistré.</p>
          <div className="pt-6">
            <Link href="/signaler" className={cn(buttonVariants({ size: "lg" }))}>
              Faire un signalement
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-2xl border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-1 border-b border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Tes dossiers</h2>
              <p className="text-xs text-muted-foreground">Clique pour ouvrir le détail</p>
            </div>
            <Link
              href="/signaler"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
            >
              Nouveau signalement
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {reports.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/${r.publicId}`}
                className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-muted/25 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.harassmentType}</div>
                  <div className="pt-1 font-mono text-xs text-muted-foreground">{r.publicId}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-md text-[10px] font-normal">
                    {r.status}
                  </Badge>
                  <Badge variant="secondary" className="rounded-md text-[10px] font-normal">
                    {r.priority}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
