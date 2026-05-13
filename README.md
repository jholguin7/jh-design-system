# jh-design-system

Canonical reusable design system for jh-* apps. Shipped as a shadcn registry hosted on GitHub Raw.

64 registry items — tokens, themes, primitives, layout shells, hooks, lib utils, providers, molecules, page templates, 17 charts, 10 landing pieces.

## Quick start

In your consumer Next.js 16 + Tailwind 4 project:

```bash
# Install foundation
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/tokens.json
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/themes.json
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/cn.json

# Install hooks + providers
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/use-lang.json
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/theme-provider.json

# Install layout
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/sidebar.json
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/header.json
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/theme-picker.json
```

shadcn CLI will resolve `registryDependencies` recursively, so installing `sidebar` also pulls `cn` automatically.

## Required consumer setup

### 1. Tailwind 4 + Next 16 (Webpack)

Tailwind 4 is required. Next 16 is required. Use the Webpack compiler (not Turbopack) — Turbopack freezes on Windows during dev.

### 2. components.json alias map

For installs to land in the correct subdirectories, your `components.json` must declare these aliases:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
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

### 3. Provider wrapping order

```tsx
<ThemeProvider>
  <I18nProvider>
    <PreferencesProvider>
      {children}
    </PreferencesProvider>
  </I18nProvider>
</ThemeProvider>
```

## Catalog (64 items)

### Foundation
- `tokens` — CSS variable tokens (light/dark + signals + stages + `@theme inline` bridge)
- `themes` — Theme registry (`default-wvy` + `accent-orange`)
- `cn` — clsx + tailwind-merge helper
- `i18n` — Base dictionary + `mergeDicts` helper
- `gradients` — Gradient generation utilities
- `pdf-report` — Generic PDF reports (jspdf)

### Hooks
- `use-lang` (i18n) · `use-toast` · `use-media-query` · `use-outside-click`
- `use-sort` · `use-filters` · `use-preferences` (with pluggable adapter)
- `use-scroll-reveal` (landing)

### Providers
- `theme-provider` — wires theme CSS vars + localStorage persistence
- `i18n-provider` — re-export of I18nProvider

### Primitives
- `button` · `dialog` · `popover` · `input` · `table` · `toast` · `toaster` · `date-picker`

### Layout shells
- `sidebar` (parametrized with sections/addons/slots/onLogout)
- `header` (title/breadcrumb/rightSlot)
- `mobile-bottom-nav` · `mobile-header`

### Molecules
- `theme-picker` · `language-toggle` · `project-switcher`
- `ai-loader` · `gradient-picker` · `filter-bar`

### Page templates
- `preferences-page` (settings registry pattern)
- `admin-users-page` · `admin-projects-page`
- `nested-tabs` (generic tab switcher with localStorage persistence)

### Charts (17)
- `kpi-card` · `funnel-chart` · `funnel-waterfall-chart` · `conversion-steps`
- `sankey-chart` · `sunburst-chart` · `treemap-chart`
- `timeline-chart` · `ad-timeline-gantt`
- `pie-chart` · `heatmap-chart` · `scatter-bubble-chart`
- `radar-chart` · `radial-time-chart` · `bump-chart`
- `pivot-explorer` · `cohort-retention-chart`

### Landing kit (10)
- `hero` · `features` · `testimonials` · `social-proof` · `cta-section`
- `footer` · `navbar` · `scroll-spy` · `use-scroll-reveal` · `dot-swarm-background`

## Theming

Each theme is a set of `--primary*` CSS variable overrides applied to `<html>` via JS by `ThemeProvider`. Light/dark + theme id are persisted to `localStorage`.

To add a new theme, edit `registry/tokens/themes.ts` and append to the `themes` array.

```ts
{
  id: "accent-blue",
  label: "Accent Blue",
  light: {
    "--primary": "#3b82f6",
    "--primary-hover": "#2563eb",
    "--primary-light": "#dbeafe",
    "--primary-faint": "#eff6ff",
    "--primary-dark": "#1e3a8a",
    "--primary-fg": "#ffffff",
  },
  dark: { /* … */ },
}
```

## Updating

Pull latest by re-running install with `--overwrite`:

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r/sidebar.json --overwrite
```

> GitHub Raw caches for ~5 minutes. If recently updated, either wait or pin a specific commit SHA: `raw.githubusercontent.com/jholguin7/jh-design-system/<SHA>/r/sidebar.json`.

## Contributing

The `/promote-to-design-system` skill (Plan 2) automates promoting local edits in consumer projects back to this canonical repo. Invoke it after editing tracked files in your consumer.

## License

MIT — see `LICENSE`.

## Source

Originally extracted from AIA Website (`C:/AIA/Website` — read-only origin). AIA is never modified by this repo's lifecycle.
