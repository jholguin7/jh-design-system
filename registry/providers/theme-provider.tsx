"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { themes, defaultThemeId, type Theme } from "../tokens/themes";

interface ThemeContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
  themes: Theme[];
}

const Ctx = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "jh.theme";

export function ThemeProvider({
  children,
  defaultMode = "light",
}: {
  children: ReactNode;
  defaultMode?: "light" | "dark";
}) {
  const [themeId, setThemeIdState] = useState(defaultThemeId);
  const [mode, setModeState] = useState<"light" | "dark">(defaultMode);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.themeId) setThemeIdState(p.themeId);
        if (p.mode) setModeState(p.mode);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Apply theme tokens to <html> on change
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const theme = themes.find((t) => t.id === themeId) ?? themes[0];
    const overrides = mode === "dark" ? theme.dark : theme.light;
    for (const [k, v] of Object.entries(overrides)) html.style.setProperty(k, v);
    html.classList.toggle("dark", mode === "dark");
    html.setAttribute("data-theme", themeId);
  }, [themeId, mode]);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId: id, mode }));
    } catch {
      /* ignore */
    }
  };
  const setMode = (m: "light" | "dark") => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId, mode: m }));
    } catch {
      /* ignore */
    }
  };

  return (
    <Ctx.Provider value={{ themeId, setThemeId, mode, setMode, themes }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
