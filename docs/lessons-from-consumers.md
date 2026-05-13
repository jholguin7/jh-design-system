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
