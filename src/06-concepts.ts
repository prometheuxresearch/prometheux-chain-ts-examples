// Save a program as a concept in an ontology, run it, and page through the
// stored results. Unlike px.vadalog.evaluate(), concepts persist: they show up in
// the platform UI, take part in lineage, and other concepts can build on them.
import { readFile } from "node:fs/promises";
import { Prometheux } from "@pmtx/chain";

const px = new Prometheux();

const ontologyId = await px.ontologies.save({
  name: "sdk-example-company-control",
  description: "Created by prometheux-chain-ts-examples",
});
console.log(`Created ontology ${ontologyId}`);

try {
  await px.concepts.save(ontologyId, {
    definition: await readFile("programs/company-control.vada", "utf8"),
  });

  const run = await px.concepts.run(ontologyId, "control");
  console.log(`Run populated ${run.predicates_populated.join(", ")}: ${run.total_records} rows`);

  const page = await px.concepts.fetchResults(ontologyId, "control", { pageSize: 5 });
  console.log(page.results.columnNames);
  for (const fact of page.results.facts) console.log(fact);
  console.log(`page ${page.pagination.page} of ${page.pagination.total_pages}`);
} finally {
  // Keep the ontology instead if you want to open it in the platform UI.
  await px.ontologies.delete(ontologyId);
  console.log(`Deleted ontology ${ontologyId}`);
}
