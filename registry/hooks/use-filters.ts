"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { createElement } from "react";

export interface DashboardFilters {
  date_from?: string;
  date_to?: string;
  month?: string;
  interest_level?: string;   // comma-separated for multi-select: "3,4,5"
  status?: string;           // comma-separated for multi-select: "vendido,negociando"
  search?: string;
  proyecto?: string;
  max_msgs?: number;
  hour?: number;
}

interface FilterContextType {
  filters: DashboardFilters;
  updateFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  clearFilters: () => void;
  params: Record<string, string | number>;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>({});

  const updateFilter = useCallback(<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const params = useMemo(() => {
    const p: Record<string, string | number> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") p[k] = v;
    });
    return p;
  }, [filters]);

  return createElement(
    FilterContext.Provider,
    { value: { filters, updateFilter, clearFilters, params } },
    children
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return ctx;
}
