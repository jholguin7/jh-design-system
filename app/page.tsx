"use client";
import { Sidebar, type NavSection } from "../registry/layout/sidebar";
import { Header } from "../registry/layout/header";
import { ThemePicker } from "../registry/molecules/theme-picker";
import { LanguageToggle } from "../registry/molecules/language-toggle";
import { Button } from "../registry/ui/button";
import { LayoutDashboard, Users, Settings } from "lucide-react";

const sections: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/users", label: "Users", icon: Users },
    ],
  },
  {
    title: "Other",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export default function Demo() {
  return (
    <div className="flex h-screen bg-[var(--bg)] text-[var(--fg)]">
      <Sidebar
        sections={sections}
        footerSlot={
          <>
            <ThemePicker />
            <LanguageToggle />
          </>
        }
        onLogout={() => alert("logout")}
      />
      <div className="flex-1 flex flex-col">
        <Header title="Demo Page" rightSlot={<span className="text-sm">user@example</span>} />
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-4">Hello design system.</h2>
          <p className="mb-4 text-[var(--fg-secondary)]">
            Theme + i18n + layout shells, all wired through registry providers.
          </p>
          <Button>Primary button</Button>
        </main>
      </div>
    </div>
  );
}
