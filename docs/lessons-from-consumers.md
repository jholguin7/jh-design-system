# Lessons from consumers

Living log of what real consumers of `jh-design-system` hit. Each entry is a fact + a fix proposal, dated by when it was discovered. Update as we go.

Status taxonomy: `open` (not addressed) · `fixed` (landed in registry) · `known` (documented, not yet fixed) · `wontfix`.

---

## Consumer index

| Consumer | First adoption | Plan | Status |
|---|---|---|---|
| `Presupuestos2.0/web` | 2026-05-13 | [Plan 3 in Presupuestos repo](https://github.com/jholguin7/Presupuestos2.0-web) | live on https://presupuestos2-0.vercel.app |

---

## Lessons

### L1 — `tokens.json` + `themes.json` install strips `@import "tailwindcss"`

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 3 Task 14)
- **Status:** `open`
- **Severity:** critical (silent UI break in consumers)
- **Symptom:** after `shadcn add tokens.json` (or `themes.json` with cascade) on a fresh Next.js + Tailwind 4 app, `app/globals.css` is overwritten and the `@import "tailwindcss";` directive is gone. All Tailwind utilities (`.flex`, `.h-screen`, `.h-full`, ...) stop generating. The app's CSS visually collapses to default block layout. **`pnpm tsc` passes. `pnpm test` (vitest) passes. `pnpm build` passes (PostCSS runs, produces an empty/minimal CSS file).** Only a browser smoke catches it.
- **Root cause:** the registry items for `tokens.json` / `themes.json` write a `globals.css` that contains only the JH tokens block, not the Tailwind import. `shadcn add --yes` applies `--overwrite`-style behavior on the same path.
- **Catches it:** browser visual smoke (Playwright `getComputedStyle(root).display` → "block" instead of "flex"). Nothing in the test/build pipeline does.
- **Workaround in consumer:** re-add `@import "tailwindcss";` at the top of `app/globals.css` after foundation install (Presupuestos commit [`5806acf`](https://github.com/jholguin7/Presupuestos2.0-web/commit/5806acf)).
- **Proposed fix in canonical:**
  1. The registry item that writes `globals.css` should include `@import "tailwindcss";` as its first line.
  2. Add a `postInstall` note in the README warning: *"after foundation install, verify `@import \"tailwindcss\"` is present in `globals.css` — re-add if missing"*.
  3. Optional: ship a tiny `verify-install.mjs` script that checks for the directive after install.

---

### L2 — `preferences-page.tsx` template uses relative import for `cn`

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 3 Task 11)
- **Status:** `open`
- **Severity:** medium (TS error on install; trivially fixable in consumer)
- **Symptom:** installed `components/templates/preferences-page.tsx` has `import { cn } from "../lib/cn";`. From `components/templates/`, that resolves to `components/lib/cn` which doesn't exist. TS error after install.
- **Root cause:** the registry source for `preferences-page` writes a relative import while every other registry item uses the alias `import { cn } from "@/lib/cn"`. Inconsistent.
- **Catches it:** `pnpm tsc --noEmit` in the consumer.
- **Workaround in consumer:** edit the installed file post-install to use `@/lib/cn`.
- **Proposed fix in canonical:** change the source of `preferences-page` to `import { cn } from "@/lib/cn"`. Single-character grep across `registry/` to verify no other items have the same bug.

---

### L3 — `components.json` alias map is not documented for consumers

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 3 Task 2)
- **Status:** `known`
- **Severity:** low (figured out by trial; once known, trivial)
- **Symptom:** stock `pnpm dlx shadcn@latest init` creates a minimal `components.json` with only `ui`, `lib`, `hooks`, `utils`. Installing `sidebar.json`, `theme-picker.json`, etc., lands files at unexpected paths (or fails) because aliases `layout`, `templates`, `charts`, `molecules`, `providers`, `landing` are missing.
- **Root cause:** README doesn't list the required aliases.
- **Workaround in consumer:** manually edit `components.json` to add the extended aliases before installing layout/template/molecule items.
- **Proposed fix in canonical:**
  1. Add a `## Consumer setup` section to the README with the full required `components.json` aliases block.
  2. Consider shipping a `r/_components-json-template.json` that the user copies as a starting point.

---

### L4 — Vitest + Next build cannot catch missing Tailwind import (testing gap)

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 3 Task 14, post-mortem on L1)
- **Status:** `known`
- **Severity:** structural (affects how consumers verify a successful install)
- **Symptom:** with `@import "tailwindcss";` missing, all unit tests pass, build succeeds, only browser smoke catches the bug.
- **Recommendation for consumers:** add at least one Playwright-style smoke test that loads a page from the shell and asserts `getComputedStyle(rootDiv).display === "flex"` (or similar non-trivial Tailwind utility). Cheap insurance against silent CSS regressions.
- **Recommendation for canonical:** ship a copy-paste smoke test template under `docs/consumer-smoke-template.spec.ts` (or similar).

---

### L5 — Promote-back hook noise on consumer wiring edits

- **Discovered:** 2026-05-12+ (skill `/promote-to-design-system` workflow during Plan 3)
- **Status:** `known`
- **Severity:** low (UX paper-cut; doesn't break anything)
- **Symptom:** every edit to `components/ui/*`, `lib/cn.ts`, `app/globals.css`, etc., in a consumer triggers `[WARN] Detected N edit(s) to design-system-tracked file(s)…`. In practice, most consumer edits are wiring (replacing placeholder content, hooking in app-specific data) NOT improvements that should round-trip to canonical.
- **Root cause:** the hook tracks file paths, not content semantics. It can't distinguish wiring from improvements without diffing against canonical.
- **Proposed fix:** in `PostToolUse` hook, after each edit, diff the touched file against the canonical version at the same path. Only emit `[WARN]` when the diff is non-trivial (more than rename/placeholder content). Logic could live in the skill itself.

---

### L6 — `outputFileTracingIncludes` + snapshot mode works cleanly on Vercel

- **Discovered:** 2026-05-13 (Presupuestos2.0, Vercel deploy)
- **Status:** `known` (pattern, not a bug)
- **Recommendation:** if a consumer ships a SQLite (or similar binary) at runtime, use Next's `outputFileTracingIncludes` to bundle it into the serverless function. Pattern that worked:
  ```ts
  // next.config.ts
  const nextConfig = {
    serverExternalPackages: ["better-sqlite3"],
    outputFileTracingIncludes: { "/*": ["./lib/data/Presupuestos.sqlite"] },
  };
  ```
  Combined with `PRESUPUESTOS_DEPLOY_MODE=snapshot` env var and a build script that copies the DB into `lib/data/` (or commits it pre-built).
- **Gotcha:** when adding the env var via `vercel env add` from the CLI, do NOT use `echo VALUE | vercel env add` — `echo` appends a newline that ends up in the value (e.g., `"snapshot\n"`), breaking string equality checks in app code. Use `printf VALUE | vercel env add ...` (no newline) or set via the dashboard.

---

### L7 — `MobileBottomNav` lacked horizontal scroll for >4-5 tabs + label-heavy visual

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 design exploration vs AIA Website reference)
- **Status:** `fixed` (commit `02bc204` in jh-design-system)
- **Severity:** medium (UX cap — couldn't add more nav targets cleanly)
- **Symptom:** original `MobileBottomNav` used `justify-around` with icon+label per tab. With 5+ tabs it crowded; no scroll fallback; visually heavy.
- **Reference impl:** AIA Website `src/components/mobile/MobileBottomNav.tsx` uses icon-only, dot indicator under active tab (`absolute -bottom-0.5 w-4 h-0.5`), `max-w-lg mx-auto` container, safe-area-inset-bottom, and supports 7+ items inside the constrained width.
- **Fix in canonical:** rewrote `registry/layout/mobile-bottom-nav.tsx` to be icon-only by default (`showLabels?: boolean` opt-in), dot indicator pattern, `safe-area-inset-bottom`, and auto-enable `overflow-x-auto` when `tabs.length > 5` (or via explicit `scrollable` prop). Backdrop blur for iOS feel.
- **Migration for existing consumers:** `<MobileBottomNav tabs={...}>` still works; labels disappear unless `showLabels` is passed. Re-install via `shadcn add --overwrite r/mobile-bottom-nav.json`.

---

### L8 — `Sidebar` visual polish missing user-card pattern + section dividers

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 design exploration vs AIA Website reference)
- **Status:** `fixed` (commit `02bc204` in jh-design-system)
- **Severity:** low (worked, but felt thinner than AIA's polished sidebar)
- **Symptom:** original `Sidebar` rendered sections without explicit visual dividers between them (only `gap-4`), used `h-4` icons (vs AIA's `h-[18px]`), placed collapse button at the bottom, and had no slot for the "user info card" pattern (avatar + name + inline logout) that production sidebars commonly use.
- **Reference impl:** AIA Website `src/components/Sidebar.tsx` uses `w-56` / `w-[68px]`, `border-t border-[var(--border-subtle)]` dividers between sections with `pt-3 mt-3`, collapse button at top inline with toggles, and a structured user-card at the bottom (`h-[18px] w-[18px]` avatar tile with initial + name + inline logout button).
- **Fix in canonical:**
  1. Adopted AIA dimensions and `h-[18px]` icon sizing.
  2. Added `border-t` divider between sections (skipped before first).
  3. Moved collapse button to top of nav area (closer to AIA layout).
  4. Added `userCardSlot?: React.ReactNode` prop — when provided, replaces the simple-logout fallback at the bottom. Consumers can render their preferred user-info card.
  5. Items use `truncate` on label span.
- **Backward compat:** all existing props still work. Consumers without a `userCardSlot` fall back to the simple `onLogout` button (same as before, just styled with `h-[18px]` icon).

---

### L9 — Canonical-stub-vs-AIA-richness drift (registry hides incomplete ports)

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 Phase B)
- **Status:** `fixed` (Plan 4 commit `2fd0faf` in canonical)
- **Severity:** structural (silently caps consumer UX; only surfaces when a consumer wants the "full" capability)
- **Symptom:** Plan 3 installed `use-preferences` + `gradient-picker` from canonical. Both were 78-87 line stubs vs the 367+439 line richer versions used in AIA Website (the canonical's "spiritual parent"). Consumer thought they had the production system; they actually had a skeleton. Discovered only when explicitly asked to clone AIA's UX in Plan 4.
- **Root cause:** the canonical was bootstrapped from AIA selectively — some items copied verbatim, others sketched as minimal stubs to keep the registry building. No flag in `registry.json` distinguished "full" items from "stub". Lessons doc was reactive (records bugs) not prescriptive (records what's a stub).
- **Catches it:** no automated check — a code review against AIA source, or a consumer realizing the UI is thinner than expected.
- **Workaround in consumer:** Plan 4 ported the rich versions back into canonical, then re-installed in Presupuestos. Cost: ~1 full session.
- **Proposed fix in canonical:**
  1. Add `"completeness": "full" | "stub" | "skeleton"` to every `registry.json` item. New items default to `"stub"`. Consumers/installers see the status.
  2. Companion audit: walk every item in canonical vs. its AIA counterpart and tag completeness honestly.
  3. Surface this in the catalog README / sandbox so consumers see it before installing.

---

### L10 — Recurring relative `../lib/cn` import bug at install (L2 third occurrence)

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 Phase C, after L2 in Plan 3 Task 11)
- **Status:** `fixed` (canonical commit applied 2026-05-13 to `scripts/build-registry.mjs`)
- **Severity:** medium (TS error blocks build until fixed; trivial fix but cumulative cost grows)
- **Symptom:** new registry items (gradient-picker, use-preferences) shipped with `import { cn } from "../lib/cn"` (and `from "../hooks/use-preferences"`, etc.). After shadcn-add lands them at `components/molecules/`, `../lib/cn` resolves to `components/lib/cn` which doesn't exist. Same shape as L2.
- **Root cause:** canonical registry sources use relative imports because they sit next to siblings inside `registry/`. When shadcn copies them out, the relative paths break (consumer aliases differ). The canonical does this for *all* cross-item imports, not just `cn`. Three offenders in this conversation alone (gradient-picker had 4 such imports).
- **Catches it:** `tsc --noEmit` post-install — or smoke fail at runtime.
- **Workaround in consumer:** find/replace `../lib/X` → `@/lib/X` and `../hooks/X` → `@/hooks/X` after every shadcn-add. Three rounds of this and counting.
- **Fix applied in canonical:**
  - `scripts/build-registry.mjs` now rewrites `from "../X/Y"` → `from "@/X/Y"` (and the dynamic-import variant `import("../X/Y")`) when emitting `r/*.json`. Affected prefixes: `lib`, `hooks`, `components`, `providers`, `molecules`, `layout`, `templates`, `charts`, `landing`, `ui`, `tokens`. Source files stay relative (so the canonical sandbox + tests resolve siblings correctly); only the installed copies use aliases.
  - Verified: 0 occurrences of `../lib/` or `../hooks/` remain in any `r/*.json` after rebuild. 65/65 items validate, 64/64 tests pass.
  - Consumer impact: next `shadcn add` after this commit lands clean files with no L2/L10 fixup needed. Existing installed copies in current consumers still have the relative imports baked in — re-run `shadcn add --overwrite` for affected items (`gradient-picker`, `use-preferences`, `preferences-page`) to pick up the fix.

---

### L11 — Provider migration (`ThemeProvider` → `PreferencesProvider`) is a breaking change in v0.2

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 Phase C)
- **Status:** `documented` (handled cleanly in v0.2 bump)
- **Severity:** medium (breaking but trivial migration; only one wrap-site in most apps)
- **Symptom:** v0.1 consumers wired `<ThemeProvider defaultThemeId="accent-orange">`. v0.2 ships `<PreferencesProvider>` with gradient-based palette generation. The two systems compete for the same `--primary` and friends. Consumers that bump must swap one for the other; can't run both simultaneously without one's writes clobbering the other's.
- **Reference migration (Presupuestos):**
  ```diff
  - import { ThemeProvider } from "@/components/providers/theme-provider";
  + import { PreferencesProvider } from "@/hooks/use-preferences";
  - <ThemeProvider defaultThemeId="accent-orange" defaultMode="light">
  + <PreferencesProvider>
      <I18nProvider defaultLang="es">{children}</I18nProvider>
  - </ThemeProvider>
  + </PreferencesProvider>
  ```
  Plus drop `ThemePicker` from any nav slots (replaced by `GradientPicker` in preferences page).
- **Compat note:** `ThemeProvider` + `themes.ts` + `theme-picker` stay in canonical (v0.1 consumers don't break). Just marked as legacy in v0.2. Removal targeted for v1.0.
- **Catches it:** smoke test that asserts `--primary` reflects the chosen gradient after a `setGradient` call.

---

### L12 — Picker components should accept `labels?` prop, not depend on `useLang` hook

- **Discovered:** 2026-05-13 (Presupuestos2.0, Plan 4 Phase B, porting `GradientPicker` from AIA)
- **Status:** `fixed` (canonical `gradient-picker.tsx` uses `labels` prop pattern)
- **Severity:** low (registry-hygiene; matters for consumers that don't ship the i18n hook)
- **Symptom:** AIA's `GradientPicker` called `useLang().t("prefs.preset-gradients")` directly — registry consumers without the `use-lang` + dict installed get a runtime crash on render.
- **Root cause:** picker bound its strings to a specific i18n contract (AIA's dict keys). Coupled the component to consumer infra.
- **Fix in canonical:** accept `labels?: GradientPickerLabels` prop with English defaults. Consumers with i18n pass `labels={{ presetGradients: t("..."), ... }}`. Consumers without i18n get readable English out of the box.
- **Generalizes to:** any registry component with user-facing strings. Pattern: `labels?: SpecificLabels` with full default object spread (`const t = { ...DEFAULT_LABELS, ...labels }`). Apply to `GradientPicker`, future date/time pickers, file uploaders, etc.

---

### L13 — `button.tsx` uses Tailwind `bg-primary` while the rest of the app styles with `var(--primary)` arbitrary classes

- **Discovered:** 2026-05-14 (Presupuestos2.0, web-fixes branch — FIX 3, replacing ad-hoc edit-mode buttons with canonical `<Button>`)
- **Status:** `known` (works correctly; it's an authoring-consistency drift, not a runtime bug)
- **Severity:** low (no visible breakage — but two token-reference conventions coexist in one codebase, which confuses contributors and risks future divergence)
- **Symptom:** the canonical `components/ui/button.tsx` `buttonVariants` cva uses Tailwind semantic utility classes — `bg-primary text-primary-foreground`, `bg-destructive`, `bg-accent`, `border-input`, `focus-visible:ring-ring`. Meanwhile every hand-written component in the consumer app styles with arbitrary-value classes referencing CSS vars directly: `bg-[var(--primary)] text-[var(--primary-fg)] hover:bg-[var(--primary-hover)]`, `border-[var(--border-subtle)]`, etc. When you swap an ad-hoc button for `<Button>`, the two conventions sit side by side in the same file.
- **Why it still works:** the consumer's `globals.css` bridges them with a `@theme` block — `--color-primary: var(--primary); --color-primary-foreground: var(--primary-fg);`. Tailwind 4 turns `--color-primary` into the `bg-primary` utility, so `bg-primary` ultimately resolves to the same `--primary` token the arbitrary classes use. Verified visually: the canonical `<Button>` renders with the correct accent color (and picks up the runtime `PreferencesProvider` gradient override from L11, since that rewrites `--primary`).
- **Root cause:** `button.tsx` was ported from a shadcn baseline that assumes the stock shadcn token names (`primary`, `primary-foreground`, `destructive`, `accent`, `input`, `ring`) are registered as Tailwind theme colors. The JH design system's own token layer is `--primary` / `--primary-fg` / `--primary-hover` / `--border-subtle` / etc. The `@theme` bridge in `globals.css` is what makes shadcn-style components work at all — but it's an undocumented dependency, and it only maps a subset (`primary`, `primary-foreground`). A consumer that installs `<Button>` but whose `globals.css` lacks the `@theme` bridge gets an unstyled button (utilities resolve to nothing) with **no error** — same silent-failure shape as L1.
- **Catches it:** browser visual smoke only. `tsc` and `build` pass — Tailwind just emits no rule for an unknown utility.
- **Workaround in consumer:** none needed here — the `@theme` bridge already exists in this app's `globals.css` (lines ~103-104). Left `<Button>` using `bg-primary` as authored; did not rewrite it to arbitrary `var(--primary)` classes (that would fork the canonical component).
- **Proposed fix in canonical:**
  1. Pick one convention for the design system and document it. Either (a) commit to shadcn-style theme colors and ship the required `@theme` block as part of the foundation install (so `bg-primary`, `bg-destructive`, `border-input`, `ring-ring` etc. are guaranteed registered), **or** (b) rewrite `button.tsx` (and any other shadcn-derived `ui/*` component) to use the JH `var(--token)` arbitrary-class convention the rest of the system uses.
  2. If staying with (a): the foundation registry item must write the full `@theme` mapping for *every* shadcn token name `ui/*` components reference (`primary`, `primary-foreground`, `destructive`, `destructive-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `muted`, `input`, `border`, `ring`, `background`, `foreground`). The current consumer `@theme` only maps `primary` + `primary-foreground` — `<Button variant="destructive">` or `variant="secondary">` would render unstyled.
  3. Add a lesson-doc / README note: *"`ui/*` components depend on the `@theme` color bridge in `globals.css`. Verify it's present and complete after foundation install."* — same class of silent-failure as L1/L4.

---

### L14 — no `dropdown-menu` primitive; kebab/action menu hand-rolled on `popover`

- **Discovered:** 2026-06-03 (Presupuestos2.0, rubros edit/archive redesign Fase 1 — per-row 3-dot kebab menu)
- **Status:** `known` (works; registry gap)
- **Severity:** low-medium (every consumer that wants an action/kebab menu reinvents it; loses menu a11y)
- **Symptom:** needed a per-row 3-dot kebab action menu (Archivar / Revertir a CAMICON / Duplicar como plantilla). The registry ships `popover.tsx` and `dialog.tsx` but **no `dropdown-menu`** — and `@radix-ui/react-dropdown-menu` is not a dependency. Had to hand-roll the menu as a `<Popover>` whose content is a stack of plain `<button>` items, with manual styling, manual `setMenuOpen(false)` on each action, and `stopPropagation` on the trigger so the click doesn't toggle the row's expand.
- **Root cause:** registry lacks the shadcn `dropdown-menu` primitive. `Popover` is a generic floating container, not a menu — it gives no `role="menu"`/`menuitem`, no roving-tabindex/arrow-key navigation, no typeahead, and no auto-close-on-select. A kebab menu wants all of those.
- **What catches it:** authoring only — no `tsc`/build error. The Popover-as-menu works visually and functionally for a short list; it just lacks keyboard-menu semantics.
- **Workaround in consumer:** `Popover` + `<button>` rows (`components/catalogo/RowKebab.tsx`); `Dialog` for the Duplicar name prompt. Trigger does `e.stopPropagation()` to avoid the row's expand toggle. Menu items call the action then `setMenuOpen(false)`. Good enough for 1–3 items; would not scale to a rich menu (submenus, checkboxes, shortcuts).
- **Proposed fix in canonical:**
  1. Add `dropdown-menu.tsx` (shadcn baseline on `@radix-ui/react-dropdown-menu`) to the registry as the standard for action/kebab menus, plus the dep.
  2. Document the split: **Popover = freeform content** (forms, pickers, info), **DropdownMenu = action lists** (kebab, row actions, context menus).
  3. Same `@theme` token dependency as L13 applies (menu content/item classes must resolve `bg-popover`/`accent`/etc. or use the JH `var(--token)` convention).

---

### L15 — unlayered `* { border-color: var(--border) }` silently defeats every Tailwind border-color utility

- **Discovered:** 2026-07-22 (Presupuestos2.0, ronda de polish pre-demo)
- **Status:** `open`
- **Severity:** high (silent visual drift app-wide; invisible to tsc/tests/build)
- **Symptom:** every `border-*` color utility in the app (`border-transparent`, `border-[var(--fg)]`, `focus:border-[var(--primary)]`, `border-[var(--border-subtle)]`) computed `var(--border)` (#eaeaea) instead of its declared color. Black hairlines on grand totals rendered light gray; orange focus/status borders rendered gray; borderless-hover inputs (`border-transparent hover:border-[var(--border)]`) showed permanent boxes. Nobody noticed for months because most declared colors were grays close to #eaeaea.
- **Root cause:** `app/globals.css` carried `* { border-color: var(--border); }` OUTSIDE any `@layer` (the Tailwind-v3-default restoration rule). In Tailwind v4, utilities live in `@layer utilities`, and **unlayered author CSS beats ALL layered CSS regardless of specificity** — even a `*` selector with specificity (0,0,0) wins over every utility class.
- **Catches it:** only a computed-style probe in the browser (`getComputedStyle(el).borderColor` vs the class string). tsc, vitest, and `next build` all pass.
- **Workaround in consumer:** wrap the rule in `@layer base { * { border-color: var(--border); } }` (Presupuestos commit `7e0f662`). Utilities win again; elements with no color utility keep the default.
- **Proposed fix in canonical:**
  1. If any registry `globals.css` ships a border-color default (v3 compat), it MUST be inside `@layer base`.
  2. Add to consumer docs: in Tailwind v4, any global rule in `globals.css` that touches properties utilities also set (border-color, outline, etc.) must live in `@layer base` — unlayered rules beat utilities.
  3. Optional probe in the visual smoke: assert a `border-transparent` element computes transparent.

---

### L16 — `--accent` is a shadcn alias for a *background*, so a real accent color has nowhere to live

- **Discovered:** 2026-07-24 (Presupuestos2.0, pins UI 83/81/85)
- **Status:** `documented` — consumer worked around it; canonical fix proposed below
- **Severity:** medium (naming trap; every consumer that eventually wants an accent hits it)
- **Symptom:** the consumer needed to introduce exactly one accent color into an otherwise strict 2-color (bg + fg) system. The obvious token name, `--accent`, was already taken: in the shadcn compat block it aliases `--bg-subtle` (a near-white hover background), and `--accent-foreground` aliases `--fg`. Any developer who reaches for "the accent color" gets a hover gray. The consumer's own design doc had to carry a **PROHIBIDO `--accent`** rule, which is a documented footgun rather than a fix — and it stayed a footgun long enough to be re-discovered here.
- **Root cause:** shadcn's `accent`/`accent-foreground` pair means "subtle emphasis surface", not "brand accent". Inheriting that vocabulary into a token system whose users read `accent` with the everyday meaning guarantees the collision. The name is load-bearing in the wrong direction.
- **Workaround used in the consumer:** new token named `--accent-signal` (+ derived `--accent-signal-fg`, black or white by luminance so text inside the accent stays legible at 9px). Deliberately NOT `--accent`. Documented side by side with the prohibition so the two can't be confused.
- **Two design decisions worth stealing, independent of the naming:**
  1. **A third color needs a closed whitelist, not an exception.** The consumer's design law said "JAMÁS un tercer color". Rather than quietly breaking it, the rule was amended to name the token, give it exactly ONE meaning ("there is something new addressed to you"), and enumerate the *only two* places it may appear — everything else explicitly prohibited. An open-ended "use sparingly" would have leaked within a sprint.
  2. **The accent must not participate in theme inversion.** The consumer's dark mode is a pure swap of the bg/fg pair (`effectivePair`). An accent that rides inside that pair would invert into a different hue. Keeping it a sibling of the pair, applied to `:root` separately, is what makes it stable across themes. There is now a regression test asserting the swap function still returns exactly two keys.
- **Catches it:** nothing automatic — it's a naming collision, so it type-checks and renders fine while looking wrong. Only a human reading `bg-[var(--accent)]` and expecting color catches it.
- **Proposed fix in canonical:**
  - Rename the shadcn compat aliases to `--surface-emphasis` / `--surface-emphasis-fg`, keeping `--accent` as a deprecated alias for one minor version so existing consumers don't break.
  - Ship `--accent-signal` + `--accent-signal-fg` (with the luminance-derived foreground helper) as first-class optional tokens, documented as "opt-in, whitelist-governed, never inverted".
  - Add the whitelist-amendment pattern to the design-doc template: a third color is admissible only with a stated single meaning and an enumerated list of permitted uses.

---

### L17 — `MobileBottomNav` icon-only: el activo no se ve, la mitad de la app no entra, y `fixed` tapa contenido

- **Discovered:** 2026-08-10 (Presupuestos2.0, polish de UI mobile)
- **Status:** `open` — el consumidor retiró el componente de su shell
- **Severity:** medium (el primitivo funciona, pero sus defaults empujan a una nav que no se puede leer ni completar)
- **Symptom:** el bottom-nav del registry se montó tal cual (`showLabels` en su default `false`) y en producción resultó ilegible y parcial: cinco glifos sin texto, y el indicador de activo — un `<span>` de `w-4 h-0.5` en `absolute -bottom-0.5` — quedaba fuera del área visible del tab, así que **ninguna** pestaña se veía activa. Además el componente admite como mucho ~5 tabs antes de scrollear, y la app tenía **nueve** destinos: cuatro (Catálogo, Cronograma, Control, Inbox) quedaron sin ninguna entrada en mobile, alcanzables sólo escribiendo la URL. Y siendo `fixed bottom-0`, tapaba la última fila de toda tabla larga salvo que cada página recordara su propio padding inferior.
- **Root cause:** tres defaults, no bugs. (1) `showLabels = false` convierte al componente en un jeroglífico salvo que los iconos sean universales (home, buscar, perfil) — no lo son en una app de dominio (presupuesto vs. cronograma vs. catálogo). (2) El indicador de activo se posiciona **fuera** del padding del link (`-bottom-0.5`), así que depende de que el contenedor no recorte; en un contenedor con `overflow-x-auto` (que el propio componente activa con >5 tabs) se pierde. (3) `fixed` traslada al consumidor la responsabilidad de compensar el alto, y basta una página que lo olvide para perder contenido.
- **What catches it:** nada automático. Renderiza, typechequea y los tests de "hay cinco links" pasan. Sólo una captura a 375px lo muestra.
- **Workaround in consumer:** se reemplazó por un **HUD de modo** propio (`components/layout/mobile-mode-nav.tsx`): una fila con UN botón que **imprime el nombre de la pantalla actual** + una hoja que lista todos los destinos, derivada del MISMO array `sections` que consume el `Sidebar` desktop (nada puede quedar inalcanzable) y **no `fixed`** — hermano `shrink-0` de `<main>`, ocupa alto real. `MobileBottomNav` queda en el repo sin consumidor.
- **Proposed fix in canonical:**
  1. Invertir el default: `showLabels = true`. Un bottom-nav sin labels debería ser el opt-in explícito, no el camino por defecto.
  2. Mover el indicador de activo **dentro** del padding del link (`bottom-0` con `pb`), o cambiarlo por peso tipográfico, que no depende de geometría ni de overflow.
  3. Ofrecer `sticky`/in-flow como alternativa a `fixed`, o al menos exportar la altura como custom property (`--mobile-nav-h`) para que el consumidor la descuente sin adivinar.
  4. **Documentar el techo de destinos.** El componente degrada a scroll horizontal por encima de 5 tabs; conviene decir explícitamente que por encima de ~5 el patrón correcto es otro (selector de modo + hoja), no una barra más larga.

---

### L18 — Tailwind v4: cuando la escala tipográfica está hardcodeada en `text-[Npx]`, el único "token" real es un mapa sin capa

- **Discovered:** 2026-08-10 (Presupuestos2.0, bajar ~2pt la tipografía en mobile)
- **Status:** `documented` — patrón que funcionó, vale recomendarlo
- **Severity:** low (no es un bug: es una técnica que evita una refactorización de ~800 ediciones)
- **Symptom:** el pedido era "bajá 2pt la escala base en mobile, en el token". No había token: la app aplica su escala escribiendo `text-[Npx]` en cada componente — **818 usos, nueve tamaños distintos**. Ni `html { font-size }` ni un token de `@theme` mueven un `font-size` en px absolutos, así que la lectura literal del pedido llevaba a tocar cientos de archivos y a sembrar `text-[11px] md:text-[13px]` por todos lados.
- **Root cause:** un design system cuya escala vive en utilities arbitrarias no tiene punto de control. El punto de control **existe igual**, pero es el conjunto de los N tamaños en uso, no una variable.
- **Solución (recomendable):** un bloque único al final de `globals.css` que reasigne esos N tamaños dentro de un media query:
  ```css
  @media (max-width: 767px) {
    .text-\[13px\] { font-size: 11px; }
    .text-\[12px\] { font-size: 10px; }
    /* … los N tamaños en uso, con un PISO explícito */
  }
  ```
  **Va sin `@layer`, a propósito** — es el reverso exacto de L15: en Tailwind v4 las utilities viven en `@layer utilities` y una regla sin capa le gana a cualquier regla en capa sin importar especificidad. Acá esa asimetría es la herramienta, no la trampa: pisa `text-[13px]` sin un solo `!important` y sin depender del orden del bundle. Dos consecuencias a tener presentes: hay que fijar un **piso** (por debajo de ~9px los micro-labels uppercase dejan de leerse) y con muchos escalones **algunos colapsan** — hay que elegir cuáles a conciencia, no por redondeo.
- **What catches it:** que la regla gane se verifica con una sonda de estilo computado (`getComputedStyle(el).fontSize`) en el navegador; el inventario de tamaños sale de un `grep -ohE 'text-\[[0-9]+px\]' | sort | uniq -c`. Nada de esto lo ve `tsc` ni el build.
- **Proposed fix in canonical:**
  1. Shipear una escala tipográfica **en tokens** (`--text-xs … --text-xl` + utilities semánticas) para que los consumidores nuevos no caigan en `text-[Npx]`; documentar `text-[Npx]` como escape hatch, no como camino principal.
  2. Documentar esta técnica del mapa sin capa como la salida estándar para consumidores que ya tienen la escala hardcodeada — es la migración barata, y deja el inventario a la vista para migrar a tokens después.
  3. Emparejarla con L15 en los docs: **la misma regla de cascada** (unlayered > layered) es un bug en un caso y la herramienta en el otro. Enseñarlas juntas.

---

### L19 — `min-width:auto` es la causa raíz del scroll lateral en mobile, y el culpable nunca es el elemento que se ve cortado

- **Discovered:** 2026-08-10 (Presupuestos2.0, cacería de horizontal overflows a 375px)
- **Status:** `documented`
- **Severity:** medium (afecta a todo consumidor que meta una tabla o un `truncate` dentro de un grid/flex, o sea: a todos)
- **Symptom:** en un teléfono de 375px la app scrolleaba de lado en cuatro pantallas. Lo que se VE es un contador o una etiqueta cortada contra el borde derecho — pero el elemento cortado no tiene nada malo. En Inicio, el culpable real era una tabla de otra sección: los tres bloques del grid medían 360px dentro de un contenedor de 343 porque **uno solo** de ellos tenía min-content 360.
- **Root cause:** los items de grid y de flex traen `min-width: auto`, o sea que **no bajan de su min-content**. Tres consecuencias que se repiten:
  1. Un grid de una columna en mobile no mide el contenedor: mide el min-content del item más ancho, y se lo impone a TODOS sus hermanos.
  2. Un `overflow-x-auto` alrededor de una tabla ancha **no alcanza** si su ancestro es un item de grid: el scroller no puede encogerse, así que el ancho sale igual por arriba y termina siendo scroll de la página.
  3. `truncate` dentro de un flex **no trunca nunca** sin `min-w-0`: `truncate` incluye `white-space:nowrap`, así que el min-content del span es el texto entero y empuja en vez de recortarse.
- **What catches it:** nada del toolchain — ni `tsc`, ni el build, ni los tests de jsdom (no hay layout). Sólo una medición en el navegador. La sonda que lo encontró: recorrer los scrollers reales (`documentElement` + todo lo que tenga `overflow-x: auto|scroll` **y** `scrollWidth > clientWidth`), y dentro de cada uno quedarse con los elementos **más profundos** cuyo `right` pasa el límite, descartando los que ya viven dentro de un scroller anidado. Sin el "más profundo" el reporte dice `<body>`, que no sirve para arreglar nada.
- **Workaround en el consumidor:** `[&>*]:min-w-0` en el contenedor de grid (una sola clase cubre los items presentes y los futuros, que es lo que un contenedor de bloques necesita) y `min-w-0` en todo span con `truncate`. Nunca `overflow-x: hidden` en el ancestro: esconde el síntoma y recorta contenido que el usuario necesita leer. Las salidas legítimas son envolver, truncar con elipsis, reacomodar en dos renglones, o —cuando el contenido es genuinamente ancho, tipo Gantt— dejar que el scroll viva **dentro** de ese componente con el resto de la UI quieto.
- **Proposed fix in canonical:**
  1. Que los primitivos de layout que envuelven contenido (cards, secciones de grid, item de nav, celda de tabla) traigan `min-w-0` de fábrica: hoy cada consumidor lo redescubre a los golpes.
  2. Que el primitivo de tabla que ya viene con `overflow-x-auto` documente que **el wrapper no basta** si el ancestro no puede encoger, y que los pisos tipo `min-w-[480px]` se declaren `md:min-w-[…]` — un piso de legibilidad de escritorio no tiene sentido en un teléfono, y ahí se cobra como scroll.
  3. Publicar la sonda de overflow como script del repo (`scripts/check-overflows.mjs` + Playwright a 375px): es la única red que atrapa esta clase de bug, y hoy no existe en ningún lado.

---

## How to add a lesson

Append a new `### Lx — short title` section under "Lessons" with:
- Date discovered + consumer
- Status + severity
- Symptom (what the consumer sees)
- Root cause (what's actually wrong)
- What catches it (test/build/visual?)
- Workaround used in the consumer
- Proposed fix in canonical (concrete, actionable)

When a lesson lands as a registry fix, update its status to `fixed` and link the commit.
