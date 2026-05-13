"use client";
import { cn } from "../lib/cn";

export interface FeatureItem {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface FeaturesProps {
  items: FeatureItem[];
  className?: string;
}

export function Features({ items, className }: FeaturesProps) {
  return (
    <section className={cn("py-16 px-6", className)}>
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <article
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              {Icon && (
                <div className="w-10 h-10 rounded-md bg-[var(--primary-faint)] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[var(--primary-dark)]" />
                </div>
              )}
              <h3 className="text-base font-semibold text-[var(--fg)]">{it.title}</h3>
              <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                {it.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
