# Getting started

## 1. Scaffold a board

From the root of any project:

```bash
npx agentkan init
```

This creates `docs/board/` with:

```
docs/board/
  roadmap.json        live board: phases -> epics -> tasks
  archive.json        finished/archived epics
  next.json           the single next action + critical path + blockers
  board.tokens.json   theme + emoji vocabulary (re-skin here)
  index.html          the viewer
  roadmap.schema.json the schema
  epics/              long-form epic bodies
```

Pick a different directory with `npx agentkan init path/to/dir`. Re-running
`init` never overwrites existing files unless you pass `--force`.

## 2. Open the board

```bash
npx agentkan serve
```

This serves `docs/board/` on `http://localhost:4173` and opens it. Serving on
localhost guarantees the read-write **File System Access API** works in Chrome
and Edge. Click **Enable editing** once to grant the folder; after that the
board reconnects automatically and every drag, edit, and archive saves straight
back to the JSON files.

You can also just open `index.html` from disk for a read-only view.

## 3. Add an epic

```bash
npx agentkan epic new "Billing integration" --assignee ai+verify --labels backend,api
```

This appends a `backlog` epic (next id in the active phase) and creates
`epics/<ID>.md` from a template. Then ask your AI to fill it — see
[the skill docs](skill.md). Options:

| flag | meaning |
|---|---|
| `--phase P2` | target a specific phase (default: the active one) |
| `--id E2.7` | force an id |
| `--assignee` | `ai` \| `me` \| `ai+verify` (default `ai`) |
| `--labels a,b` | comma-separated labels |
| `--emoji 🎨` | card emoji |
| `--planned 2026-07-01` | planned date |

## 4. Keep it honest

Wire validation into your existing task runner or CI so a malformed board fails
fast:

```bash
npx agentkan validate docs/board
```

That's the whole loop: AI adds and advances work, you watch the board and drag
cards to Done.
