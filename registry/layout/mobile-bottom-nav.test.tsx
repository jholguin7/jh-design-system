import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { Home, Settings } from "lucide-react";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("MobileBottomNav", () => {
  it("renders all tabs (icon-only by default, labels via aria-label)", () => {
    render(
      <MobileBottomNav
        tabs={[
          { href: "/", label: "Home", icon: Home },
          { href: "/settings", label: "Settings", icon: Settings },
        ]}
      />,
    );
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
    expect(screen.getByLabelText("Settings")).toBeInTheDocument();
  });

  it("renders text labels when showLabels is true", () => {
    render(
      <MobileBottomNav
        showLabels
        tabs={[
          { href: "/", label: "Home", icon: Home },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
