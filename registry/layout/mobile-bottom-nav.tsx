"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

export interface MobileTab {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface MobileBottomNavProps {
  tabs: MobileTab[];
  className?: string;
}

export function MobileBottomNav({ tabs, className }: MobileBottomNavProps) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-[var(--border)] bg-[var(--bg-card)] py-1.5 md:hidden",
        className,
      )}
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-[10px] font-medium transition-colors",
              isActive
                ? "text-[var(--primary-dark)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]",
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
