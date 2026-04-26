import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSummaryButton } from "@/components/report/ai-summary-button";
import { AdminReportControls } from "@/components/report/admin-report-controls";
import { MessageForm } from "@/components/report/message-form";
import { ReportStatusStepper } from "@/components/report/report-status-stepper";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessReport, resolveUserRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  const report = await prisma.report.findUnique({
    where: { publicId },
    include: {
      evidences: { orderBy: { createdAt: "asc" } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
  });

  if (!report) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) notFound();

  const role = await resolveUserRole(session.user);
  if (!role || !canAccessReport(session.user.id, role, report)) notFound();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Card className="rounded-2xl border-border/60 bg-card/90 p-5 shadow-sm backdrop-blur-sm">
        <Link
          href="/admin"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          ← Administration
        </Link>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {report.harassmentType}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">{report.publicId}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md">
              {report.status}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {report.priority}
            </Badge>
          </div>
        </div>
      </Card>

      <ReportStatusStepper status={report.status} updatedAt={report.updatedAt} />

      <AdminReportControls publicId={report.publicId} status={report.status} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <AiSummaryButton publicId={report.publicId} />
        <a
          className={cn(buttonVariants({ variant: "secondary" }), "text-center")}
          href={`/api/report/${report.publicId}/pdf`}
        >
          Télécharger PDF
        </a>
      </div>

      {report.aiSummary ? (
        <Card className="rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
          <div className="text-sm font-medium">Résumé IA</div>
          <p className="pt-3 whitespace-pre-wrap text-sm text-muted-foreground">{report.aiSummary}</p>
        </Card>
      ) : null}

      <Card className="rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
        <div className="text-sm font-medium">Description</div>
        <p className="pt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {report.description}
        </p>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
        <div className="text-sm font-medium">Preuves</div>
        <div className="pt-3 grid gap-2 text-sm">
          {report.evidences.length === 0 ? (
            <div className="text-muted-foreground">Aucune preuve.</div>
          ) : (
            report.evidences.map((e) => (
              <div key={e.id} className="rounded-lg border border-border/60 p-3">
                <div className="text-xs text-muted-foreground">{e.kind}</div>
                {e.url ? (
                  <a
                    className="text-primary underline break-all"
                    href={e.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {e.url}
                  </a>
                ) : null}
                {e.text ? <p className="pt-2 whitespace-pre-wrap">{e.text}</p> : null}
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 bg-card/90 p-6 shadow-sm backdrop-blur-sm">
        <div className="text-sm font-medium">Messages</div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          {report.messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-border/60 p-3">
              <div className="text-xs text-muted-foreground">
                {(m.sender?.name ?? "Utilisateur")} · {m.senderRole} ·{" "}
                {m.createdAt.toLocaleString("fr-FR")}
              </div>
              <p className="pt-2 whitespace-pre-wrap text-sm">{m.body}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <MessageForm publicId={report.publicId} />
      </Card>
    </div>
  );
}
