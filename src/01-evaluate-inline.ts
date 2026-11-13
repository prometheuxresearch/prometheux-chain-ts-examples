// Evaluate a Vadalog program written inline. Nothing is saved to the platform.
import { Prometheux } from "@pmtx/chain";
import { type Evaluation, rowsOf } from "./lib/evaluation.ts";

// Reads PMTX_TOKEN and JARVISPY_URL from the environment.
const px = new Prometheux();

const program = `
  edge("Rome", "Milan").
  edge("Milan", "Zurich").
  edge("Zurich", "Paris").

  reachable(X, Y) <- edge(X, Y).
  reachable(X, Z) <- reachable(X, Y), edge(Y, Z).

  @output("reachable").
`;

const result = (await px.vadalog.evaluate(program)) as Evaluation;

console.table(rowsOf(result, "reachable"));
