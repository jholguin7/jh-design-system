"use client";
import { cn } from "../lib/cn";

export interface AdminProject {
  id: string;
  name: string;
  slug?: string;
  status?: string;
  members?: number;
}

export interface AdminProjectsPageProps {
  projects: AdminProject[];
  onCreate?: () => void;
  onConfigure?: (id: string) => void;
  createLabel?: string;
  configureLabel?: string;
  className?: string;
}

export function AdminProjectsPage({
  projects,
  onCreate,
  onConfigure,
  createLabel = "New project",
  configureLabel = "Configure",
  className,
}: AdminProjectsPageProps) {
  return (
    <div className={cn("max-w-4xl mx-auto py-8 px-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[var(--fg)]">Projects</h1>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="rounded-md bg-[var(--primary)] text-[var(--primary-fg)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--primary-hover)]"
          >
            {createLabel}
          </button>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2"
          >
            <header className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-[var(--fg)] truncate">
                  {p.name}
                </h2>
                {p.slug && (
                  <p className="text-[11px] text-[var(--fg-muted)] truncate">/{p.slug}</p>
                )}
              </div>
              {p.status && (
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                  {p.status}
                </span>
              )}
            </header>
            <footer className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--fg-muted)]">
              <span>{p.members ?? 0} members</span>
              {onConfigure && (
                <button
                  type="button"
                  onClick={() => onConfigure(p.id)}
                  className="text-[var(--primary-dark)] hover:underline"
                >
                  {configureLabel}
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
