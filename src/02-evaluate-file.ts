// Evaluate a .vada file from your own repository against the platform engine.
import { readFile } from "node:fs/promises";
import { Prometheux } from "@pmtx/chain";
import { type Evaluation, rowsOf } from "./lib/evaluation.ts";

const px = new Prometheux();

const program = await readFile("programs/company-control.vada", "utf8");
const result = (await px.vadalog.evaluate(program)) as Evaluation;

console.table(rowsOf(result, "control"));
console.log(`Evaluated in ${result.elapsedTime} ms`);
