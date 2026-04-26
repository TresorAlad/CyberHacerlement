import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const accent = {
  violet: "bg-primary/15 text-primary",
  cyan: "bg-accent/15 text-accent",
  rose: "bg-chart-1/15 text-chart-1",
  amber: "bg-chart-5/15 text-chart-5",
  indigo: "bg-chart-3/15 text-chart-3",
} as const;

export function MetricCard({
  title,
  value,
  hint,
  icon: Icon,
  accent: accentKey = "violet",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof accent;
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-border/60 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="pt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
          {hint ? <p className="pt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            accent[accentKey]
          )}
        >
          <Icon className="size-5" aria-hidden />
        </div>
      </div>
    </Card>
  );
}
