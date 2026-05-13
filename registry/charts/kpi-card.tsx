"use client";
import { cn } from "../lib/cn";

export type KpiSignal = "ok" | "warn" | "danger" | "neutral";

export interface KpiCardProps {
  label: string;
  value: string | number;
  /** Optional delta vs previous period */
  delta?: { value: number; period?: string; unit?: string };
  /** Tiny sparkline trail */
  sparkline?: number[];
  /** Token-driven signal color */
  signal?: KpiSignal;
  className?: string;
}

function signalColor(s: KpiSignal) {
  switch (s) {
    case "ok":
      return "var(--signal-ok)";
    case "warn":
      return "var(--signal-warn)";
    case "danger":
      return "var(--signal-danger)";
    default:
      return "var(--fg-muted)";
  }
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const w = 80;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  delta,
  sparkline,
  signal = "neutral",
  className,
}: KpiCardProps) {
  const sc = signalColor(signal);
  return (
    <article
      className={cn(
        "rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 flex flex-col gap-1",
        className,
      )}
    >
      <header className="text-[11px] uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </header>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold text-[var(--fg)]">{value}</span>
        {delta && (
          <span className="text-xs font-medium" style={{ color: sc }}>
            {delta.value >= 0 ? "+" : ""}
            {delta.value}
            {delta.unit ?? "%"}
            {delta.period && (
              <span className="text-[var(--fg-muted)] ml-1">vs {delta.period}</span>
            )}
          </span>
        )}
      </div>
      {sparkline && sparkline.length > 1 && (
        <div className="mt-1">
          <Sparkline data={sparkline} color={sc} />
        </div>
      )}
    </article>
  );
}
