# Prometheux TypeScript SDK examples

Runnable examples for [`@pmtx/chain`](https://www.npmjs.com/package/@pmtx/chain), the TypeScript
SDK for [Prometheux](https://www.prometheux.ai). They focus on evaluating your own Vadalog files
against the platform: no ontology or saved concept needed.

Full guide: [docs.prometheux.ai/integrations/typescript-sdk](https://docs.prometheux.ai/integrations/typescript-sdk)

## Setup

Requires Node.js 22 or newer and a Prometheux account.

```bash
git clone https://github.com/prometheuxresearch/prometheux-chain-ts-examples.git
cd prometheux-chain-ts-examples
npm install
cp .env.example .env   # then fill in PMTX_TOKEN and JARVISPY_URL
```

Evaluation runs on your compute, so start a machine in the platform before running the examples.

## Examples

| Command              | File                                 | What it shows                                                 |
| -------------------- | ------------------------------------ | ------------------------------------------------------------- |
| `npm run inline`     | `src/01-evaluate-inline.ts`          | Evaluate a program written inline                             |
| `npm run file`       | `src/02-evaluate-file.ts`            | Evaluate a `.vada` file from this repository                  |
| `npm run params`     | `src/03-evaluate-with-params.ts`     | Run one program with different `@param` values                |
| `npm run check`      | `src/04-check-programs.ts`           | Compile every program in `programs/` without running it (CI)  |
| `npm run your-data`  | `src/05-evaluate-with-your-data.ts`  | Upload a CSV and evaluate a program that reads it via `@bind` |
| `npm run concepts`   | `src/06-concepts.ts`                 | Save a program as a concept, run it, and page through results |
| `npm test`           | `test/company-control.test.ts`       | Unit-test a Vadalog program with `node:test`                  |

The Vadalog programs live in [`programs/`](programs). `company-control.vada` is the classic
company-control problem: a company controls another when it owns more than half of it, directly
or through companies it already controls.

## Layout

```
programs/   Vadalog programs (.vada) the examples evaluate
data/       Input data uploaded by the your-data example
src/        One runnable script per example
test/       Unit tests for the programs
```

## License

BSD 3-Clause. See [LICENSE](LICENSE).
