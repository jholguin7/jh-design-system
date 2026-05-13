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
  it("renders all tabs", () => {
    render(
      <MobileBottomNav
        tabs={[
          { href: "/", label: "Home", icon: Home },
          { href: "/settings", label: "Settings", icon: Settings },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
