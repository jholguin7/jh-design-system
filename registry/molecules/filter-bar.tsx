"use client";
import { cn } from "../lib/cn";

export type FilterValue = string | number | string[] | undefined;

export type FilterDef =
  | {
      id: string;
      type: "select";
      label: string;
      options: { value: string; label: string }[];
    }
  | {
      id: string;
      type: "text";
      label: string;
      placeholder?: string;
    }
  | {
      id: string;
      type: "multi-select";
      label: string;
      options: { value: string; label: string }[];
    };

export interface FilterBarProps {
  filters: FilterDef[];
  state: Record<string, FilterValue>;
  onChange: (id: string, value: FilterValue) => void;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

export function FilterBar({
  filters,
  state,
  onChange,
  onClear,
  clearLabel = "Clear",
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-2",
        className,
      )}
    >
      {filters.map((f) => {
        if (f.type === "text") {
          return (
            <input
              key={f.id}
              type="text"
              placeholder={f.placeholder ?? f.label}
              value={(state[f.id] as string) ?? ""}
              onChange={(e) => onChange(f.id, e.target.value || undefined)}
              className="h-8 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2 text-xs"
              aria-label={f.label}
            />
          );
        }
        if (f.type === "select") {
          return (
            <select
              key={f.id}
              value={(state[f.id] as string) ?? ""}
              onChange={(e) => onChange(f.id, e.target.value || undefined)}
              className="h-8 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-2 text-xs"
              aria-label={f.label}
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          );
        }
        // multi-select rendered as comma-separated label for brevity;
        // consumer can replace with a richer popover-based picker.
        const selected = (state[f.id] as string[]) ?? [];
        return (
          <details key={f.id} className="relative">
            <summary className="list-none cursor-pointer h-8 px-2 rounded-md border border-[var(--border)] text-xs flex items-center bg-[var(--bg-card)]">
              {f.label} {selected.length > 0 && `(${selected.length})`}
            </summary>
            <div className="absolute z-30 mt-1 rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-2 shadow-lg min-w-[160px]">
              {f.options.map((o) => {
                const isOn = selected.includes(o.value);
                return (
                  <label key={o.value} className="flex items-center gap-2 text-xs py-0.5">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => {
                        const next = isOn
                          ? selected.filter((v) => v !== o.value)
                          : [...selected, o.value];
                        onChange(f.id, next.length > 0 ? next : undefined);
                      }}
                    />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </details>
        );
      })}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="h-8 px-2 rounded-md text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}
