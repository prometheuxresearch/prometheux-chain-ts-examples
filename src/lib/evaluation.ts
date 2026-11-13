/**
 * What `px.vadalog.evaluate()` resolves to. The SDK types it as `unknown`
 * because the engine owns the shape; every map is keyed by `@output` predicate.
 */
export interface Evaluation {
  resultSet: Record<string, unknown[][]>;
  columnNames: Record<string, string[]>;
  types: Record<string, string[]>;
  elapsedTime: number;
  violations: unknown[];
}

/** Rows of one output predicate as objects keyed by column name. */
export function rowsOf(evaluation: Evaluation, predicate: string): Record<string, unknown>[] {
  const columns = evaluation.columnNames[predicate] ?? [];
  const rows = evaluation.resultSet[predicate] ?? [];
  return rows.map((row) => Object.fromEntries(columns.map((column, i) => [column, row[i]])));
}

