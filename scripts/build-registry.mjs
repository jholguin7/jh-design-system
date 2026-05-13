// scripts/build-registry.mjs
// Compiles registry.json + registry/* source files → r/*.json
// Each output is a self-contained shadcn registry-item JSON.

import fs from "node:fs";
import path from "node:path";

const REG = JSON.parse(fs.readFileSync("registry.json", "utf8"));
const OUT = "r";
const REPO_RAW =
  "https://raw.githubusercontent.com/jholguin7/jh-design-system/main/r";

fs.mkdirSync(OUT, { recursive: true });

for (const item of REG.items) {
  const compiled = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: (item.registryDependencies ?? []).map(
      (n) => `${REPO_RAW}/${n}.json`,
    ),
    files: item.files.map((f) => {
      const content = fs.readFileSync(f.path, "utf8");
      const out = {
        path: f.target ?? f.path,
        content,
        type: f.type,
      };
      if (f.target) out.target = f.target;
      return out;
    }),
  };
  fs.writeFileSync(
    path.join(OUT, `${item.name}.json`),
    JSON.stringify(compiled, null, 2),
  );
  console.log(`  r/${item.name}.json`);
}
console.log(`\nBuilt ${REG.items.length} registry items.`);
