// Run the same program with different inputs. `params` overrides the program's
// @param defaults, so one .vada file serves many queries. Each value is pasted
// into the program as Vadalog text: numbers go as they are, strings need quotes.
import { readFile } from "node:fs/promises";
import { Prometheux } from "@pmtx/chain";
import { type Evaluation, rowsOf } from "./lib/evaluation.ts";

const px = new Prometheux();

const program = await readFile("programs/large-orders.vada", "utf8");

for (const params of [
  { region: '"North"', min_total: 1000 },
  { region: '"South"', min_total: 0 },
]) {
  const result = (await px.vadalog.evaluate(program, { params })) as Evaluation;
  console.table(rowsOf(result, "large_orders"));
}
