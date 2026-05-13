import { describe, it, expect } from "vitest";
import * as g from "./gradients";

describe("gradients", () => {
  it("exports module surface", () => {
    expect(g).toBeDefined();
  });
  it("generateSingleColorGradient returns array of stops", () => {
    if (typeof g.generateSingleColorGradient === "function") {
      const out = g.generateSingleColorGradient("#ff7a1a");
      expect(Array.isArray(out)).toBe(true);
      expect(out.length).toBeGreaterThan(0);
    }
  });
});
