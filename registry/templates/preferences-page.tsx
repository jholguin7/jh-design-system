"use client";
import { cn } from "../lib/cn";

export interface PrefItem {
  id: string;
  label: string;
  description?: string;
  /** Consumer supplies the control widget (toggle, select, picker, …) */
  control: React.ReactNode;
}

export interface PrefSection {
  id: string;
  title: string;
  description?: string;
  items: PrefItem[];
}

export interface PreferencesPageProps {
  sections: PrefSection[];
  pageTitle?: string;
  className?: string;
}

export function PreferencesPage({
  sections,
  pageTitle = "Preferences",
  className,
}: PreferencesPageProps) {
  return (
    <div className={cn("max-w-3xl mx-auto py-8 px-4", className)}>
      <h1 className="text-2xl font-bold text-[var(--fg)] mb-6">{pageTitle}</h1>
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-3">
            <header>
              <h2 className="text-base font-semibold text-[var(--fg)]">{section.title}</h2>
              {section.description && (
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                  {section.description}
                </p>
              )}
            </header>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] divide-y divide-[var(--border-subtle)]">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-[var(--fg)]">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-xs text-[var(--fg-muted)]">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0">{item.control}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
