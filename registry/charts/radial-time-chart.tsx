"use client";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

export type RadialMode = "hour" | "weekday" | "custom";

export interface RadialTimeSlot {
  /** Label for axis (e.g. "Mon", "00:00") */
  label: string;
  value: number;
}

export interface RadialTimeChartProps {
  slots: RadialTimeSlot[];
  mode?: RadialMode;
  height?: number;
  /** Max for circular gauge (default: max of data * 1.1) */
  max?: number;
  className?: string;
}

export function RadialTimeChart({
  slots,
  height = 280,
  max,
  className,
}: RadialTimeChartProps) {
  const peak = max ?? Math.max(...slots.map((s) => s.value), 1) * 1.1;
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="20%"
          outerRadius="90%"
          data={slots}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, peak]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: "var(--bg-subtle)" } as never}
            dataKey="value"
            fill="var(--primary)"
            label={{ position: "insideStart", fill: "var(--fg)", fontSize: 10 }}
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
