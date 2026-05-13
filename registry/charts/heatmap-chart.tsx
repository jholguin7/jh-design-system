"use client";
import { cn } from "../lib/cn";

export interface HeatmapCell {
  x: string | number;
  y: string | number;
  value: number;
}

export interface HeatmapChartProps {
  cells: HeatmapCell[];
  xLabels?: (string | number)[];
  yLabels?: (string | number)[];
  /** Optional fixed scale max. If omitted, computed from data. */
  max?: number;
  /** Color stops: lightest → darkest. Defaults to CSS-variable primary ramp. */
  colorStops?: string[];
  cellSize?: number;
  className?: string;
}

function interpolateColor(stops: string[], t: number): string {
  if (stops.length === 0) return "transparent";
  if (stops.length === 1) return stops[0];
  const clamped = Math.max(0, Math.min(1, t));
  const idx = Math.min(stops.length - 1, Math.floor(clamped * (stops.length - 1)));
  return stops[idx];
}

const DEFAULT_STOPS = [
  "var(--primary-faint)",
  "var(--primary-light)",
  "var(--primary)",
  "var(--primary-dark)",
];

export function HeatmapChart({
  cells,
  xLabels,
  yLabels,
  max,
  colorStops = DEFAULT_STOPS,
  cellSize = 28,
  className,
}: HeatmapChartProps) {
  const xs = xLabels ?? Array.from(new Set(cells.map((c) => c.x)));
  const ys = yLabels ?? Array.from(new Set(cells.map((c) => c.y)));
  const peak = max ?? Math.max(...cells.map((c) => c.value), 1);
  const lookup = new Map<string, number>();
  for (const c of cells) lookup.set(`${c.x}|${c.y}`, c.value);

  return (
    <div className={cn("overflow-auto inline-block", className)}>
      <table className="border-separate" style={{ borderSpacing: 2 }}>
        <thead>
          <tr>
            <th />
            {xs.map((x) => (
              <th
                key={String(x)}
                className="text-[10px] text-[var(--fg-muted)] font-normal text-center"
                style={{ minWidth: cellSize }}
              >
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ys.map((y) => (
            <tr key={String(y)}>
              <th
                className="text-[10px] text-[var(--fg-muted)] font-normal text-right pr-2"
                scope="row"
              >
                {y}
              </th>
              {xs.map((x) => {
                const v = lookup.get(`${x}|${y}`) ?? 0;
                const t = v / peak;
                return (
                  <td
                    key={`${x}|${y}`}
                    title={`${x} × ${y}: ${v}`}
                    className="rounded text-[10px] text-center"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: interpolateColor(colorStops, t),
                    }}
                  >
                    {v > 0 ? v : ""}
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
