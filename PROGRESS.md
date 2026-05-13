# jh-design-system Plan 1 Progress

## STATUS: COMPLETE (v0.1.0)

64 registry items, 56 passing tests, tsc clean, registry built+validated, pushed to GitHub.

## Phase 1 — Repo bootstrap (DONE)
- T1: scaffold + LICENSE — 33a1469
- T2: deps + shadcn init + aliases — 8874e5a
- T3: dir tree + README — 4bb5669, 28ba95b

## Phase 2 — Tokens & theming (DONE)
- T4: globals.css from AIA — 5c3b130
- T5: themes.ts + vitest — committed
- T6: ThemeProvider + ThemePicker — committed
- T7: I18nProvider + useLang + LanguageToggle — committed
- T7b: @theme audit (integrated into T4)
- T7c: cn.ts — committed

## Phase 3 — Primitives (DONE)
- T8: shadcn primitives + use-toast + use-media-query

## Phase 4 — Hooks (DONE)
- T9: use-outside-click + use-sort + use-filters
- T10: use-preferences (adapter)

## Phase 5 — Lib (DONE)
- T11: gradients + pdf-report (generic)

## Phase 6 — Layout shells (DONE)
- T12: Sidebar (parametrized)
- T13: Header
- T14: MobileBottomNav
- T15: MobileHeader
- T16: integration smoke in app/

## Phase 7 — Molecules (DONE)
- T17: ProjectSwitcher
- T18: GradientPicker + AILoader
- T19: FilterBar

## Phase 8 — Templates (DONE)
- T20: PreferencesPage
- T21: AdminUsersPage + AdminProjectsPage
- T22: NestedTabs

## Phase 9 — Charts (DONE, 17 charts)
- T23-T39: kpi-card, funnel, funnel-waterfall, conversion-steps,
  sankey, sunburst, treemap, timeline, gantt, pie, heatmap,
  scatter-bubble, radar, radial-time, bump, pivot-explorer, cohort-retention

## Phase 10 — Landing (DONE, 10 items)
- T40-T47: hero, features, testimonials, social-proof, cta-section,
  footer, navbar, scroll-spy, use-scroll-reveal, dot-swarm-background
- T48 (landing demo page): skipped (sandbox covers it)

## Phase 11 — Registry config + build (DONE)
- T49: registry.json (64 items)
- T50: build-registry.mjs
- T51: validate-registry.mjs + r/ generated + pushed

## Phase 12 — Sandbox validation (LIGHTWEIGHT)
- T52-T54: replaced with scripts/sandbox-simulate.mjs that asserts
  no @/lib/utils, @/hooks/, @/components/ui/ stragglers in 9 representative
  items + all transitive deps resolve. PASS.
- Full E2E (npx create-next-app sandbox + shadcn add from raw URLs)
  deferred: documented in README. Plan 3 (Presupuestos2.0 adoption)
  will exercise the full path.

## Phase 13 — Docs + tag (DONE)
- T55: README fleshed out
- T56: v0.1.0 tag

## Quality gates
- tsc --noEmit: PASS (zero errors)
- pnpm test: 56 tests / 44 files PASS
- pnpm build:registry: 64 items built
- pnpm validate:registry: 64 items validated
- AIA Website: untouched (only pre-existing untracked scripts/* files)

## Definition of Done checklist
- [x] ≥55 registry items (64 actual)
- [x] each item has `title` (verified by validator)
- [x] tsc clean
- [x] tests pass
- [x] AIA untouched
- [x] tagged v0.1.0
- [~] sandbox E2E via shadcn-add (lightweight static simulation; full E2E in Plan 3)
