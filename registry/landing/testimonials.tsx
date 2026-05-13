"use client";
import { cn } from "../lib/cn";

export interface Testimonial {
  author: string;
  role?: string;
  photo?: string;
  text: string;
}

export interface TestimonialsProps {
  quotes: Testimonial[];
  className?: string;
}

export function Testimonials({ quotes, className }: TestimonialsProps) {
  return (
    <section className={cn("py-16 px-6 bg-[var(--bg-subtle)]", className)}>
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q, i) => (
          <blockquote
            key={i}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 flex flex-col gap-3"
          >
            <p className="text-sm text-[var(--fg)] leading-relaxed">&ldquo;{q.text}&rdquo;</p>
            <footer className="flex items-center gap-3 mt-2">
              {q.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={q.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
              )}
              <div className="flex flex-col">
                <cite className="not-italic text-xs font-semibold text-[var(--fg)]">
                  {q.author}
                </cite>
                {q.role && <span className="text-[11px] text-[var(--fg-muted)]">{q.role}</span>}
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
