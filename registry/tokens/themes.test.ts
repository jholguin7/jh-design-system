import { describe, it, expect } from "vitest";
import { themes, defaultThemeId } from "./themes";

describe("themes registry", () => {
  it("has at least 2 themes", () => {
    expect(themes.length).toBeGreaterThanOrEqual(2);
  });
  it("defaultThemeId points to a real theme", () => {
    expect(themes.find((t) => t.id === defaultThemeId)).toBeDefined();
  });
  it("each theme defines --primary in both light + dark", () => {
    for (const t of themes) {
      expect(t.light["--primary"]).toBeDefined();
      expect(t.dark["--primary"]).toBeDefined();
    }
  });
});
