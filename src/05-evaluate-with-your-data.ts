// Upload a CSV to your workspace storage, then evaluate a program that reads it
// through @bind. The same pattern works for Parquet, Excel and JSON files.
import { readFile } from "node:fs/promises";
import { fileFromPath, Prometheux } from "@pmtx/chain";
import { type Evaluation, rowsOf } from "./lib/evaluation.ts";

const px = new Prometheux();

// Uploads go under disk/. The target directory must exist first.
const folders = await px.files.list();
if (!folders.some((entry) => entry.name === "examples")) await px.files.mkdir("examples");

const { filePath } = await px.files.upload(await fileFromPath("data/ownership.csv"), {
  path: "examples",
});
console.log(`Uploaded to ${filePath}`);

// programs/company-control-from-csv.vada binds `own` to disk/examples/ownership.csv.
const program = await readFile("programs/company-control-from-csv.vada", "utf8");
const result = (await px.vadalog.evaluate(program)) as Evaluation;

console.table(rowsOf(result, "control"));
