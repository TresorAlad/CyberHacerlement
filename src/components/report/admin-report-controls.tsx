"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateReportStatusAction } from "@/app/actions/admin-reports";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ReportStatus } from "@/generated/prisma/browser";
import { cn } from "@/lib/utils";

const statusLabels: Record<ReportStatus, string> = {
  NEW: "Nouveau",
  IN_REVIEW: "En analyse",
  NEED_INFO: "Infos requises",
  ASSIGNED: "Pris en charge",
  RESOLVED: "Résolu",
  CLOSED: "Clôturé",
};

export function AdminReportControls({ publicId, status }: { publicId: string; status: ReportStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [nextStatus, setNextStatus] = useState<ReportStatus>(status);

  return (
    <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/80 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">Traitement du dossier</div>
        {pending ? (
          <span className="text-xs text-muted-foreground animate-pulse">Mise à jour…</span>
        ) : null}
      </div>

      {/* Barre de chargement indéterminée */}
      <div className={cn("h-0.5 w-full rounded-full bg-muted overflow-hidden", pending ? "visible" : "invisible")}>
        <div className="h-full w-1/3 rounded-full bg-primary origin-left animate-[indeterminate_1.4s_ease-in-out_infinite]" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Nouveau statut</Label>
        <select
          id="status"
          className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value as ReportStatus)}
          disabled={pending}
        >
          {(
            [
              ReportStatus.NEW,
              ReportStatus.IN_REVIEW,
              ReportStatus.NEED_INFO,
              ReportStatus.ASSIGNED,
              ReportStatus.RESOLVED,
              ReportStatus.CLOSED,
            ] as const
          ).map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          disabled={pending || nextStatus === status}
          onClick={() =>
            startTransition(async () => {
              const res = await updateReportStatusAction({ publicId, status: nextStatus });
              if (!res.ok) toast.error(res.error);
              else {
                toast.success("Statut mis à jour.");
                router.refresh();
              }
            })
          }
        >
          {pending ? "Mise à jour…" : "Appliquer le statut"}
        </Button>
      </div>
    </div>
  );
}
