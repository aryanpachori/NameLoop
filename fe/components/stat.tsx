import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 64;
      const y = 20 - ((v - min) / span) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 64 24" width="64" height="24" className={cn("text-brand", className)} aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function Stat({
  label,
  value,
  delta,
  spark,
  serif,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  spark?: number[];
  serif?: boolean;
  className?: string;
}) {
  const positive = delta?.startsWith("+");
  const negative = delta?.startsWith("-");

  return (
    <div className={cn("surface flex flex-col gap-2 p-4", className)}>
      <p className="text-12 text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p
          className={cn(
            "tabular-nums tracking-tight text-foreground",
            serif ? "font-serif-display text-40" : "font-[family-name:var(--font-geist-mono)] text-28 font-medium"
          )}
        >
          {value}
        </p>
        {spark ? <Sparkline values={spark} /> : null}
      </div>
      {delta ? (
        <p
          className={cn(
            "font-[family-name:var(--font-geist-mono)] text-12",
            positive && "text-success-foreground",
            negative && "text-destructive",
            !positive && !negative && "text-muted-foreground"
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}
