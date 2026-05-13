"use client";
import { cn } from "../lib/cn";

export interface GanttBar {
  name: string;
  start: string | number | Date;
  end: string | number | Date;
  value?: number;
  color?: string;
}

export interface AdTimelineGanttProps {
  bars: GanttBar[];
  height?: number;
  className?: string;
}

function toMs(d: string | number | Date): number {
  if (d instanceof Date) return d.getTime();
  if (typeof d === "number") return d;
  return new Date(d).getTime();
}

/**
 * Generic gantt timeline. Renders horizontal bars positioned by start/end relative
 * to the min/max of the dataset. Use for ad campaigns, project phases, etc.
 */
export function AdTimelineGantt({
  bars,
  height = 240,
  className,
}: AdTimelineGanttProps) {
  if (bars.length === 0) return null;
  const starts = bars.map((b) => toMs(b.start));
  const ends = bars.map((b) => toMs(b.end));
  const t0 = Math.min(...starts);
  const t1 = Math.max(...ends);
  const range = t1 - t0 || 1;
  const rowHeight = Math.max(20, height / bars.length);

  return (
    <div
      className={cn(
        "border border-[var(--border)] rounded-md bg-[var(--bg-card)] p-2 overflow-auto",
        className,
      )}
      style={{ height }}
    >
      {bars.map((b) => {
        const leftPct = ((toMs(b.start) - t0) / range) * 100;
        const widthPct = ((toMs(b.end) - toMs(b.start)) / range) * 100;
        return (
          <div
            key={b.name}
            className="flex items-center gap-2 mb-1"
            style={{ height: rowHeight - 2 }}
          >
            <span className="w-28 text-[11px] truncate text-[var(--fg-secondary)] shrink-0">
              {b.name}
            </span>
            <div className="relative flex-1 h-full bg-[var(--bg-subtle)] rounded">
              <div
                className="absolute top-0 bottom-0 rounded"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: b.color ?? "var(--primary)",
                }}
                title={`${b.name}: ${new Date(b.start).toLocaleDateString()} → ${new Date(b.end).toLocaleDateString()}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
