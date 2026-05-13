"use client";
import { useState, useEffect } from "react";
import { cn } from "../lib/cn";

export interface NestedTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface NestedTabsProps {
  tabs: NestedTab[];
  /** Controlled active id. If omitted, component is self-managed. */
  activeId?: string;
  onChange?: (id: string) => void;
  /** When set, persists active tab to localStorage under this key. */
  storageKey?: string;
  className?: string;
}

export function NestedTabs({
  tabs,
  activeId,
  onChange,
  storageKey,
  className,
}: NestedTabsProps) {
  const initial = tabs[0]?.id ?? "";
  const [internal, setInternal] = useState<string>(activeId ?? initial);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const stored = localStorage.getItem(storageKey);
    if (stored && tabs.find((t) => t.id === stored)) setInternal(stored);
  }, [storageKey, tabs]);

  const current = activeId ?? internal;

  const setActive = (id: string) => {
    if (!activeId) setInternal(id);
    onChange?.(id);
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, id);
      } catch {
        /* ignore */
      }
    }
  };

  const active = tabs.find((t) => t.id === current) ?? tabs[0];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-1 border-b border-[var(--border)]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-[var(--primary)] text-[var(--fg)]"
                  : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="flex-1">
        {active?.content}
      </div>
    </div>
  );
}
