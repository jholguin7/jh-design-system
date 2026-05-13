"use client";

import { useCallback, useEffect, useState } from "react";

export interface SavedGradient {
  name: string;
  colors: string[];
}

const STORAGE_KEY = "jh.gradients.saved";

function load(): SavedGradient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (g): g is SavedGradient =>
        g != null && typeof g === "object" &&
        typeof (g as { name?: unknown }).name === "string" &&
        Array.isArray((g as { colors?: unknown }).colors),
    );
  } catch {
    return [];
  }
}

function persist(gradients: SavedGradient[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gradients));
  } catch {
    /* ignore quota errors */
  }
}

export function useSavedGradients() {
  const [savedGradients, setSavedGradients] = useState<SavedGradient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSavedGradients(load());
    setIsLoading(false);
  }, []);

  const saveGradient = useCallback((name: string, colors: string[]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSavedGradients((prev) => {
      const filtered = prev.filter(
        (g) => g.name.toLowerCase() !== trimmed.toLowerCase(),
      );
      const next = [...filtered, { name: trimmed, colors }];
      persist(next);
      return next;
    });
  }, []);

  const deleteGradient = useCallback((name: string) => {
    setSavedGradients((prev) => {
      const next = prev.filter((g) => g.name !== name);
      persist(next);
      return next;
    });
  }, []);

  return { savedGradients, saveGradient, deleteGradient, isLoading };
}
