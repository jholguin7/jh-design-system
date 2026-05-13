"use client";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface ScatterPoint {
  x: number;
  y: number;
  /** Optional radius — when present component renders as bubble */
  r?: number;
  name?: string;
}

export interface ScatterBubbleChartProps {
  points: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  className?: string;
}

export function ScatterBubbleChart({
  points,
  xLabel,
  yLabel,
  height = 280,
  className,
}: ScatterBubbleChartProps) {
  const isBubble = points.some((p) => typeof p.r === "number");
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="var(--border-subtle)" />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
          />
          {isBubble && <ZAxis type="number" dataKey="r" range={[40, 400]} />}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={points} fill="var(--primary)" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
