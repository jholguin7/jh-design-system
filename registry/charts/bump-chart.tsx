"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export interface BumpSeries {
  name: string;
  /** Rank at each period (1 = top) */
  ranks: number[];
  color?: string;
}

export interface BumpChartProps {
  /** Period labels (e.g. months) */
  periods: string[];
  series: BumpSeries[];
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "var(--signal-ok)",
  "var(--signal-warn)",
  "var(--signal-danger)",
];

export function BumpChart({
  periods,
  series,
  height = 280,
  className,
}: BumpChartProps) {
  const data = periods.map((p, i) => {
    const row: Record<string, number | string> = { period: p };
    for (const s of series) row[s.name] = s.ranks[i] ?? 0;
    return row;
  });
  const maxRank = Math.max(...series.flatMap((s) => s.ranks));
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="period" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <YAxis
            reversed
            domain={[1, maxRank]}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s, i) => (
            <Line
              key={s.name}
              dataKey={s.name}
              stroke={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
