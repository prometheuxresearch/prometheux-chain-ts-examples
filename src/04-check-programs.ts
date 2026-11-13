// Check every .vada file in programs/ without running it: compile each one and
// list what it reads and produces. Exits with 1 if any program is invalid, so it
// works as a CI step.
import { readdir, readFile } from "node:fs/promises";
import { Prometheux } from "@pmtx/chain";

const px = new Prometheux();

let failed = 0;
for (const file of (await readdir("programs")).filter((name) => name.endsWith(".vada"))) {
  const program = await readFile(`programs/${file}`, "utf8");

  const { valid, error } = await px.vadalog.validate(program);
  if (!valid) {
    failed++;
    console.log(`✗ ${file}\n  ${error}`);
    continue;
  }

  const { inputPredicates, headPredicates } = await px.vadalog.analyze(program);
  console.log(`✓ ${file}`);
  console.log(`  reads:    ${inputPredicates.join(", ")}`);
  console.log(`  produces: ${headPredicates.join(", ")}`);
}

process.exitCode = failed ? 1 : 0;
