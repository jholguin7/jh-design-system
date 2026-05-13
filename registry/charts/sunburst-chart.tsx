"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
}

export interface SunburstChartProps {
  root: SunburstNode;
  height?: number;
  /** Optional fill palette for rings */
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = [
  "var(--primary)",
  "var(--primary-hover)",
  "var(--primary-light)",
  "var(--primary-dark)",
  "var(--signal-ok)",
  "var(--signal-warn)",
];

function flatten(node: SunburstNode, depth = 0): Array<{ name: string; value: number; depth: number }> {
  if (!node.children || node.children.length === 0) {
    return [{ name: node.name, value: node.value ?? 0, depth }];
  }
  return node.children.flatMap((c) => flatten(c, depth + 1));
}

/**
 * Minimal sunburst: rings drawn as concentric pies. For deep hierarchies,
 * use a dedicated sunburst lib downstream; this serves the 1-2 ring case.
 */
export function SunburstChart({
  root,
  height = 280,
  colors = DEFAULT_COLORS,
  className,
}: SunburstChartProps) {
  const leaves = flatten(root);
  const maxDepth = Math.max(1, ...leaves.map((l) => l.depth));
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          {Array.from({ length: maxDepth }).map((_, ring) => {
            const ringData = leaves.filter((l) => l.depth === ring + 1);
            if (ringData.length === 0) return null;
            const inner = 30 + ring * 35;
            const outer = inner + 30;
            return (
              <Pie
                key={ring}
                data={ringData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={inner}
                outerRadius={outer}
              >
                {ringData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
            );
          })}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
