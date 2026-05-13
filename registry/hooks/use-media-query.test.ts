import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  it("returns boolean", () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      media: "(min-width: 1024px)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(typeof result.current).toBe("boolean");
  });
});
