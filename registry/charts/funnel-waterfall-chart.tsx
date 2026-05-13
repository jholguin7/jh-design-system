"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export interface FunnelWaterfallStage {
  name: string;
  /** Absolute count at this stage. */
  value: number;
}

export interface FunnelWaterfallChartProps {
  stages: FunnelWaterfallStage[];
  height?: number;
  className?: string;
}

/**
 * Funnel as a waterfall: each bar is the *drop* from the previous stage.
 * First stage shows full value; subsequent stages show the delta lost.
 */
export function FunnelWaterfallChart({
  stages,
  height = 240,
  className,
}: FunnelWaterfallChartProps) {
  const data = stages.map((s, i) => {
    const lost = i === 0 ? 0 : Math.max(0, stages[i - 1].value - s.value);
    return {
      name: s.name,
      remaining: s.value,
      lost,
    };
  });
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="name" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="remaining" stackId="a">
            {data.map((_, i) => (
              <Cell key={i} fill="var(--primary)" />
            ))}
          </Bar>
          <Bar dataKey="lost" stackId="a" fill="var(--signal-danger)" opacity={0.4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
