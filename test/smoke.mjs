// Smoke test: init -> validate -> epic new -> validate, in a temp dir.
// No deps; run with `node test/smoke.mjs` (or `npm test`).
import { mkdtemp, rm, readFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(ROOT, "bin", "cli.mjs");
let failures = 0;
const ok = (cond, msg) => { if (cond) console.log("  ok  " + msg); else { failures++; console.error("  FAIL " + msg); } };
const run = (args, cwd) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: "utf8" });

const tmp = await mkdtemp(path.join(tmpdir(), "agentkan-"));
try {
  console.log("smoke: scaffold + validate + epic new");

  // 1. init
  let r = run(["init"], tmp);
  ok(r.status === 0, "init exits 0");
  const board = path.join(tmp, "docs", "board");
  for (const f of ["roadmap.json", "archive.json", "next.json", "board.tokens.json", "index.html", "favicon.svg", "roadmap.schema.json"]) {
    ok(await access(path.join(board, f)).then(() => true).catch(() => false), "init wrote " + f);
  }

  // 2. validate fresh board
  r = run(["validate"], tmp);
  ok(r.status === 0, "validate passes on fresh board");

  // 3. epic new
  r = run(["epic", "new", "Payments integration", "--assignee", "ai+verify", "--labels", "feature,chore"], tmp);
  ok(r.status === 0, "epic new exits 0");
  const roadmap = JSON.parse(await readFile(path.join(board, "roadmap.json"), "utf8"));
  const ids = roadmap.phases.flatMap((p) => p.epics.map((e) => e.id));
  ok(ids.includes("E1.2"), "epic new added E1.2 (next id in phase)");
  ok(await access(path.join(board, "epics", "E1.2.md")).then(() => true).catch(() => false), "epic new wrote epics/E1.2.md");

  // 4. validate again
  r = run(["validate"], tmp);
  ok(r.status === 0, "validate still passes after epic new");

  // 5. validate catches a bad status
  const bad = JSON.parse(await readFile(path.join(board, "roadmap.json"), "utf8"));
  bad.phases[0].epics[0].status = "nope";
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(board, "roadmap.json"), JSON.stringify(bad));
  r = run(["validate"], tmp);
  ok(r.status === 1, "validate fails on an invalid status");

  // 6. example board validates
  r = run(["validate", "examples/sample-board"], ROOT);
  ok(r.status === 0, "bundled example board validates");
} finally {
  await rm(tmp, { recursive: true, force: true });
}

console.log(failures === 0 ? "\nPASS" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
