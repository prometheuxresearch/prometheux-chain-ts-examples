// The SDK running in the browser: every request goes from this page straight to
// the platform. Your bundler picks the browser build of @pmtx/chain on its own.
import { Prometheux } from "@pmtx/chain";
import { type Evaluation, rowsOf } from "../src/lib/evaluation.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// Filled in from JARVISPY_URL in .env by browser/serve.mjs; only the URL, never the token.
declare const DEFAULT_BASE_URL: string;
$<HTMLInputElement>("baseUrl").value = DEFAULT_BASE_URL;

// The token is pasted into the page and kept in memory only. Do not put a token
// in code that you serve to other people: it grants full access to its account.
function client(): Prometheux {
  return new Prometheux({
    token: $<HTMLInputElement>("token").value.trim(),
    baseUrl: $<HTMLInputElement>("baseUrl").value.trim(),
  });
}

// ── Evaluate a program ──────────────────────────────────────────────────────
$("evaluate").onclick = async () => {
  const output = $("evaluateOutput");
  output.textContent = "Evaluating…";
  try {
    const program = $<HTMLTextAreaElement>("program").value;
    const result = (await client().vadalog.evaluate(program)) as Evaluation;
    output.replaceChildren(...Object.keys(result.resultSet).map((p) => table(p, rowsOf(result, p))));
  } catch (error) {
    output.textContent = String(error);
  }
};

// ── Upload a file from <input type="file">, then download it back ──────────
$("upload").onclick = async () => {
  const output = $("fileOutput");
  const file = $<HTMLInputElement>("file").files?.[0];
  if (!file) return void (output.textContent = "Pick a file first.");
  try {
    const px = client();
    // A File from an <input> uploads as is; fileFromPath() is for Node.js.
    const { filePath } = await px.files.upload(file, { path: "" });
    output.textContent = `Uploaded to ${filePath}. `;

    // Downloads come back as a Blob; saveTo() is for Node.js.
    const blob = await (await px.files.download(filePath)).blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    link.textContent = `Download it back (${blob.size} bytes)`;
    output.append(link);
  } catch (error) {
    output.textContent = String(error);
  }
};

function table(predicate: string, rows: Record<string, unknown>[]): HTMLElement {
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  heading.textContent = `${predicate} (${rows.length} rows)`;
  const grid = document.createElement("table");
  const columns = Object.keys(rows[0] ?? {});
  grid.createTHead().insertRow().append(...columns.map((c) => cell("th", c)));
  const body = grid.createTBody();
  for (const row of rows) body.insertRow().append(...columns.map((c) => cell("td", row[c])));
  section.append(heading, grid);
  return section;
}

function cell(tag: "th" | "td", value: unknown): HTMLElement {
  const node = document.createElement(tag);
  node.textContent = typeof value === "string" ? value : JSON.stringify(value);
  return node;
}
