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
- **Status:** `known` (workaround applied per-consumer; canonical fix still pending)
- **Severity:** medium (TS error blocks build until fixed; trivial fix but cumulative cost grows)
- **Symptom:** new registry items (gradient-picker, use-preferences) shipped with `import { cn } from "../lib/cn"` (and `from "../hooks/use-preferences"`, etc.). After shadcn-add lands them at `components/molecules/`, `../lib/cn` resolves to `components/lib/cn` which doesn't exist. Same shape as L2.
- **Root cause:** canonical registry sources use relative imports because they sit next to siblings inside `registry/`. When shadcn copies them out, the relative paths break (consumer aliases differ). The canonical does this for *all* cross-item imports, not just `cn`. Three offenders in this conversation alone (gradient-picker had 4 such imports).
- **Catches it:** `tsc --noEmit` post-install — or smoke fail at runtime.
- **Workaround in consumer:** find/replace `../lib/X` → `@/lib/X` and `../hooks/X` → `@/hooks/X` after every shadcn-add. Three rounds of this and counting.
- **Proposed fix in canonical:**
  1. **Build-script rewrite:** in `scripts/build-registry.mjs`, when emitting `r/*.json`, rewrite `../lib/X` and `../hooks/X` etc. to `@/lib/X` / `@/hooks/X` in the `content` field. The registry source files stay as-is (so dev imports work) but the *installed* version uses the alias. Single 5-line code change in the build script.
  2. **OR:** linter rule that bans relative imports in `registry/**/*` source. Forces authors to use aliases via tsconfig path mappings. Higher friction but catches the bug at write-time.

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
