# jh-design-system

Canonical reusable design system for jh-* apps. Shipped as a shadcn registry.

## Install components in your app

```bash
npx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/tokens.json
npx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/sidebar.json
```

## Catalog

- **Tokens & themes** (light/dark, theme picker, signals, stages)
- **Primitives** — shadcn baseline (button, dialog, popover, input, table, toast, date-picker)
- **Layout shells** — Sidebar/Header/MobileBottomNav/MobileHeader (parametrized)
- **Hooks** — i18n, theme, prefs, media-query, sort, filters, toast, outside-click
- **Charts** — 15 Recharts generics (KPI/Funnel/Sankey/Sunburst/Treemap/Timeline/Pie/Heatmap/Scatter/Radar/RadialTime/Bump/Pivot/Cohort)
- **Molecules** — ProjectSwitcher, GradientPicker, AILoader, FilterBar, ThemePicker, LanguageToggle
- **Page templates** — Preferences, Admin/Users, Admin/Projects, NestedTabs pattern
- **Landing kit** — Hero, Features, Testimonials, Footer, ScrollSpy, etc.

## Consumer requirement: alias map

For installs to land in the correct subdirectories, your consumer project's `components.json` MUST declare the same custom aliases:

```json
{
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/cn",
    "layout": "@/components/layout",
    "templates": "@/components/templates",
    "charts": "@/components/charts",
    "molecules": "@/components/molecules",
    "providers": "@/components/providers",
    "landing": "@/components/landing"
  }
}
```

Source: extracted from AIA Website (read-only origin). AIA is never modified by this repo's lifecycle.

MIT licensed.
