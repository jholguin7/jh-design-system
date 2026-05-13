"use client";
import {
  ResponsiveContainer,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

export interface RadarSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface RadarChartProps {
  axes: string[];
  series: RadarSeries[];
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = ["var(--primary)", "var(--signal-ok)", "var(--signal-warn)"];

export function RadarChart({
  axes,
  series,
  height = 280,
  className,
}: RadarChartProps) {
  // Reshape: axes-major, one row per axis with each series value
  const data = axes.map((axis, axisIdx) => {
    const row: Record<string, number | string> = { axis };
    for (const s of series) row[s.name] = s.values[axisIdx] ?? 0;
    return row;
  });
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsRadar data={data}>
          <PolarGrid stroke="var(--border-subtle)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fill: "var(--fg-muted)", fontSize: 10 }} />
          {series.map((s, i) => (
            <Radar
              key={s.name}
              name={s.name}
              dataKey={s.name}
              stroke={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fill={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
