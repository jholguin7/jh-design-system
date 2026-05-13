// scripts/validate-registry.mjs
// Validates each r/*.json has required shadcn 2026 fields.

import fs from "node:fs";
import path from "node:path";

const OUT = "r";
const REQUIRED_FIELDS = ["name", "type", "title", "files"];
let failures = 0;
let count = 0;

if (!fs.existsSync(OUT)) {
  console.error(`r/ directory missing — run build:registry first`);
  process.exit(1);
}

for (const file of fs.readdirSync(OUT)) {
  if (!file.endsWith(".json")) continue;
  count++;
  const p = path.join(OUT, file);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    console.error(`${file}: JSON parse error: ${e.message}`);
    failures++;
    continue;
  }
  for (const f of REQUIRED_FIELDS) {
    if (!(f in parsed)) {
      console.error(`${file}: missing required field '${f}'`);
      failures++;
    }
  }
  if (!Array.isArray(parsed.files) || parsed.files.length === 0) {
    console.error(`${file}: 'files' must be a non-empty array`);
    failures++;
    continue;
  }
  for (const fileEntry of parsed.files) {
    if (!fileEntry.path) {
      console.error(`${file}: file entry missing 'path'`);
      failures++;
    }
    if (typeof fileEntry.content !== "string") {
      console.error(`${file}: file entry missing 'content'`);
      failures++;
    }
    if (!fileEntry.type) {
      console.error(`${file}: file entry missing 'type'`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\nValidation FAILED: ${failures} error(s) across ${count} files.`);
  process.exit(1);
}
console.log(`\n  ${count} registry items validated.`);
