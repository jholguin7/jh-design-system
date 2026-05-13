"use client";
import { cn } from "../lib/cn";

export interface CohortRow {
  /** Cohort label (e.g. "Jan 2026") */
  label: string;
  /** Retention values per period (0 = day 0 / week 0 → 1.0) */
  retention: number[];
}

export interface CohortRetentionChartProps {
  cohorts: CohortRow[];
  periodLabels?: string[];
  cellSize?: number;
  className?: string;
}

export function CohortRetentionChart({
  cohorts,
  periodLabels,
  cellSize = 36,
  className,
}: CohortRetentionChartProps) {
  const periods = periodLabels ?? cohorts[0]?.retention.map((_, i) => `+${i}`) ?? [];

  return (
    <div className={cn("overflow-auto inline-block", className)}>
      <table className="border-separate" style={{ borderSpacing: 2 }}>
        <thead>
          <tr>
            <th />
            {periods.map((p) => (
              <th
                key={p}
                className="text-[10px] text-[var(--fg-muted)] font-normal text-center"
                style={{ minWidth: cellSize }}
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c) => (
            <tr key={c.label}>
              <th
                scope="row"
                className="text-[11px] text-[var(--fg-secondary)] font-normal text-right pr-2"
              >
                {c.label}
              </th>
              {c.retention.map((r, i) => {
                const pct = Math.round(r * 100);
                const opacity = Math.min(1, Math.max(0.06, r));
                return (
                  <td
                    key={i}
                    title={`${c.label} @ ${periods[i]}: ${pct}%`}
                    className="rounded text-[10px] text-center text-[var(--primary-fg)]"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: `color-mix(in srgb, var(--primary) ${opacity * 100}%, transparent)`,
                    }}
                  >
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
