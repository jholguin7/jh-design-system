"use client";
import {
  ResponsiveContainer,
  FunnelChart as RechartsFunnel,
  Funnel,
  Tooltip,
  LabelList,
} from "recharts";

export interface FunnelStage {
  name: string;
  value: number;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  /** Optional palette override; defaults to CSS-variable-based fills via inline colors[] */
  colors?: string[];
  height?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "var(--primary-hover)",
  "var(--primary-dark)",
];

export function FunnelChart({
  stages,
  colors = DEFAULT_COLORS,
  height = 240,
  className,
}: FunnelChartProps) {
  const data = stages.map((s, i) => ({
    ...s,
    fill: colors[i % colors.length],
  }));
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RechartsFunnel>
          <Tooltip />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="var(--fg)" stroke="none" dataKey="name" />
          </Funnel>
        </RechartsFunnel>
      </ResponsiveContainer>
    </div>
  );
}
