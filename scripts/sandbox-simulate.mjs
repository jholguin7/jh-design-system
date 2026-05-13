// Simulates a shadcn install for sanity-check: for a representative subset of items,
// verifies (a) the JSON parses, (b) content field is non-empty, (c) registryDependencies
// point to other items in r/, (d) no @/lib/utils stragglers remain.

import fs from "node:fs";
import path from "node:path";

const SANDBOX_ITEMS = [
  "tokens",
  "themes",
  "cn",
  "use-lang",
  "theme-provider",
  "button",
  "sidebar",
  "header",
  "theme-picker",
];

let errors = 0;
for (const name of SANDBOX_ITEMS) {
  const p = path.join("r", `${name}.json`);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${p}`);
    errors++;
    continue;
  }
  const item = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!item.files || item.files.length === 0) {
    console.error(`${name}: no files`);
    errors++;
    continue;
  }
  for (const f of item.files) {
    if (!f.content || f.content.length === 0) {
      console.error(`${name}: empty content for ${f.path}`);
      errors++;
    }
    if (f.content.includes("@/lib/utils")) {
      console.error(`${name}: lingering @/lib/utils import in ${f.path}`);
      errors++;
    }
    if (f.content.includes("@/components/ui/")) {
      console.error(`${name}: lingering @/components/ui/ import in ${f.path}`);
      errors++;
    }
    if (f.content.includes("@/hooks/")) {
      console.error(`${name}: lingering @/hooks/ import in ${f.path}`);
      errors++;
    }
  }
  // Walk registryDependencies — each should be an existing r/*.json
  for (const dep of item.registryDependencies ?? []) {
    const match = dep.match(/\/([^/]+)\.json$/);
    if (!match) {
      console.error(`${name}: malformed registry dep URL: ${dep}`);
      errors++;
      continue;
    }
    const depName = match[1];
    if (!fs.existsSync(path.join("r", `${depName}.json`))) {
      console.error(`${name}: missing transitive dep ${depName}`);
      errors++;
    }
  }
  console.log(`  ${name} (${item.files.length} file(s), ${(item.registryDependencies ?? []).length} reg dep(s))`);
}

if (errors > 0) {
  console.error(`\nSandbox simulation FAILED: ${errors} error(s).`);
  process.exit(1);
}
console.log(`\nSandbox simulation PASS — all ${SANDBOX_ITEMS.length} representative items installable.`);
