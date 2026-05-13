"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_GRADIENT_ID, GRADIENT_PRESETS, generateSingleColorGradient,
  hexToHsl, hslToHex, interpolateGradient, relativeLuminance,
  resolveGradientStops, type GradientPreset,
} from "../lib/gradients";

// ── Gradient config ─────────────────────────────────────────────────────────

export interface GradientConfig {
  id: string;
  stops?: string[];
  customStops?: string[];
  savedName?: string;
}

// ── Preference shape ────────────────────────────────────────────────────────

export type Theme = "light" | "dark";
export type Lang = "es" | "en";
export type Density = "compact" | "comfortable";

export interface Preferences {
  gradient: GradientConfig;
  theme: Theme;
  lang: Lang;
  density: Density;
  sidebarCollapsed: boolean;
}

const DEFAULT_ACCENT = "#f8ff99";
const DEFAULT_GRADIENT: GradientConfig = { id: DEFAULT_GRADIENT_ID };

const DEFAULTS: Preferences = {
  gradient: DEFAULT_GRADIENT,
  theme: "light",
  lang: "es",
  density: "comfortable",
  sidebarCollapsed: false,
};

// ── Adapter (pluggable storage) ─────────────────────────────────────────────

export interface PrefsAdapter {
  load(): Promise<Partial<Preferences>>;
  save(p: Partial<Preferences>): Promise<void>;
}

export const localStorageAdapter: PrefsAdapter = {
  async load() {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("jh.prefs") || "{}");
    } catch {
      return {};
    }
  },
  async save(p) {
    if (typeof window === "undefined") return;
    try {
      const curr = JSON.parse(localStorage.getItem("jh.prefs") || "{}");
      localStorage.setItem("jh.prefs", JSON.stringify({ ...curr, ...p }));
    } catch {
      /* ignore */
    }
  },
};

// ── Smart contrast (WCAG AA, 3:1) ───────────────────────────────────────────

const LIGHT_BG_LUM = 0.95;
const DARK_BG_LUM = 0.05;
const MIN_CONTRAST = 3.0;

function contrastRatio(lum1: number, lum2: number): number {
  const [lighter, darker] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1];
  return (lighter + 0.05) / (darker + 0.05);
}

export function ensureReadable(hex: string, bgLum: number): string | null {
  const lum = relativeLuminance(hex);
  if (contrastRatio(lum, bgLum) >= MIN_CONTRAST) return hex;
  const [h, s, l] = hexToHsl(hex);
  const shouldDarken = bgLum > 0.5;
  for (let step = 1; step <= 18; step++) {
    const newL = shouldDarken ? Math.max(l - step * 5, 5) : Math.min(l + step * 5, 95);
    const lDelta = Math.abs(newL - l);
    if (lDelta > 25) return null;
    const newS = Math.round(Math.max(s * Math.max(1 - lDelta / 55, 0.15), 8));
    const candidate = hslToHex(h, newS, newL);
    if (contrastRatio(relativeLuminance(candidate), bgLum) >= MIN_CONTRAST) return candidate;
  }
  return null;
}

// ── Palette + stages + bar text + bg tints ──────────────────────────────────

export function generatePalette(hex: string): Record<string, string> {
  const [h, s, l] = hexToHsl(hex);
  const onLight = ensureReadable(hex, LIGHT_BG_LUM);
  const onDark = ensureReadable(hex, DARK_BG_LUM);
  const palette: Record<string, string> = {
    "--primary": hex,
    "--primary-fg": relativeLuminance(hex) < 0.4 ? "#ffffff" : "#000000",
    "--primary-hover": hslToHex(h, Math.min(s + 5, 100), Math.max(l - 8, 10)),
    "--primary-light": hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 85)),
    "--primary-lighter": hslToHex(h, Math.min(s + 5, 100), Math.min(l + 30, 90)),
    "--primary-faint": hslToHex(h, Math.max(s - 20, 10), Math.min(l + 38, 95)),
    "--primary-dark": hslToHex(h, Math.min(s + 5, 100), Math.max(l - 15, 15)),
  };
  if (onLight) palette["--primary-on-light"] = onLight;
  if (onDark) palette["--primary-on-dark"] = onDark;
  return palette;
}

export function generateStagesFromGradient(stops: string[]): Record<string, string> {
  const interpolated = interpolateGradient(stops, 11);
  const reversed = [...interpolated].reverse();
  const stages: Record<string, string> = {};
  for (let i = 0; i <= 10; i++) {
    const c = reversed[i];
    stages[`--stage-${i}`] = c;
    stages[`--stage-${i}-fg`] = relativeLuminance(c) < 0.4 ? "#ffffff" : "#000000";
  }
  return stages;
}

function generateBarText(hex: string): Record<string, string> {
  const [h] = hexToHsl(hex);
  return { "--bar-text": hslToHex(h, 30, 22) };
}

function generateBgTints(hex: string, mode: Theme): Record<string, string> {
  const [h] = hexToHsl(hex);
  if (mode === "light") {
    return {
      "--bg": hslToHex(h, 8, 97.5),
      "--bg-subtle": hslToHex(h, 7, 94.5),
      "--bg-muted": hslToHex(h, 6, 91),
      "--fg": hslToHex(h, 9, 11),
      "--fg-secondary": hslToHex(h, 5, 40),
      "--fg-muted": hslToHex(h, 4, 58),
      "--border": hslToHex(h, 6, 89),
      "--border-subtle": hslToHex(h, 4, 92.5),
    };
  }
  return {
    "--bg": hslToHex(h, 6, 9),
    "--bg-card": hslToHex(h, 5, 14),
    "--bg-subtle": hslToHex(h, 5, 17),
    "--bg-muted": hslToHex(h, 4, 22),
    "--fg": hslToHex(h, 6, 92.5),
    "--fg-secondary": hslToHex(h, 4, 64),
    "--fg-muted": hslToHex(h, 3, 41),
    "--border": hslToHex(h, 4, 22),
    "--border-subtle": hslToHex(h, 5, 17),
  };
}

const BG_KEYS = [
  "--bg", "--bg-card", "--bg-subtle", "--bg-muted",
  "--fg", "--fg-secondary", "--fg-muted",
  "--border", "--border-subtle",
];

export function applyPaletteToRoot(stops: string[], mode: Theme = "light"): void {
  if (typeof document === "undefined") return;
  const primary = stops[stops.length - 1] || DEFAULT_ACCENT;
  const palette = generatePalette(primary);
  const stages = generateStagesFromGradient(stops);
  const barText = generateBarText(primary);
  const bgTints = generateBgTints(primary, mode);
  const root = document.documentElement;
  root.style.removeProperty("--primary-on-light");
  root.style.removeProperty("--primary-on-dark");
  for (const [k, v] of Object.entries({ ...palette, ...stages, ...barText, ...bgTints })) {
    root.style.setProperty(k, v);
  }
}

export function clearPaletteFromRoot(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const keys = [
    "--primary", "--primary-fg", "--primary-hover", "--primary-light",
    "--primary-lighter", "--primary-faint", "--primary-dark",
    "--primary-on-light", "--primary-on-dark",
    "--bar-text",
    ...BG_KEYS,
  ];
  for (let i = 0; i <= 10; i++) keys.push(`--stage-${i}`, `--stage-${i}-fg`);
  for (const k of keys) root.style.removeProperty(k);
}

// ── Migration helpers ───────────────────────────────────────────────────────

function migrateGradient(loaded: Partial<Preferences>): GradientConfig {
  const g = (loaded as { gradient?: unknown }).gradient;
  if (g && typeof g === "object" && "id" in (g as object)) return g as GradientConfig;
  const accent = (loaded as { accent?: unknown }).accent;
  if (typeof accent === "string" && accent !== DEFAULT_ACCENT) {
    return { id: "custom", stops: generateSingleColorGradient(accent) };
  }
  return DEFAULT_GRADIENT;
}

// ── Context ─────────────────────────────────────────────────────────────────

export interface PreferencesContextValue extends Preferences {
  accent: string;
  setGradient: (g: GradientConfig) => void;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
  setDensity: (d: Density) => void;
  setSidebarCollapsed: (b: boolean) => void;
}

const Ctx = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({
  children,
  adapter = localStorageAdapter,
  applyPalette = true,
}: {
  children: ReactNode;
  adapter?: PrefsAdapter;
  applyPalette?: boolean;
}) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    adapter.load().then((loaded) => {
      if (cancelled) return;
      const gradient = migrateGradient(loaded);
      setPrefs((prev) => ({ ...prev, ...loaded, gradient }));
    });
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", prefs.theme === "dark");
  }, [prefs.theme]);

  useEffect(() => {
    if (!applyPalette) return;
    const stops = resolveGradientStops(prefs.gradient.id, prefs.gradient.stops);
    applyPaletteToRoot(stops, prefs.theme);
  }, [applyPalette, prefs.gradient, prefs.theme]);

  const update = useCallback(
    (p: Partial<Preferences>) => {
      setPrefs((prev) => ({ ...prev, ...p }));
      adapter.save(p);
    },
    [adapter],
  );

  const accent = useMemo(() => {
    const stops = resolveGradientStops(prefs.gradient.id, prefs.gradient.stops);
    return stops[stops.length - 1] || DEFAULT_ACCENT;
  }, [prefs.gradient]);

  const value: PreferencesContextValue = {
    ...prefs,
    accent,
    setGradient: (g) => update({ gradient: g }),
    setTheme: (t) => update({ theme: t }),
    setLang: (l) => update({ lang: l }),
    setDensity: (d) => update({ density: d }),
    setSidebarCollapsed: (b) => update({ sidebarCollapsed: b }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePreferences must be used within PreferencesProvider");
  return c;
}

export { GRADIENT_PRESETS, resolveGradientStops, generateSingleColorGradient };
export type { GradientPreset };
