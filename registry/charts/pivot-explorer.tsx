"use client";
import { useMemo } from "react";
import { cn } from "../lib/cn";

export type Aggregator = "sum" | "count" | "avg" | "max" | "min";

export interface PivotExplorerProps<TRow extends Record<string, string | number>> {
  rows: TRow[];
  rowField: keyof TRow;
  colField: keyof TRow;
  valueField: keyof TRow;
  aggregator?: Aggregator;
  className?: string;
}

function aggregate(values: number[], agg: Aggregator): number {
  if (values.length === 0) return 0;
  switch (agg) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "count":
      return values.length;
    case "avg":
      return values.reduce((a, b) => a + b, 0) / values.length;
    case "max":
      return Math.max(...values);
    case "min":
      return Math.min(...values);
  }
}

export function PivotExplorer<TRow extends Record<string, string | number>>({
  rows,
  rowField,
  colField,
  valueField,
  aggregator = "sum",
  className,
}: PivotExplorerProps<TRow>) {
  const { rowKeys, colKeys, grid } = useMemo(() => {
    const rkSet = new Set<string>();
    const ckSet = new Set<string>();
    const bucket = new Map<string, number[]>();
    for (const r of rows) {
      const rk = String(r[rowField]);
      const ck = String(r[colField]);
      const v = Number(r[valueField] ?? 0);
      rkSet.add(rk);
      ckSet.add(ck);
      const key = `${rk}||${ck}`;
      if (!bucket.has(key)) bucket.set(key, []);
      bucket.get(key)!.push(v);
    }
    const rowKeys = Array.from(rkSet);
    const colKeys = Array.from(ckSet);
    const grid: Record<string, Record<string, number>> = {};
    for (const rk of rowKeys) {
      grid[rk] = {};
      for (const ck of colKeys) {
        grid[rk][ck] = aggregate(bucket.get(`${rk}||${ck}`) ?? [], aggregator);
      }
    }
    return { rowKeys, colKeys, grid };
  }, [rows, rowField, colField, valueField, aggregator]);

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="border-collapse text-xs">
        <thead>
          <tr>
            <th className="text-left text-[var(--fg-muted)] font-normal px-2 py-1">
              {String(rowField)} ↓ / {String(colField)} →
            </th>
            {colKeys.map((ck) => (
              <th
                key={ck}
                className="text-right text-[var(--fg-muted)] font-normal px-2 py-1 border-b border-[var(--border-subtle)]"
              >
                {ck}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowKeys.map((rk) => (
            <tr key={rk}>
              <td className="px-2 py-1 text-[var(--fg-secondary)] font-medium">{rk}</td>
              {colKeys.map((ck) => (
                <td key={ck} className="px-2 py-1 text-right text-[var(--fg)] tabular-nums">
                  {Number.isInteger(grid[rk][ck])
                    ? grid[rk][ck]
                    : grid[rk][ck].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
