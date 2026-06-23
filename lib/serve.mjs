import { createServer } from "node:http";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { c } from "./util.mjs";

// Files the viewer is allowed to write back, beyond per-epic markdown bodies.
const WRITABLE_FILES = new Set(["roadmap.json", "archive.json", "next.json", "board.tokens.json"]);
const EPIC_ID_RE = /^E[\w.]+$/;
const MAX_BODY = 5 * 1024 * 1024; // generous ceiling for a board file

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (ch) => {
      size += ch.length;
      if (size > MAX_BODY) { reject(new Error("payload too large")); req.destroy(); return; }
      chunks.push(ch);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Resolve a write request to an absolute path inside `root`, or null if not allowed.
function writeTarget(root, rel) {
  let target = null;
  const file = rel.replace(/^\/api\/file\//, "");
  const epic = rel.replace(/^\/api\/epic\//, "");
  if (rel.startsWith("/api/file/") && WRITABLE_FILES.has(file)) {
    target = path.join(root, file);
  } else if (rel.startsWith("/api/epic/") && EPIC_ID_RE.test(epic)) {
    target = path.join(root, "epics", `${epic}.md`);
  }
  if (!target) return null;
  const resolved = path.resolve(target);
  return resolved.startsWith(root + path.sep) ? resolved : null;
}

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

// Static file server rooted at the board directory, plus a small write API
// (PUT /api/...) so the viewer saves back to disk with no folder dialog.
export async function serve({ dir = "docs/board", port = 4173, open = true } = {}) {
  const root = path.resolve(process.cwd(), dir);
  await stat(path.join(root, "index.html")).catch(() => {
    throw new Error(`No index.html in ${dir}. Run \`agentkan init\` first.`);
  });

  const server = createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);

      // Write API: PUT /api/file/<name> or /api/epic/<id>. Served boards are read-write.
      if (rel.startsWith("/api/")) {
        if (req.method !== "PUT") { res.writeHead(405).end("Method not allowed"); return; }
        const target = writeTarget(root, rel);
        if (!target) { res.writeHead(400).end("Not a writable path"); return; }
        const body = await readBody(req);
        await writeFile(target, body);
        res.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
        return;
      }

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
