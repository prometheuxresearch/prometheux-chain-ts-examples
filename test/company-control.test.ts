// Unit-test a Vadalog program with Node's built-in test runner: evaluate the
// .vada file on the platform and compare its output with the rows you expect.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { Prometheux } from "@pmtx/chain";
import type { Evaluation } from "../src/lib/evaluation.ts";

const px = new Prometheux();

test("company control finds direct and indirect control", async () => {
  const program = await readFile("programs/company-control.vada", "utf8");
  const result = (await px.vadalog.evaluate(program)) as Evaluation;

  const pairs = result.resultSet.control.map(([owner, company]) => `${owner} → ${company}`);

  assert.deepEqual(pairs.sort(), [
    "Alpha Treasury → Goldward Bank",
    "Alpha Treasury → Initech",
    "Alpha Treasury → Phoenix Vault",
    "Alpha Treasury → Royal Crown Bank",
    "Alpha Treasury → Soylent Corp",
    "Initech → Soylent Corp",
    "Phoenix Vault → Royal Crown Bank",
  ]);
});

test("the large-orders program compiles", async () => {
  const program = await readFile("programs/large-orders.vada", "utf8");
  const { valid, error } = await px.vadalog.validate(program);
  // On failure, the assertion prints the compiler's error.
  assert.equal(error, undefined);
  assert.ok(valid);
});
