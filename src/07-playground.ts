// A local Vadalog playground: write a program in the browser, evaluate it on the
// platform, and see the results next to it. Your token stays in this process;
// the page only talks to this server, which listens on 127.0.0.1 only.
import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Prometheux } from "@pmtx/chain";

const px = new Prometheux();
const port = Number(process.env.PORT ?? 3000);
const origin = `http://localhost:${port}`;

// Every program in programs/, offered in the page's "Load example" menu.
const examples: Record<string, string> = {};
for (const file of (await readdir("programs")).filter((name) => name.endsWith(".vada"))) {
  examples[file] = await readFile(`programs/${file}`, "utf8");
}
const page = (await readFile(new URL("playground.html", import.meta.url), "utf8")).replace(
  "/*EXAMPLES*/{}",
  JSON.stringify(examples).replaceAll("<", "\\u003c"),
);

createServer(async (req, res) => {
  // Only this page may call the server: reject other hosts (DNS rebinding) and
  // cross-site requests from pages you happen to have open.
  const host = req.headers.host ?? "";
  if (host !== `localhost:${port}` && host !== `127.0.0.1:${port}`) return send(res, 403, "Forbidden");

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(page);
  }
  if (req.method === "POST" && req.url === "/evaluate") {
    const sameSite = req.headers.origin === `http://${host}`;
    const json = req.headers["content-type"] === "application/json";
    if (!sameSite || !json) return send(res, 403, "Forbidden");
    return evaluate(req, res);
  }
  send(res, 404, "Not found");
}).listen(port, "127.0.0.1", () => {
  console.log(`Vadalog playground at ${origin} (Ctrl+C to quit)`);
  openBrowser(origin);
});

async function evaluate(req: IncomingMessage, res: ServerResponse) {
  let program: string;
  try {
    ({ program } = JSON.parse(await readBody(req)) as { program: string });
  } catch {
    return send(res, 400, "Expected a JSON body: { program }");
  }
  // Closing the tab or pressing Stop aborts the request, and the SDK stops the
  // evaluation on the engine.
  const controller = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) controller.abort();
  });
  try {
    const result = await px.vadalog.evaluate(program, {}, { signal: controller.signal });
    send(res, 200, JSON.stringify({ result }), "application/json");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    send(res, 200, JSON.stringify({ error: message }), "application/json");
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: string, type = "text/plain") {
  if (res.writableEnded || res.destroyed) return;
  res.writeHead(status, { "Content-Type": `${type}; charset=utf-8` });
  res.end(body);
}

function openBrowser(url: string) {
  const [command, args] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];
  spawn(command, args, { stdio: "ignore", detached: true })
    .on("error", () => {})
    .unref();
}
