"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es, enUS } from "react-day-picker/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useLang } from "../hooks/use-lang";
import { useMediaQuery } from "../hooks/use-media-query";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date | undefined, lang: string): string {
  if (!date) return "";
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({ value, onChange, placeholder, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const selected = parseDate(value);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1.5 rounded-lg h-9 px-3 text-xs border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg)] hover:border-[var(--primary)] focus:border-[var(--primary)] focus:outline-none transition-colors ${!value ? "text-[var(--fg-muted)]" : ""} ${className || ""}`}
        >
          <CalendarIcon className="h-3 w-3 shrink-0 opacity-60" />
          <span>{selected ? formatDate(selected, lang) : placeholder || "Pick date"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={isDesktop ? "start" : "center"}
        className={isDesktop ? "w-auto p-2" : "w-[calc(100vw-24px)] p-2"}
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? toIso(date) : undefined);
            setOpen(false);
          }}
          locale={lang === "es" ? es : enUS}
          className={isDesktop ? "" : "w-full [&_.rdp-month]:w-full [&_.rdp-month_table]:w-full"}
          style={{
            "--rdp-accent-color": "var(--primary)",
            "--rdp-accent-background-color": "color-mix(in srgb, var(--primary) 15%, transparent)",
            "--rdp-day-height": isDesktop ? "28px" : "44px",
            "--rdp-day-width": isDesktop ? "28px" : "44px",
            "--rdp-day_button-height": isDesktop ? "28px" : "44px",
            "--rdp-day_button-width": isDesktop ? "28px" : "44px",
            fontSize: isDesktop ? "12px" : "15px",
          } as React.CSSProperties}
        />
        {value && (
          <div className="border-t border-[var(--border-subtle)] px-2 py-1.5 mt-1">
            <button
              type="button"
              onClick={() => { onChange(undefined); setOpen(false); }}
              className="text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              {lang === "es" ? "Limpiar" : "Clear"}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
