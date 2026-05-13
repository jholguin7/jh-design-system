"use client";
import { cn } from "../lib/cn";

export interface ConversionStep {
  name: string;
  value: number;
  /** Optional explicit conversion rate vs previous step; computed automatically if omitted */
  rate?: number;
}

export interface ConversionStepsProps {
  steps: ConversionStep[];
  className?: string;
}

export function ConversionSteps({ steps, className }: ConversionStepsProps) {
  const first = steps[0]?.value ?? 0;
  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {steps.map((s, i) => {
        const widthPct = first > 0 ? (s.value / first) * 100 : 0;
        const rate = s.rate ?? (i === 0 ? 100 : steps[i - 1].value > 0 ? (s.value / steps[i - 1].value) * 100 : 0);
        return (
          <li key={s.name} className="flex items-center gap-3">
            <span className="w-32 text-xs text-[var(--fg-secondary)] truncate">{s.name}</span>
            <div className="flex-1 h-6 rounded-md bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--primary)]"
                style={{ width: `${widthPct}%` }}
                role="progressbar"
                aria-valuenow={s.value}
                aria-valuemin={0}
                aria-valuemax={first}
              />
            </div>
            <span className="w-12 text-right text-xs font-medium text-[var(--fg)]">{s.value}</span>
            <span className="w-12 text-right text-[10px] text-[var(--fg-muted)]">{rate.toFixed(1)}%</span>
          </li>
        );
      })}
    </ol>
  );
}
