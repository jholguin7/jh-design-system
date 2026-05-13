"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Preferences {
  theme: "light" | "dark";
  lang: "es" | "en";
  density: "compact" | "comfortable";
  sidebarCollapsed: boolean;
}

const DEFAULTS: Preferences = {
  theme: "light",
  lang: "es",
  density: "comfortable",
  sidebarCollapsed: false,
};

export interface PrefsAdapter {
  load(): Promise<Partial<Preferences>>;
  save(p: Partial<Preferences>): Promise<void>;
}

/** Default adapter: localStorage. Consumer can pass Firebase/Supabase/Mongo adapter. */
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

interface PrefsCtx extends Preferences {
  setTheme: (t: "light" | "dark") => void;
  setLang: (l: "es" | "en") => void;
  setDensity: (d: "compact" | "comfortable") => void;
  setSidebarCollapsed: (b: boolean) => void;
}

const Ctx = createContext<PrefsCtx | null>(null);

export function PreferencesProvider({
  children,
  adapter = localStorageAdapter,
}: {
  children: ReactNode;
  adapter?: PrefsAdapter;
}) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  useEffect(() => {
    adapter.load().then((p) => setPrefs((prev) => ({ ...prev, ...p })));
  }, [adapter]);
  const update = (p: Partial<Preferences>) => {
    setPrefs((prev) => ({ ...prev, ...p }));
    adapter.save(p);
  };
  return (
    <Ctx.Provider
      value={{
        ...prefs,
        setTheme: (t) => update({ theme: t }),
        setLang: (l) => update({ lang: l }),
        setDensity: (d) => update({ density: d }),
        setSidebarCollapsed: (b) => update({ sidebarCollapsed: b }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences(): PrefsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePreferences must be used within PreferencesProvider");
  return c;
}
