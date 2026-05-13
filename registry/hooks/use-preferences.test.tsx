import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { PreferencesProvider, usePreferences } from "./use-preferences";

function Demo() {
  const { theme, setTheme } = usePreferences();
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme}
    </button>
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
      <PreferencesProvider>
        <Demo />
      </PreferencesProvider>,
    );
    await act(async () => {
      /* wait for initial load */
    });
    expect(screen.getByRole("button")).toHaveTextContent("light");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
  });
});
