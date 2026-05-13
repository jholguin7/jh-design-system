"use client";

import { useState, useCallback } from "react";

export type SortDir = "asc" | "desc";
export interface SortState { key: string; dir: SortDir; }

export function useSort(defaultKey = "", defaultDir: SortDir = "asc") {
  const [sort, setSort] = useState<SortState>({ key: defaultKey, dir: defaultDir });

  const toggle = useCallback((key: string) => {
    setSort(prev => {
      if (prev.key === key) return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  }, []);

  return { sort, toggle };
}

/** Generic client-side sort — works with any object array */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortLeads<T>(items: T[], sort: SortState): T[] {
  if (!sort.key) return items;
  const k = sort.key;
  const dir = sort.dir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = getValue(a as Record<string, unknown>, k);
    const bv = getValue(b as Record<string, unknown>, k);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

const KEY_MAP: Record<string, string> = {
  name: "display_name",
  msgs: "message_count",
  asesor: "asesor-asignado",
  summary: "chat-summary",
  notes: "notas",
};

const DATE_FIELDS = new Set(["appointment", "end-date", "created_at", "updated_at"]);

function getValue(item: Record<string, unknown>, key: string): string | number | null {
  const field = KEY_MAP[key] || key;
  const v = item[field];
  // For asesor-asignado, empty/legacy values display as "AI" — sort consistently.
  if (field === "asesor-asignado") {
    if (v == null || typeof v !== "string") return "AI";
    const trimmed = v.trim();
    if (!trimmed || trimmed === "n/a" || trimmed === "-" || trimmed.toLowerCase() === "ai" || trimmed.toLowerCase() === "bot") return "AI";
    return trimmed;
  }
  if (v == null || v === "n/a" || v === "") return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    if (field === "msg-count") return Number(v) || 0;
    if (DATE_FIELDS.has(field)) {
      const ts = new Date(v).getTime();
      return isNaN(ts) ? null : ts;
    }
    return v;
  }
  return null;
}
