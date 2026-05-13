import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useSavedGradients } from "./use-saved-gradients";

describe("useSavedGradients", () => {
  beforeEach(() => {
    try { window.localStorage.clear(); } catch { /* ignore */ }
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useSavedGradients());
    expect(result.current.savedGradients).toEqual([]);
  });

  it("saves and deletes gradients", () => {
    const { result } = renderHook(() => useSavedGradients());
    act(() => {
      result.current.saveGradient("Sunset", ["#ff0", "#f00"]);
    });
    expect(result.current.savedGradients).toEqual([
      { name: "Sunset", colors: ["#ff0", "#f00"] },
    ]);
    act(() => {
      result.current.deleteGradient("Sunset");
    });
    expect(result.current.savedGradients).toEqual([]);
  });

  it("overwrites duplicate names (case-insensitive)", () => {
    const { result } = renderHook(() => useSavedGradients());
    act(() => {
      result.current.saveGradient("Sunset", ["#ff0"]);
      result.current.saveGradient("SUNSET", ["#f00"]);
    });
    expect(result.current.savedGradients).toHaveLength(1);
    expect(result.current.savedGradients[0].colors).toEqual(["#f00"]);
  });
});
