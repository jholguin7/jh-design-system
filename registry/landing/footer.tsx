"use client";
import { cn } from "../lib/cn";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocial {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FooterProps {
  links?: FooterLink[];
  legal?: string;
  socialLinks?: FooterSocial[];
  className?: string;
}

export function Footer({
  links = [],
  legal,
  socialLinks = [],
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[var(--border)] bg-[var(--bg-card)] py-8 px-6",
        className,
      )}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[var(--fg-secondary)] hover:text-[var(--fg)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {socialLinks.length > 0 && (
          <ul className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {legal && (
          <p className="text-xs text-[var(--fg-muted)]">{legal}</p>
        )}
      </div>
    </footer>
  );
}
