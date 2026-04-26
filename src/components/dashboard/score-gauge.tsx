/** Jauge semi-circulaire (SVG), style dashboard analytique. */
export function ScoreGauge({
  value,
  max,
  label,
  suffix = "",
}: {
  value: number;
  max: number;
  label: string;
  suffix?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const r = 46;
  const arc = Math.PI * r;
  const dash = (pct / 100) * arc;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 72" className="w-44 max-w-full" aria-hidden>
        <defs>
          <linearGradient id="gaugeStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--chart-5)" />
            <stop offset="50%" stopColor="var(--chart-2)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>
        </defs>
        <path
          d={`M ${60 - r} 60 A ${r} ${r} 0 0 1 ${60 + r} 60`}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-muted-foreground/35"
        />
        <path
          d={`M ${60 - r} 60 A ${r} ${r} 0 0 1 ${60 + r} 60`}
          fill="none"
          stroke="url(#gaugeStroke)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${arc}`}
        />
      </svg>
      <div className="-mt-8 text-center">
        <p className="text-2xl font-semibold tabular-nums tracking-tight">
          {Math.round(value)}
          {suffix}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">sur {max}</p>
      </div>
    </div>
  );
}
