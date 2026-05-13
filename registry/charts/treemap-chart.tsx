"use client";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";

export interface TreemapNode {
  name: string;
  size?: number;
  children?: TreemapNode[];
  [key: string]: unknown;
}

export interface TreemapChartProps {
  data: TreemapNode[];
  height?: number;
  className?: string;
}

export function TreemapChart({ data, height = 280, className }: TreemapChartProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <Treemap
          data={data}
          dataKey="size"
          stroke="var(--bg-card)"
          fill="var(--primary)"
        >
          <Tooltip />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
