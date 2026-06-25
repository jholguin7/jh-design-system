"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ResizableTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum height (px) the drag handle will allow. Initial height still comes
   *  from `rows` / `min-h-*` classes — this only clamps the drag. */
  minHeight?: number;
  /** Optional maximum height (px) for the drag. */
  maxHeight?: number;
  /** Extra classes for the wrapper div (rarely needed). */
  wrapperClassName?: string;
}

/**
 * Textarea with a centered horizontal drag handle on the bottom edge instead of
 * the native corner resizer. Drag the grip up/down to resize vertically.
 *
 * The native resizer (`resize-y`) only ever sits in the bottom-right corner and
 * `::-webkit-resizer` can't be re-positioned — hence this wrapper. The textarea
 * itself is `resize-none`; height is driven by the grip via `style.height`.
 */
export const ResizableTextarea = forwardRef<HTMLTextAreaElement, ResizableTextareaProps>(
  function ResizableTextarea(
    { className, wrapperClassName, minHeight = 56, maxHeight, ...props },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [dragging, setDragging] = useState(false);

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const onPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        const ta = innerRef.current;
        if (!ta) return;
        e.preventDefault();
        const startY = e.clientY;
        const startH = ta.getBoundingClientRect().height;
        setDragging(true);
        document.body.style.userSelect = "none";
        document.body.style.cursor = "ns-resize";

        const onMove = (ev: PointerEvent) => {
          let h = startH + (ev.clientY - startY);
          if (h < minHeight) h = minHeight;
          if (maxHeight && h > maxHeight) h = maxHeight;
          ta.style.height = `${h}px`;
        };
        const onUp = () => {
          setDragging(false);
          document.body.style.userSelect = "";
          document.body.style.cursor = "";
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      },
      [minHeight, maxHeight],
    );

    return (
      <div className={cn("relative", wrapperClassName)}>
        <textarea ref={setRefs} className={cn("resize-none", className)} {...props} />
        {/* Bottom-center drag handle — replaces the native corner resizer. */}
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Redimensionar"
          onPointerDown={onPointerDown}
          className="group absolute inset-x-0 bottom-0 flex h-3 cursor-ns-resize touch-none items-end justify-center pb-[3px]"
        >
          <span
            className={cn(
              "block h-[3px] w-7 rounded-full transition-colors",
              dragging
                ? "bg-[var(--fg-muted)]"
                : "bg-[var(--border)] group-hover:bg-[var(--fg-muted)]",
            )}
          />
        </div>
      </div>
    );
  },
);
