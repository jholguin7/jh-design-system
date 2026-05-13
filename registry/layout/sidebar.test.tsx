import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Sidebar, type NavSection } from "./sidebar";
import { LayoutDashboard, Users } from "lucide-react";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Sidebar", () => {
  const sections: NavSection[] = [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/users", label: "Users", icon: Users },
      ],
    },
  ];

  it("renders all nav items", () => {
    render(<Sidebar sections={sections} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });
  it("renders logout button when onLogout provided", () => {
    const fn = vi.fn();
    render(<Sidebar sections={sections} onLogout={fn} logoutLabel="Salir" />);
    expect(screen.getByText("Salir")).toBeInTheDocument();
  });
  it("locks addon-gated items when addon not enabled", () => {
    const locked: NavSection[] = [
      {
        title: null,
        items: [{ href: "/pro", label: "Pro", icon: Users, addon: "pro" }],
      },
    ];
    render(<Sidebar sections={locked} enabledAddons={[]} />);
    const link = screen.getByText("Pro").closest("a");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});
