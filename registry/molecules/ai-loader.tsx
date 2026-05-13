"use client";
import { cn } from "../lib/cn";

export interface AILoaderProps {
  /** Label shown next to spinner */
  label?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AILoader({ label, size = "md", className }: AILoaderProps) {
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-3 w-3" : "h-2 w-2";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-[var(--fg-secondary)]", className)}
    >
      <div className="flex gap-1">
        <span
          className={cn(
            "rounded-full bg-[var(--primary)] animate-pulse",
            dotSize,
          )}
          style={{ animationDelay: "0ms" }}
        />
        <span
          className={cn(
            "rounded-full bg-[var(--primary)] animate-pulse",
            dotSize,
          )}
          style={{ animationDelay: "200ms" }}
        />
        <span
          className={cn(
            "rounded-full bg-[var(--primary)] animate-pulse",
            dotSize,
          )}
          style={{ animationDelay: "400ms" }}
        />
      </div>
      {label && <span className="text-xs">{label}</span>}
    </div>
  );
}
