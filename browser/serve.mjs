// Serves the browser example on http://localhost:5173, bundling browser/app.ts
// on each request. Only JARVISPY_URL from .env goes into the page.
import { spawn } from "node:child_process";
import { context } from "esbuild";

const ctx = await context({
  entryPoints: { app: "browser/app.ts" },
  bundle: true,
  format: "esm",
  platform: "browser",
  outdir: "browser/dist",
  define: { DEFAULT_BASE_URL: JSON.stringify(process.env.JARVISPY_URL ?? "") },
});
const { port } = await ctx.serve({ servedir: "browser", host: "127.0.0.1", port: Number(process.env.PORT ?? 5173) });

const url = `http://localhost:${port}`;
console.log(`Browser example at ${url} (Ctrl+C to quit)`);
const [command, args] =
  process.platform === "darwin"
    ? ["open", [url]]
    : process.platform === "win32"
      ? ["cmd", ["/c", "start", "", url]]
      : ["xdg-open", [url]];
spawn(command, args, { stdio: "ignore", detached: true }).on("error", () => {}).unref();
