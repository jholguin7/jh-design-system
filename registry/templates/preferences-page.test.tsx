import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PreferencesPage } from "./preferences-page";

describe("PreferencesPage", () => {
  it("renders page title + sections + items", () => {
    render(
      <PreferencesPage
        pageTitle="Settings"
        sections={[
          {
            id: "app",
            title: "Application",
            items: [
              { id: "theme", label: "Theme", control: <button>Toggle</button> },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Application" })).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toggle" })).toBeInTheDocument();
  });
});
