"use client";
import { cn } from "../lib/cn";

export interface CtaSectionProps {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  onCta?: () => void;
  ctaHref?: string;
  className?: string;
}

export function CtaSection({
  title,
  subtitle,
  ctaLabel,
  onCta,
  ctaHref,
  className,
}: CtaSectionProps) {
  return (
    <section className={cn("py-16 px-6 bg-[var(--primary-faint)]", className)}>
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
        <h2 className="text-3xl font-bold text-[var(--fg)]">{title}</h2>
        {subtitle && (
          <p className="text-base text-[var(--fg-secondary)] max-w-xl">{subtitle}</p>
        )}
        {ctaHref ? (
          <a
            href={ctaHref}
            className="mt-2 inline-flex items-center rounded-md bg-[var(--primary)] text-[var(--primary-fg)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-hover)]"
          >
            {ctaLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onCta}
            className="mt-2 inline-flex items-center rounded-md bg-[var(--primary)] text-[var(--primary-fg)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-hover)]"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </section>
  );
}
