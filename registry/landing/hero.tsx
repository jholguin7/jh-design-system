"use client";
import Link from "next/link";
import { cn } from "../lib/cn";

export interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: React.ReactNode;
  className?: string;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  image,
  className,
}: HeroProps) {
  return (
    <section className={cn("flex flex-col md:flex-row items-center gap-8 py-16 px-6", className)}>
      <div className="flex-1 flex flex-col gap-4 max-w-xl">
        {eyebrow && (
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--primary-dark)]">
            {eyebrow}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--fg)] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-[var(--fg-secondary)] leading-relaxed">{subtitle}</p>
        )}
        {(ctaLabel || secondaryCtaLabel) && (
          <div className="flex gap-3 mt-2">
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="rounded-md bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2 text-sm font-medium hover:bg-[var(--primary-hover)]"
              >
                {ctaLabel}
              </Link>
            )}
            {secondaryCtaLabel && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="rounded-md border border-[var(--border)] text-[var(--fg)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-subtle)]"
              >
                {secondaryCtaLabel}
              </Link>
            )}
          </div>
        )}
      </div>
      {image && <div className="flex-1">{image}</div>}
    </section>
  );
}
