import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { c } from "./util.mjs";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
};

function openBrowser(url) {
  const cmd = process.platform === "darwin" ? "open"
    : process.platform === "win32" ? "start" : "xdg-open";
  try { spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref(); }
  catch { /* ignore */ }
}

// Static file server rooted at the board directory. localhost guarantees the
// File System Access API (read-write) works in Chrome/Edge.
export async function serve({ dir = "docs/board", port = 4173, open = true } = {}) {
  const root = path.resolve(process.cwd(), dir);
  await stat(path.join(root, "index.html")).catch(() => {
    throw new Error(`No index.html in ${dir}. Run \`agentkan init\` first.`);
  });

  const server = createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (rel === "/") rel = "/index.html";
      const file = path.join(root, path.normalize(rel));
      if (!file.startsWith(root)) { res.writeHead(403).end("Forbidden"); return; }
      const s = await stat(file).catch(() => null);
      if (!s || !s.isFile()) { res.writeHead(404).end("Not found"); return; }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      createReadStream(file).pipe(res);
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(c.bold("agentkan") + ` serving ${c.dim(dir)}`);
    console.log(`  ${c.green(url)}`);
    console.log(c.dim("  Ctrl-C to stop"));
    if (open) openBrowser(url);
  });
}
