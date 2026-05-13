# Registry item completeness

Living audit: what's a stub vs. what's the production-grade version.

**Why this exists:** L9 in [lessons-from-consumers.md](./lessons-from-consumers.md). Some canonical items were copied verbatim from the AIA Website internal repo (full); others were sketched as minimal stubs to keep the registry building. Consumers installing a stub may get a working component that silently caps their UX vs. what's possible. This page is the honest map.

## Status taxonomy

- `full` — production-grade. No known gap vs. the upstream/spiritual-parent implementation. Safe to depend on.
- `stub` — works but limited. A richer version exists somewhere (AIA Website, another consumer) and porting it would meaningfully unlock features. Consumers should know.
- `skeleton` — barely functional. Demonstrates the API surface but lacks real behavior. Avoid in production until completed.
- `unknown` — not yet audited.

## Items (as of v0.2.0)

### Foundation
| Name | Completeness | Notes |
|---|---|---|
| `tokens` | full | Light/dark + signals + stages CSS vars. L1 install bug pending fix but the *content* is full. |
| `themes` | full | default-wvy + accent-orange presets. **Legacy** — superseded by gradient-based PreferencesProvider in v0.2 but kept for v0.1 consumers. |
| `cn` | full | clsx + tailwind-merge wrapper. |
| `i18n` | full | Base dict + Lang type + mergeDicts. |
| `gradients` | full | 22 presets + OKLab interpolation + WCAG luminance + HSL math. Ported from AIA verbatim. |
| `pdf-report` | unknown | Untested by consumers; works in canonical sandbox. |

### Hooks
| Name | Completeness | Notes |
|---|---|---|
| `use-lang` | full | i18n hook + I18nProvider. localStorage persistence. |
| `use-preferences` | full (v0.2) | Was `stub` in v0.1. Now includes full gradient palette generation (applyPaletteToRoot, ensureReadable, stages, bar-text, bg-tints) + adapter pattern. |
| `use-saved-gradients` | full (v0.2) | New. localStorage-backed CRUD over user-saved gradients. |
| `use-toast` | full | Standard toast state machine. |
| `use-media-query` | full | Reactive CSS media query. |
| `use-outside-click` | full | Standard pattern. |
| `use-sort` | full | Controlled sort state. |
| `use-filters` | full | Controlled filter state. |
| `use-scroll-reveal` | full | Intersection-observer reveal. |

### Providers
| Name | Completeness | Notes |
|---|---|---|
| `theme-provider` | full | **Legacy** in v0.2 (still ships; prefer PreferencesProvider). |
| `i18n-provider` | full | Re-export of I18nProvider from use-lang. |

### Layout shells
| Name | Completeness | Notes |
|---|---|---|
| `sidebar` | full (v0.2) | Was `stub` pre-Plan 4. Adopted AIA visual reference: w-56, h-[18px] icons, border-t section dividers, top-positioned collapse, `userCardSlot` prop. |
| `header` | full | Title + breadcrumb + right slot. |
| `mobile-bottom-nav` | full (v0.2) | Was `stub` pre-Plan 4. Icon-only by default, dot indicator, safe-area-inset-bottom, auto scroll-x when >5 tabs. |
| `mobile-header` | stub | Has basic title + right slot + hamburger. AIA's version has pull-down panels (`pullDownPanels?: PullDownPanel[]`) for filters/settings — not yet ported. Phase D of Plan 4 deferred. |

### Molecules
| Name | Completeness | Notes |
|---|---|---|
| `gradient-picker` | full (v0.2) | Was `skeleton` pre-Plan 4 (4×4 grid only). Now: portal popup, presets grid, custom builder (drag reorder + flip + saved), `labels?` prop for i18n. Breaking API change from v0.1. |
| `theme-picker` | full | **Legacy** — bound to ThemeProvider model. Prefer GradientPicker in v0.2. |
| `language-toggle` | full | Es/En toggle. |
| `project-switcher` | full | Multi-project dropdown. |
| `ai-loader` | full | Pulsing dot. |
| `filter-bar` | full | Generic filter registry (text/select/multi). |

### UI primitives
| Name | Completeness | Notes |
|---|---|---|
| `button` | full | shadcn standard. |
| `dialog` | full | Radix-based. |
| `popover` | full | Radix primitive. |
| `input` | full | Styled input. |
| `table` | full | Styled table parts. |
| `toast` | full | Radix primitives. |
| `toaster` | full | Viewport wired to useToast. |
| `date-picker` | full | react-day-picker, locale-aware. |

### Templates
| Name | Completeness | Notes |
|---|---|---|
| `preferences-page` | full | Generic settings page; consumer supplies sections+controls. |
| `admin-users-page` | full | Users table + invite/role/delete. |
| `admin-projects-page` | full | Projects grid. |
| `nested-tabs` | full | Generic tabs with persistence. |

### Charts
| Name | Completeness | Notes |
|---|---|---|
| `kpi-card`, `funnel-chart`, `funnel-waterfall-chart`, `conversion-steps`, `sankey-chart`, `sunburst-chart`, `treemap-chart`, `timeline-chart`, `ad-timeline-gantt`, `pie-chart`, `heatmap-chart`, `scatter-bubble-chart`, `radar-chart`, `radial-time-chart`, `bump-chart`, `pivot-explorer`, `cohort-retention-chart` | unknown | Untested by external consumers as of v0.2. Likely full (built for AIA Website) but not yet audited against a 2nd consumer. |

### Landing
| Name | Completeness | Notes |
|---|---|---|
| `hero`, `features`, `testimonials`, `social-proof`, `cta-section`, `footer`, `navbar`, `scroll-spy`, `dot-swarm-background` | unknown | Built but no external consumer has adopted yet. |

## How to update this audit

When you change a registry item's content (write a stub or extend a stub to full), update its row here in the same commit. New items default to `stub` until at least one external consumer adopts them successfully.

When porting an item from a private upstream (e.g., AIA Website) to canonical, do it in *one pass* — copy verbatim, run tests, mark `full`. Splitting "land the API" then "land the implementation" creates the L9 trap.
