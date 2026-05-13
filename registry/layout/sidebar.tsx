"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/cn";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Optional addon gate. If set, nav item shows locked unless `enabledAddons` includes it. */
  addon?: string;
  /** Optional disable-when-no-db flag */
  disabledNoDb?: boolean;
}

export interface NavSection {
  /** Section title (e.g. "Data Analytics"). null = no header. */
  title: string | null;
  items: NavItem[];
}

export interface SidebarProps {
  /** Logo node (img / svg) — top of sidebar */
  logo?: React.ReactNode;
  /** Sections rendered in order */
  sections: NavSection[];
  /** Currently enabled addons (for gating) */
  enabledAddons?: string[];
  /** Whether project DB is configured (gates disabledNoDb items) */
  dbConfigured?: boolean;
  /** Slot for ProjectSwitcher or similar — rendered between logo and nav */
  topSlot?: React.ReactNode;
  /** Slot for footer actions (theme/lang toggles, etc.). Rendered above userCardSlot. */
  footerSlot?: React.ReactNode;
  /** Slot for user info card (avatar + name + logout) at the very bottom. */
  userCardSlot?: React.ReactNode;
  /** Logout handler — if omitted, logout button hidden. (Ignored if userCardSlot provided.) */
  onLogout?: () => void;
  /** Logout label (i18n consumer-provided) */
  logoutLabel?: string;
}

/**
 * Sidebar primitive. Visual reference: AIA Website production sidebar (v2026-05).
 *
 * Layout (top → bottom):
 *   logo block (border-b)
 *   topSlot (e.g. ProjectSwitcher)
 *   collapse + topActions inline row
 *   nav sections (with border-t dividers between sections, not before first)
 *   footerSlot
 *   userCardSlot (or simple logout button as fallback)
 */
export function Sidebar({
  logo,
  sections,
  enabledAddons = [],
  dbConfigured = true,
  topSlot,
  footerSlot,
  userCardSlot,
  onLogout,
  logoutLabel = "Log out",
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const isLocked = item.addon ? !enabledAddons.includes(item.addon) : false;
    const isDisabled = item.disabledNoDb ? !dbConfigured : false;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={isDisabled || isLocked ? "#" : item.href}
        title={collapsed ? item.label : undefined}
        aria-disabled={isDisabled || isLocked}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
          collapsed && "justify-center px-0",
          isDisabled
            ? "text-[var(--fg-muted)]/40 opacity-40"
            : isActive
              ? "bg-[var(--primary)] text-[var(--primary-fg)]"
              : isLocked
                ? "text-[var(--fg-muted)]/50 hover:text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)]"
                : "text-[var(--fg-secondary)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]",
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-[var(--bg-card)] border-r border-[var(--border-subtle)] h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[68px]" : "w-56",
      )}
    >
      {logo && (
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-center overflow-hidden">
          {logo}
        </div>
      )}

      {topSlot && <div className="border-b border-[var(--border-subtle)]">{topSlot}</div>}

      {/* Collapse button row (top-positioned, matches AIA pattern) */}
      <div className="px-3 pt-3 pb-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-2 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-all rounded-lg px-2.5 py-2 text-xs",
            collapsed ? "w-full justify-center" : "w-full",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      <div className="mx-4 border-t border-[var(--border-subtle)]" />

      <nav className="flex-1 px-3 pt-2 pb-3 overflow-y-auto overflow-x-hidden">
        {sections.map((sec, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col gap-0.5",
              i > 0 && "pt-3 mt-3 border-t border-[var(--border-subtle)]",
            )}
          >
            {!collapsed && sec.title && (
              <h3 className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                {sec.title}
              </h3>
            )}
            {sec.items.map((it) => renderItem(it))}
          </div>
        ))}
      </nav>

      {(footerSlot || userCardSlot || onLogout) && (
        <div className="p-3 border-t border-[var(--border-subtle)] flex flex-col gap-1">
          {footerSlot}
          {userCardSlot ?? (
            onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)] transition-colors",
                  collapsed && "justify-center px-0",
                )}
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{logoutLabel}</span>}
              </button>
            )
          )}
        </div>
      )}
    </aside>
  );
}
