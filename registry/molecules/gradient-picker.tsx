"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeftRight, Check, ChevronDown, GripVertical, Plus, Save, X,
} from "lucide-react";
import {
  GRADIENT_PRESETS, generateSingleColorGradient, interpolateGradient,
  resolveGradientStops,
} from "../lib/gradients";
import type { GradientConfig } from "../hooks/use-preferences";
import { useSavedGradients } from "../hooks/use-saved-gradients";
import { cn } from "../lib/cn";

export interface GradientPickerLabels {
  presetGradients?: string;
  customGradient?: string;
  savedGradients?: string;
  noSavedGradients?: string;
  customGradientDesc?: string;
  colorPrimary?: string;
  colorStop?: string;
  addColorStop?: string;
  preview?: string;
  gradientName?: string;
  saveGradient?: string;
  deleteGradient?: string;
  flipGradient?: string;
}

const DEFAULT_LABELS: Required<GradientPickerLabels> = {
  presetGradients: "Presets",
  customGradient: "Custom",
  savedGradients: "Saved gradients",
  noSavedGradients: "No saved gradients yet.",
  customGradientDesc: "Pick up to 5 colors. The last color becomes the primary accent.",
  colorPrimary: "Primary",
  colorStop: "Stop",
  addColorStop: "Add color stop",
  preview: "Preview",
  gradientName: "Gradient name",
  saveGradient: "Save",
  deleteGradient: "Delete",
  flipGradient: "Flip gradient",
};

export interface GradientPickerProps {
  value: GradientConfig;
  onChange: (g: GradientConfig) => void;
  disabled?: boolean;
  /** Optional i18n labels. English defaults used when omitted. */
  labels?: GradientPickerLabels;
  className?: string;
}

function GradientBar({ stops, size = "md" }: { stops: string[]; size?: "sm" | "md" }) {
  const colors = interpolateGradient(stops, 9);
  const h = size === "sm" ? "h-5" : "h-7";
  return (
    <div className={`flex ${h} rounded-lg overflow-hidden w-full`}>
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

export function GradientPicker({
  value, onChange, disabled, labels, className,
}: GradientPickerProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const { savedGradients, saveGradient, deleteGradient } = useSavedGradients();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"presets" | "custom">("presets");
  const [customColors, setCustomColors] = useState<string[]>(
    value.id === "custom" && value.customStops
      ? value.customStops
      : value.id === "custom" && value.stops
        ? [value.stops[value.stops.length - 1]]
        : ["#D97757"],
  );
  const [saveName, setSaveName] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popupHeight = 400;
    const width = Math.max(rect.width, 340);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const top = spaceBelow >= popupHeight
      ? rect.bottom + 8
      : Math.max(8, rect.top - popupHeight - 8);
    setPopupPos({ top, left: rect.left, width });
  }, []);

  useEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleCustomUpdate = useCallback((colors: string[]) => {
    setCustomColors(colors);
    const stops = colors.length === 1
      ? generateSingleColorGradient(colors[0])
      : interpolateGradient(colors, 7);
    onChange({ id: "custom", stops, customStops: colors, savedName: undefined });
  }, [onChange]);

  useEffect(() => {
    if (dragIdx === null) return;
    const handleMove = (e: PointerEvent) => {
      const y = e.clientY;
      let closest = -1;
      let closestDist = Infinity;
      for (let i = 0; i < rowRefs.current.length; i++) {
        const el = rowRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(y - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }
      setOverIdx(closest >= 0 && closest !== dragIdx ? closest : null);
    };
    const handleUp = () => {
      if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
        const reordered = [...customColors];
        const [moved] = reordered.splice(dragIdx, 1);
        reordered.splice(overIdx, 0, moved);
        handleCustomUpdate(reordered);
      }
      setDragIdx(null);
      setOverIdx(null);
    };
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, [dragIdx, overIdx, customColors, handleCustomUpdate]);

  const currentStops = resolveGradientStops(value.id, value.stops);

  const handlePresetClick = (id: string) => {
    onChange({ id });
    setOpen(false);
  };

  const addCustomColor = () => {
    if (customColors.length < 5) handleCustomUpdate([...customColors, "#888888"]);
  };

  const removeCustomColor = (idx: number) => {
    if (customColors.length > 1) {
      handleCustomUpdate(customColors.filter((_, i) => i !== idx));
    }
  };

  const updateCustomColor = (idx: number, hex: string) => {
    const next = [...customColors];
    next[idx] = hex;
    handleCustomUpdate(next);
  };

  const handleSave = () => {
    if (saveName.trim()) {
      saveGradient(saveName, customColors);
      setSaveName("");
    }
  };

  const resolveStopsForColors = (colors: string[]) =>
    colors.length === 1
      ? generateSingleColorGradient(colors[0])
      : interpolateGradient(colors, 7);

  return (
    <div ref={triggerRef} className={cn(className, disabled && "opacity-40 pointer-events-none")}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 flex-1 rounded-xl border border-[var(--border)] hover:border-[var(--fg-muted)] p-2 transition-colors"
        >
          <div className="flex-1">
            <GradientBar stops={currentStops} size="sm" />
          </div>
          <span className="text-[11px] text-[var(--fg-muted)] font-medium shrink-0">
            {value.id === "custom"
              ? (value.savedName || t.customGradient)
              : GRADIENT_PRESETS.find((p) => p.id === value.id)?.name || value.id}
          </span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-[var(--fg-muted)] transition-transform", open && "rotate-180")} />
        </button>
        <button
          type="button"
          onClick={() => {
            const flipped = [...currentStops].reverse();
            const flippedCustom = [...customColors].reverse();
            onChange({ id: "custom", stops: flipped, customStops: flippedCustom, savedName: undefined });
            setCustomColors(flippedCustom);
          }}
          title={t.flipGradient}
          className="shrink-0 p-2 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4 text-[var(--fg-muted)]" />
        </button>
      </div>

      {open && popupPos && typeof document !== "undefined" && createPortal(
        <div
          ref={popupRef}
          className="fixed z-[9999] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg overflow-hidden flex flex-col"
          style={{
            top: popupPos.top, left: popupPos.left, width: popupPos.width,
            maxHeight: `calc(100vh - ${popupPos.top + 8}px)`,
          }}
        >
          <div className="flex border-b border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setTab("presets")}
              className={cn(
                "flex-1 py-2.5 text-[12px] font-medium transition-colors",
                tab === "presets"
                  ? "text-[var(--primary-readable)] border-b-2 border-[var(--primary)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {t.presetGradients}
            </button>
            <button
              type="button"
              onClick={() => setTab("custom")}
              className={cn(
                "flex-1 py-2.5 text-[12px] font-medium transition-colors",
                tab === "custom"
                  ? "text-[var(--primary-readable)] border-b-2 border-[var(--primary)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
            >
              {t.customGradient}
            </button>
          </div>

          {tab === "presets" && (
            <div className="p-3 grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">
              {GRADIENT_PRESETS.map((preset) => {
                const isActive = value.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset.id)}
                    className={cn(
                      "rounded-xl p-2 transition-all text-left border",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary-faint)]"
                        : "border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-subtle)]",
                    )}
                  >
                    <GradientBar stops={preset.stops} size="sm" />
                    <div className="flex items-center justify-between mt-1.5 px-0.5">
                      <span className="text-[11px] font-medium text-[var(--fg-secondary)]">{preset.name}</span>
                      {isActive && <Check className="h-3 w-3 text-[var(--primary-readable)]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "custom" && (
            <div className="p-4 space-y-4 overflow-y-auto">
              {savedGradients.length > 0 ? (
                <div className="space-y-1.5 pb-3 mb-1 border-b border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider font-semibold">
                    {t.savedGradients}
                  </span>
                  {savedGradients.map((sg) => {
                    const isActive = value.savedName === sg.name;
                    const sgStops = resolveStopsForColors(sg.colors);
                    return (
                      <div
                        key={sg.name}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-all border",
                          isActive
                            ? "border-[var(--primary)] bg-[var(--primary-faint)]"
                            : "border-transparent hover:bg-[var(--bg-subtle)]",
                        )}
                        onClick={() => {
                          setCustomColors(sg.colors);
                          onChange({ id: "custom", stops: sgStops, customStops: sg.colors, savedName: sg.name });
                        }}
                      >
                        <div className="flex-1">
                          <GradientBar stops={sgStops} size="sm" />
                        </div>
                        <span className="text-[10px] text-[var(--fg-secondary)] font-medium shrink-0 max-w-[80px] truncate">
                          {sg.name}
                        </span>
                        {isActive && <Check className="h-3 w-3 text-[var(--primary-readable)] shrink-0" />}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteGradient(sg.name); }}
                          className="text-[var(--fg-muted)] hover:text-[var(--fg)] shrink-0"
                          title={t.deleteGradient}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-[var(--fg-muted)] italic pb-2 border-b border-[var(--border-subtle)] mb-1">
                  {t.noSavedGradients}
                </p>
              )}

              <p className="text-[11px] text-[var(--fg-muted)]">{t.customGradientDesc}</p>

              <div className="space-y-1">
                {customColors.map((color, idx) => (
                  <div
                    key={idx}
                    ref={(el) => { rowRefs.current[idx] = el; }}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-1 py-1 transition-all",
                      dragIdx === idx && "opacity-50",
                      overIdx === idx && "ring-1 ring-[var(--primary)]",
                    )}
                  >
                    {customColors.length > 1 && (
                      <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing text-[var(--fg-muted)] hover:text-[var(--fg)] touch-none"
                        onPointerDown={(e) => { e.preventDefault(); setDragIdx(idx); }}
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <span className="text-[10px] text-[var(--fg-muted)] w-12 shrink-0">
                      {idx === customColors.length - 1 ? t.colorPrimary : `${t.colorStop} ${idx + 1}`}
                    </span>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateCustomColor(idx, e.target.value)}
                      className="w-7 h-7 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent p-0.5 shrink-0"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateCustomColor(idx, e.target.value);
                      }}
                      className="w-20 px-2 py-1 text-[11px] rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] font-mono"
                    />
                    {customColors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomColor(idx)}
                        className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {customColors.length < 5 && (
                <button
                  type="button"
                  onClick={addCustomColor}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--primary-readable)] font-medium hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  {t.addColorStop}
                </button>
              )}

              <div>
                <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider font-semibold">
                  {t.preview}
                </span>
                <div className="mt-1.5">
                  <GradientBar
                    stops={
                      value.id === "custom" && value.stops
                        ? value.stops
                        : generateSingleColorGradient(customColors[customColors.length - 1])
                    }
                    size="md"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder={t.gradientName}
                  maxLength={30}
                  className="flex-1 px-2 py-1.5 text-[11px] rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-muted)]"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                    saveName.trim()
                      ? "bg-[var(--primary)] text-[var(--primary-fg)] hover:bg-[var(--primary-hover)]"
                      : "bg-[var(--bg-subtle)] text-[var(--fg-muted)] cursor-not-allowed",
                  )}
                >
                  <Save className="h-3 w-3" /> {t.saveGradient}
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
