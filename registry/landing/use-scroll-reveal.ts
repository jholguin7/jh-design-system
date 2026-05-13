"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Reveal an element when it scrolls into view. Returns a ref + boolean.
 *
 * @param threshold IntersectionObserver threshold (0..1). Default: 0.15.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.15,
): { ref: React.RefObject<T | null>; revealed: boolean } {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            return;
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
