import { ReportStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const steps = [
  { key: ReportStatus.NEW, label: "Reçu" },
  { key: ReportStatus.IN_REVIEW, label: "En analyse" },
  { key: ReportStatus.NEED_INFO, label: "Infos requises" },
  { key: ReportStatus.ASSIGNED, label: "Pris en charge" },
  { key: ReportStatus.RESOLVED, label: "Résolu" },
  { key: ReportStatus.CLOSED, label: "Clôturé" },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function ReportStatusStepper({
  status,
  updatedAt,
  className,
}: {
  status: ReportStatus;
  updatedAt?: Date;
  className?: string;
}) {
  const currentIndex = clamp(
    steps.findIndex((s) => s.key === status),
    0,
    steps.length - 1
  );

  const progress =
    steps.length <= 1 ? 0 : (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm backdrop-blur-sm", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight text-foreground">
            Suivi du dossier
          </div>
          <div className="pt-1 text-xs text-muted-foreground">
            Statut actuel: <span className="font-medium text-foreground">{steps[currentIndex]?.label}</span>
            {updatedAt ? (
              <span className="text-muted-foreground">
                {" "}
                - Mis à jour {updatedAt.toLocaleDateString("fr-FR")}
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Étape {currentIndex + 1}/{steps.length}
        </div>
      </div>

      <div className="mt-4">
        <div
          className="h-2.5 w-full rounded-full bg-muted"
          role="progressbar"
          aria-label="Progression du dossier"
          aria-valuemin={0}
          aria-valuemax={steps.length - 1}
          aria-valuenow={currentIndex}
        >
          <div
            className="h-2.5 rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex size-2.5 rounded-full transition-colors",
                  isCurrent
                    ? "bg-primary"
                    : isDone
                      ? "bg-accent"
                      : "bg-border"
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "text-[11px] font-medium tracking-wide",
                  isCurrent
                    ? "text-foreground"
                    : isDone
                      ? "text-muted-foreground"
                      : "text-muted-foreground/80"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

