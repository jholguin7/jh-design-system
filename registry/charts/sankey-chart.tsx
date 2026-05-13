"use client";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";

export interface SankeyNode {
  name: string;
}
export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  className?: string;
}

export function SankeyChart({
  nodes,
  links,
  height = 320,
  className,
}: SankeyChartProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <Sankey
          data={{ nodes, links }}
          nodePadding={20}
          link={{ stroke: "var(--primary-light)" }}
          node={{ fill: "var(--primary)" }}
        >
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
