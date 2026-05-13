/**
 * Theme registry. Each theme is a set of CSS variable overrides applied to <html>
 * via data-attribute (data-theme="<id>"). ThemeProvider toggles this.
 *
 * Why CSS-only: zero JS bundle weight; instant theme switch; no remount.
 */
export interface Theme {
  id: string;
  label: string;
  /** light-mode token overrides */
  light: Record<string, string>;
  /** dark-mode token overrides */
  dark: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: "default-wvy",
    label: "Wvy (yellow-green)",
    light: {
      "--primary": "#f8ff99",
      "--primary-hover": "#f0f76e",
      "--primary-light": "#fcffcc",
      "--primary-faint": "#feffe8",
      "--primary-dark": "#c8cc5c",
      "--primary-fg": "#000000",
    },
    dark: {
      "--primary": "#f8ff99",
      "--primary-hover": "#f0f76e",
      "--primary-light": "#fcffcc",
      "--primary-faint": "#feffe8",
      "--primary-dark": "#c8cc5c",
      "--primary-fg": "#000000",
    },
  },
  {
    id: "accent-orange",
    label: "Accent Orange",
    light: {
      "--primary": "#ff7a1a",
      "--primary-hover": "#e66700",
      "--primary-light": "#ffd1ab",
      "--primary-faint": "#fff1e6",
      "--primary-dark": "#cc5e00",
      "--primary-fg": "#ffffff",
    },
    dark: {
      "--primary": "#ff8c33",
      "--primary-hover": "#ffa055",
      "--primary-light": "#ffd1ab",
      "--primary-faint": "#3a1d00",
      "--primary-dark": "#cc5e00",
      "--primary-fg": "#ffffff",
    },
  },
];

export const defaultThemeId = "default-wvy";
