# Prometheux TypeScript SDK examples

Runnable examples for [`@pmtx/chain`](https://www.npmjs.com/package/@pmtx/chain), the TypeScript
SDK for [Prometheux](https://www.prometheux.ai). They focus on evaluating your own Vadalog files
against the platform: no ontology or saved concept needed.

Full guide: [docs.prometheux.ai/integrations/typescript-sdk](https://docs.prometheux.ai/integrations/typescript-sdk)

## Setup

Requires Node.js 22.9 or newer (the scripts load `.env` with `--env-file-if-exists`) and a
Prometheux account.

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
| `npm run playground` | `src/07-playground.ts`               | Write and evaluate programs in a local web page               |
| `npm run browser`    | `browser/app.ts`                     | Use the SDK directly in a browser page                        |
| `npm test`           | `test/company-control.test.ts`       | Unit-test a Vadalog program with `node:test`                  |

`npm run playground` opens http://localhost:3000: write a program on the left, press Evaluate (or
⌘/Ctrl + Enter), and see each `@output` as a table on the right. Your token stays in the local
server, which only accepts requests from that page. Set `PORT` to use another port.

`npm run browser` serves http://localhost:5173, a page that calls the platform straight from the
browser: it evaluates a program, uploads a file picked with `<input type="file">`, and downloads it
back as a `Blob`. The backend URL comes from `.env`; paste your token into the page, which keeps it
in memory only. Use the SDK this way for local or internal tools: in a public site, keep the token on
a server.

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

MIT No Attribution (MIT-0): copy and adapt any of this code without attribution. See
[LICENSE](LICENSE).
