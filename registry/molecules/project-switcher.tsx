"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProjectOption {
  id: string;
  name: string;
  slug?: string;
}

export interface ProjectSwitcherProps {
  projects: ProjectOption[];
  currentId?: string;
  onSwitch: (id: string) => void;
  /** Optional create-new-project action; shown if provided */
  onCreate?: () => void;
  createLabel?: string;
  className?: string;
}

export function ProjectSwitcher({
  projects,
  currentId,
  onSwitch,
  onCreate,
  createLabel = "New project",
  className,
}: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const current = projects.find((p) => p.id === currentId);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
      >
        <span className="truncate">{current?.name ?? "Select project"}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-40 mt-1 w-full max-h-60 overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-card)] py-1 shadow-lg"
        >
          {projects.map((p) => {
            const isSelected = p.id === currentId;
            return (
              <li
                key={p.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSwitch(p.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-1.5 cursor-pointer text-sm hover:bg-[var(--bg-subtle)]",
                  isSelected && "bg-[var(--primary-faint)]",
                )}
              >
                <span className="truncate">{p.name}</span>
                {isSelected && <Check className="h-4 w-4 text-[var(--primary-dark)]" />}
              </li>
            );
          })}
          {onCreate && (
            <li className="border-t border-[var(--border-subtle)] mt-1">
              <button
                type="button"
                onClick={() => {
                  onCreate();
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-[var(--primary-dark)] hover:bg-[var(--bg-subtle)]"
              >
                + {createLabel}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
