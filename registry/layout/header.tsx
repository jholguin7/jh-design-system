"use client";
import Link from "next/link";
import { cn } from "../lib/cn";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface HeaderProps {
  title?: string;
  breadcrumb?: Breadcrumb[];
  /** Right-aligned slot — theme picker, lang toggle, user menu, etc. */
  rightSlot?: React.ReactNode;
  /** If true, header sticks to top of scrolling container */
  sticky?: boolean;
  className?: string;
}

export function Header({
  title,
  breadcrumb,
  rightSlot,
  sticky = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-card)] px-6 py-3",
        sticky && "sticky top-0 z-30",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {b.href ? (
                  <Link href={b.href} className="hover:text-[var(--fg-secondary)]">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        {title && (
          <h1 className="text-[15px] font-semibold text-[var(--fg)] truncate">{title}</h1>
        )}
      </div>
      {rightSlot && <div className="flex items-center gap-2 shrink-0">{rightSlot}</div>}
    </header>
  );
}
