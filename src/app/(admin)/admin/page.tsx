import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileStack,
  Layers,
  ShieldAlert,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Priority, ReportStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<ReportStatus, string> = {
  NEW: "Nouveau",
  IN_REVIEW: "En revue",
  NEED_INFO: "Infos requises",
  ASSIGNED: "Assigné",
  RESOLVED: "Résolu",
  CLOSED: "Clôturé",
};

export default async function AdminDashboardPage() {
  const [total, byStatus, resolved, urgent, newCount, recent] = await Promise.all([
    prisma.report.count(),
    prisma.report.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.report.count({ where: { status: ReportStatus.RESOLVED } }),
    prisma.report.count({ where: { priority: Priority.URGENT } }),
    prisma.report.count({ where: { status: ReportStatus.NEW } }),
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
      select: {
        id: true,
        publicId: true,
        harassmentType: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    }),
  ]);

  const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);
  const maxStatus = Math.max(1, ...byStatus.map((r) => r._count._all));
  const workloadScore = Math.min(
    1000,
    Math.round(total * 10 + urgent * 85 + newCount * 20 + (100 - resolutionRate) * 3)
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Signalements</h1>
        <p className="text-sm text-muted-foreground">
          Vue globale des dossiers et accès au détail pour traitement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Dossiers totaux"
          value={total}
          hint="Tous statuts confondus"
          icon={FileStack}
          accent="violet"
        />
        <MetricCard
          title="Urgences"
          value={urgent}
          hint="Priorité URGENT"
          icon={AlertTriangle}
          accent="amber"
        />
        <MetricCard
          title="Nouveaux"
          value={newCount}
          hint="À traiter en priorité"
          icon={ShieldAlert}
          accent="rose"
        />
        <MetricCard
          title="Taux de résolution"
          value={`${resolutionRate}%`}
          hint="Dossiers RESOLVED"
          icon={CheckCircle2}
          accent="cyan"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
                <Activity className="size-4" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Répartition par statut</h2>
                <p className="text-xs text-muted-foreground">Volume relatif par étape</p>
              </div>
            </div>
          </div>
          <ul className="mt-6 grid gap-4">
            {byStatus
              .slice()
              .sort((a, b) => b._count._all - a._count._all)
              .map((row) => {
                const n = row._count._all;
                const w = Math.round((n / maxStatus) * 100);
                return (
                  <li key={row.status}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">
                        {statusLabels[row.status]}
                      </span>
                      <span className="tabular-nums text-foreground">{n}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-chart-3 via-chart-2 to-chart-1 transition-all"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </Card>

        <Card className="flex flex-col items-center justify-center rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2 self-start">
            <div className="flex size-9 items-center justify-center rounded-lg bg-chart-5/15 text-chart-5">
              <Layers className="size-4" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Indice de charge</h2>
              <p className="text-xs text-muted-foreground">Heuristique interne</p>
            </div>
          </div>
          <ScoreGauge value={workloadScore} max={1000} label="Score" suffix="" />
          <Badge variant="secondary" className="mt-3 rounded-full text-xs">
            {urgent > 2 ? "Attention urgences" : "Flux sous contrôle"}
          </Badge>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="text-sm font-semibold">Signalements récents</h2>
          <p className="text-xs text-muted-foreground">Clique sur une référence pour ouvrir le dossier.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs text-muted-foreground">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Référence</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium">Priorité</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    Aucun dossier pour le moment.
                  </td>
                </tr>
              ) : (
                recent.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-6 py-3.5 text-xs text-muted-foreground tabular-nums">
                      {r.createdAt.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs">
                      <Link href={`/admin/${r.publicId}`} className="text-primary hover:underline">
                        {r.publicId}
                      </Link>
                    </td>
                    <td className="max-w-[200px] truncate px-6 py-3.5 text-xs">
                      {r.harassmentType}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="outline" className="rounded-md text-[10px] font-normal">
                        {statusLabels[r.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="secondary" className="rounded-md text-[10px] font-normal">
                        {r.priority}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
