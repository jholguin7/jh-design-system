"use client";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export interface ScrollSpyItem {
  id: string;
  label: string;
}

export interface ScrollSpyProps {
  items: ScrollSpyItem[];
  /** Offset in px from top before a section is considered "active" */
  offset?: number;
  className?: string;
}

export function ScrollSpy({ items, offset = 80, className }: ScrollSpyProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset) {
          setActiveId(items[i].id);
          return;
        }
      }
      setActiveId(items[0]?.id ?? null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items, offset]);

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Scroll spy">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "true" : undefined}
          className={cn(
            "px-2 py-1 text-xs rounded transition-colors",
            activeId === item.id
              ? "text-[var(--fg)] font-medium"
              : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
