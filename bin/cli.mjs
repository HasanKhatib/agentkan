#!/usr/bin/env node
import { validateBoard } from "../lib/validate.mjs";
import { init } from "../lib/init.mjs";
import { epicNew } from "../lib/epicNew.mjs";
import { serve } from "../lib/serve.mjs";
import { c } from "../lib/util.mjs";

// Minimal arg parser: positionals + --flag value / --flag=value / --bool.
function parse(argv) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v !== undefined) opts[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) opts[k] = argv[++i];
      else opts[k] = true;
    } else pos.push(a);
  }
  return { pos, opts };
}

const HELP = `${c.bold("agentkan")} — local-first epic/task roadmap board

${c.bold("Usage")}
  agentkan init [dir]            Scaffold a board (default docs/board)
  agentkan epic new "<title>"    Add an epic stub + markdown body
  agentkan serve [dir]           Serve the board on localhost (read-write)
  agentkan validate [dir]        Validate roadmap.json / archive.json
  agentkan help

${c.bold("epic new options")}
  --phase P2        target phase (default: active phase, else last)
  --release v1      stamp release id on new epic (inherits phase.release if omitted)
  --id E2.7         force an id
  --assignee ai     ai | me | ai+verify   (default ai)
  --labels a,b      comma-separated
  --emoji 🎨        card emoji
  --planned 2026-07-01

${c.bold("serve options")}
  --port 4173       --no-open

${c.dim("Aliases: `ak`. Data is plain JSON + markdown in the board dir; edit by hand or via the viewer.")}`;

const { pos, opts } = parse(process.argv.slice(2));
const [cmd, sub, ...rest] = pos;

try {
  switch (cmd) {
    case "init":
      await init({ dir: sub || "docs/board", project: opts.project, force: !!opts.force });
      break;
    case "epic":
      if (sub !== "new") throw new Error(`Unknown: epic ${sub || ""}. Try: agentkan epic new "Title"`);
      if (!rest[0]) throw new Error(`Title required: agentkan epic new "My epic"`);
      await epicNew(rest.join(" "), opts);
      break;
    case "serve":
      await serve({ dir: sub || "docs/board", port: opts.port ? Number(opts.port) : 4173, open: opts.open !== false && !opts["no-open"] });
      break;
    case "validate": {
      const dir = sub || "docs/board";
      const { ok, errors } = await validateBoard(dir);
      if (ok) { console.log(c.green(`✓ ${dir} is valid`)); process.exit(0); }
      console.error(c.red(`✗ ${errors.length} problem(s) in ${dir}:`));
      for (const e of errors) console.error("  " + c.red("•") + " " + e);
      process.exit(1);
    }
    case "help":
    case undefined:
    case "--help":
    case "-h":
      console.log(HELP);
      break;
    default:
      console.error(c.red(`Unknown command: ${cmd}`));
      console.log(HELP);
      process.exit(1);
  }
} catch (e) {
  console.error(c.red("Error: ") + e.message);
  process.exit(1);
}
