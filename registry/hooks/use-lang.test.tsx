import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { I18nProvider, useLang } from "./use-lang";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nProvider>{children}</I18nProvider>
);

describe("useLang", () => {
  beforeEach(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });

  it("default lang is es; toggles to en", () => {
    const { result } = renderHook(() => useLang(), { wrapper });
    expect(result.current.lang).toBe("es");
    act(() => result.current.setLang("en"));
    expect(result.current.lang).toBe("en");
  });
  it("t() returns matching translation for known key", () => {
    const { result } = renderHook(() => useLang(), { wrapper });
    expect(result.current.t("common.save")).toBe("Guardar");
    act(() => result.current.setLang("en"));
    expect(result.current.t("common.save")).toBe("Save");
  });
  it("t() returns the key itself for missing key", () => {
    const { result } = renderHook(() => useLang(), { wrapper });
    expect(result.current.t("does.not.exist")).toBe("does.not.exist");
  });
});
