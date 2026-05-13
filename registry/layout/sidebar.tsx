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
  /** Slot for footer actions — theme/lang toggles, etc. Rendered above logout. */
  footerSlot?: React.ReactNode;
  /** Logout handler — if omitted, logout button hidden */
  onLogout?: () => void;
  /** Logout label (i18n consumer-provided) */
  logoutLabel?: string;
}

export function Sidebar({
  logo,
  sections,
  enabledAddons = [],
  dbConfigured = true,
  topSlot,
  footerSlot,
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
                : "text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-3 border-r border-[var(--border)] bg-[var(--bg-card)] py-4 px-3 transition-all",
        collapsed ? "w-[64px]" : "w-[260px]",
      )}
    >
      {logo && <div className="flex items-center justify-center mb-2">{logo}</div>}
      {topSlot && <div>{topSlot}</div>}
      <nav className="flex flex-col gap-4 flex-1 overflow-y-auto">
        {sections.map((sec, i) => (
          <div key={i} className="flex flex-col gap-1">
            {!collapsed && sec.title && (
              <h3 className="text-[10px] uppercase tracking-wide text-[var(--fg-muted)] px-3">
                {sec.title}
              </h3>
            )}
            {sec.items.map((it) => renderItem(it))}
          </div>
        ))}
      </nav>
      <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] pt-3">
        {footerSlot}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{logoutLabel}</span>}
          </button>
        )}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 rounded-md text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)]"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
    </aside>
  );
}
