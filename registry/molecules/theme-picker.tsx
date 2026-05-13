"use client";
import { useTheme } from "../providers/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemePicker() {
  const { themeId, setThemeId, mode, setMode, themes } = useTheme();
  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Select theme"
        value={themeId}
        onChange={(e) => setThemeId(e.target.value)}
        className="rounded-md border px-2 py-1 text-sm"
      >
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-label="Toggle light/dark"
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        className="rounded-md border p-1.5 hover:bg-[var(--bg-subtle)]"
      >
        {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}
