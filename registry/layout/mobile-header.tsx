"use client";
import { Menu } from "lucide-react";
import { cn } from "../lib/cn";

export interface MobileHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function MobileHeader({
  title,
  onMenuClick,
  rightSlot,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 md:hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuClick}
            className="p-1.5 rounded-md text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-[14px] font-semibold text-[var(--fg)] truncate">{title}</h1>
        )}
      </div>
      {rightSlot && <div className="flex items-center gap-1 shrink-0">{rightSlot}</div>}
    </header>
  );
}
