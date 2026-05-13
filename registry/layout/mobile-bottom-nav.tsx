"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

export interface MobileTab {
  href: string;
  /** Accessible label (used for aria-label since the bar is icon-only). */
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MobileBottomNavProps {
  tabs: MobileTab[];
  /** Show labels under icons. Default false (icon-only, AIA-style). */
  showLabels?: boolean;
  /** Horizontal scroll when tabs overflow. Default auto-enables when tabs.length > 5. */
  scrollable?: boolean;
  className?: string;
}

/**
 * Bottom nav for mobile. Visual reference: AIA Website production MobileBottomNav.
 *
 * Behaviour:
 *  - Icon-only by default (labels via aria-label only). Set `showLabels` to render text.
 *  - Active tab gets a small `dot indicator` under the icon (not a colored full tile).
 *  - Honors iOS safe-area-inset-bottom.
 *  - When tabs.length > 5 (or `scrollable` is explicitly true), the container becomes horizontally scrollable.
 */
export function MobileBottomNav({
  tabs,
  showLabels = false,
  scrollable,
  className,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const isScrollable = scrollable ?? tabs.length > 5;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-card)] border-t border-[var(--border-subtle)]",
        "px-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2",
        className,
      )}
      aria-label="Mobile navigation"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div
        className={cn(
          "flex items-center max-w-lg mx-auto",
          isScrollable
            ? "overflow-x-auto gap-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "justify-around",
        )}
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors shrink-0",
                isActive
                  ? "text-[var(--primary-readable,var(--primary-dark))]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]",
              )}
            >
              <Icon className="h-5 w-5" />
              {showLabels && (
                <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              )}
              {isActive && (
                <span className="absolute -bottom-0.5 w-4 h-0.5 rounded-full bg-[var(--primary)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
