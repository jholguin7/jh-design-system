import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { PreferencesProvider, usePreferences } from "./use-preferences";

function Demo() {
  const { theme, setTheme, gradient, setGradient, accent } = usePreferences();
  return (
    <>
      <button data-testid="theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme}
      </button>
      <button
        data-testid="gradient"
        onClick={() => setGradient({ id: "mint" })}
      >
        {gradient.id}
      </button>
      <span data-testid="accent">{accent}</span>
    </>
  );
}

describe("usePreferences (localStorage default)", () => {
  beforeEach(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("toggles theme", async () => {
    render(
      <PreferencesProvider applyPalette={false}>
        <Demo />
      </PreferencesProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    await userEvent.click(screen.getByTestId("theme"));
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("starts with default gradient and updates accent on setGradient", async () => {
    render(
      <PreferencesProvider applyPalette={false}>
        <Demo />
      </PreferencesProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("gradient")).toHaveTextContent("ant");
    const initialAccent = screen.getByTestId("accent").textContent;
    expect(initialAccent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    await userEvent.click(screen.getByTestId("gradient"));
    expect(screen.getByTestId("gradient")).toHaveTextContent("mint");
    expect(screen.getByTestId("accent").textContent).not.toBe(initialAccent);
  });
});
