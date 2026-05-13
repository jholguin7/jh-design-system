"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface TimelineEvent {
  date: string | number | Date;
  label?: string;
  value: number;
}

export interface TimelineChartProps {
  events: TimelineEvent[];
  height?: number;
  className?: string;
}

export function TimelineChart({
  events,
  height = 240,
  className,
}: TimelineChartProps) {
  const data = events.map((e) => ({
    ...e,
    dateLabel: typeof e.date === "string" ? e.date : new Date(e.date).toLocaleDateString(),
  }));
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
          <XAxis dataKey="dateLabel" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--primary-dark)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
