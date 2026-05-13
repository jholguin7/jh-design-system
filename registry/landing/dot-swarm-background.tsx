"use client";
import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";

export interface DotSwarmBackgroundProps {
  /** Number of dots */
  count?: number;
  /** Speed multiplier (0..2 reasonable) */
  speed?: number;
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Animated dot swarm canvas. Renders behind hero/landing sections.
 * Pure CSS-token coloured (uses --primary).
 */
export function DotSwarmBackground({
  count = 60,
  speed = 0.6,
  className,
}: DotSwarmBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dots: Dot[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const init = () => {
      resize();
      dots.length = 0;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: 1 + Math.random() * 1.5,
        });
      }
    };

    const color = getComputedStyle(canvas).getPropertyValue("--primary") || "#888";

    const draw = () => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = color.trim();
        ctx.globalAlpha = 0.4;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, [count, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      aria-hidden
    />
  );
}
