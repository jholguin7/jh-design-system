"use client";
import { cn } from "../lib/cn";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavbarLink[];
  rightSlot?: React.ReactNode;
  className?: string;
}

export function Navbar({
  brand,
  links = [],
  rightSlot,
  className,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur px-6 py-3",
        className,
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        {brand && <div className="flex items-center gap-2">{brand}</div>}
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 text-sm text-[var(--fg-secondary)]">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-[var(--fg)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </div>
    </header>
  );
}
