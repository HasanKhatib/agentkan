# Migration

Move scattered planning into an agentkan board **without deleting** old sources until the user cuts over.

## Workflow

```
- [ ] Step 1: Inventory existing planning artifacts
- [ ] Step 2: Init board if missing
- [ ] Step 3: Map themes to epics and bullets to tasks
- [ ] Step 4: Write next.json from what matters most now
- [ ] Step 5: Validate and suggest agentkan serve for human review
```

**Step 1: Inventory**

Look for (ask the user if unclear):

| Source | Examples |
|--------|----------|
| Markdown roadmaps | `roadmap.md`, `docs/roadmap.md`, `TODO.md`, `docs/next.md` |
| Agent instructions | task lists inside AGENTS.md, CLAUDE.md |
| Issue trackers | GitHub issues, Linear, Jira (export or summarize) |
| Inline | `TODO:` comments, README backlogs |
| Chat / notes | Brain-dumps the user pastes in this session |

Do **not** delete or overwrite these files. Migration adds `docs/board/` alongside them.

**Step 2: Init board**

```bash
npx agentkan init docs/board
```

Skip if `roadmap.json` already exists. Customize `board.tokens.json` theme if the project has design tokens.

**Step 3: Map to epics**

Rules of thumb:

- One **feature or theme** → one epic (`backlog` or `next` unless clearly active)
- Each actionable bullet → one task (`<EPIC>-T<n>`)
- Human-only work (accounts, legal, device tests) → `assignee: "me"`
- AI implementation → `assignee: "ai"` or `"ai+verify"` when human must verify
- Done items → task `status: "done"` or move finished epics to `archive.json` only if user confirms

Default structure for a first migration:

- Optional `releases[]` when the project thinks in shippable versions (`v1`, `v2`)
- One phase `P1` (`status: "active"`) with current work, optionally `"release": "v1"`
- Optional `P2+` (`status: "planned"`) for later themes
- Epic IDs: `E1.1`, `E1.2`, … in phase P1; `E2.1` in P2 (stable; not renamed per release)

Use CLI stubs when helpful:

```bash
npx agentkan epic new "Billing integration" --release v1 --assignee ai+verify --labels backend
```

Then fill goal, exit, tasks, and `epics/<ID>.md`.

**Step 4: Write next.json**

Use [assets/next.template.json](../assets/next.template.json) as a starting point.

- `next` — single task id, epic id, or short free text (the viewer resolves ids)
- `note` — one line of context
- `criticalPath` — human-only blockers (domain, credentials, approvals)
- `risks` — plain strings for fragile or blocking items

**Step 5: Validate and review**

```bash
npx agentkan validate docs/board
npx agentkan serve docs/board
```

Tell the user: old files are untouched; review the board; drag priorities; say when to archive the old roadmap.

## Example

**Before** (`roadmap.md`):

```markdown
## Now
- Finish auth handlers
- Buy domain (me)

## Later
- Onboarding wizard
- Analytics
```

**After** (`roadmap.json` excerpt):

- Epic `E1.1` Auth — tasks: handlers (doing), session middleware (todo)
- Epic `E1.2` Onboarding — backlog
- Epic `E1.3` Domain + deploy — blocked, assignee me

**After** (`next.json`):

```json
{
  "updated": "2026-06-22",
  "next": "E1.1-T2",
  "note": "Auth handlers first, then session middleware.",
  "criticalPath": [
    { "title": "Register domain", "assignee": "me", "status": "todo", "unblocks": "E1.3" }
  ],
  "risks": []
}
```

## Optional cutover epic

Add a backlog epic `E1.x` "Cut over from roadmap.md" with tasks to update AGENTS.md and retire the old file — only if the user wants a tracked cutover.
