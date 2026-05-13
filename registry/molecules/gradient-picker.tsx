"use client";
import { useState, useEffect } from "react";
import { cn } from "../lib/cn";

export interface GradientPreset {
  id: string;
  name: string;
  stops: string[];
}

const STORAGE = "jh.gradients.saved";

export interface GradientPickerProps {
  /** Built-in presets (always shown first) */
  presets?: GradientPreset[];
  /** Currently selected gradient id */
  value?: string;
  onChange: (gradient: GradientPreset) => void;
  /** Show a "save current" button — saves to localStorage by default */
  allowSave?: boolean;
  className?: string;
}

function loadSaved(): GradientPreset[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE) || "[]");
  } catch {
    return [];
  }
}

export function GradientPicker({
  presets = [],
  value,
  onChange,
  allowSave = false,
  className,
}: GradientPickerProps) {
  const [saved, setSaved] = useState<GradientPreset[]>([]);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const all = [...presets, ...saved];

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {all.map((g) => {
        const isSelected = g.id === value;
        return (
          <button
            key={g.id}
            type="button"
            aria-pressed={isSelected}
            title={g.name}
            onClick={() => onChange(g)}
            className={cn(
              "h-9 rounded-md border transition-all",
              isSelected
                ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                : "border-[var(--border)]",
            )}
            style={{
              backgroundImage: `linear-gradient(90deg, ${g.stops.join(",")})`,
            }}
          />
        );
      })}
      {allowSave && (
        <div className="col-span-4 text-[10px] text-[var(--fg-muted)] mt-1">
          Saved: {saved.length} | Presets: {presets.length}
        </div>
      )}
    </div>
  );
}
