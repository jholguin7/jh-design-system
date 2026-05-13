"use client";
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export interface PieSlice {
  name: string;
  value: number;
}

export interface PieChartProps {
  slices: PieSlice[];
  /** Optional palette override; defaults to CSS-variable-based palette */
  colors?: string[];
  height?: number;
  /** Render as donut */
  donut?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "var(--primary-hover)",
  "var(--primary-dark)",
  "var(--signal-ok)",
  "var(--signal-warn)",
  "var(--signal-danger)",
  "var(--fg-muted)",
];

export function PieChart({
  slices,
  colors = DEFAULT_COLORS,
  height = 240,
  donut = false,
  className,
}: PieChartProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsPie>
          <Pie
            data={slices}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={donut ? 50 : 0}
            outerRadius={80}
            paddingAngle={1}
          >
            {slices.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  );
}
