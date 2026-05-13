"use client";
import { cn } from "../lib/cn";

export interface SocialProofLogo {
  name: string;
  src: string;
}

export interface SocialProofProps {
  logos: SocialProofLogo[];
  heading?: string;
  className?: string;
}

export function SocialProof({ logos, heading, className }: SocialProofProps) {
  return (
    <section className={cn("py-12 px-6", className)}>
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {heading && (
          <p className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">{heading}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={l.src}
              alt={l.name}
              className="h-7 opacity-60 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
