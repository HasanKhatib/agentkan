---
name: agentkan
description: >
  Plan and track work on an agentkan board (a local roadmap of epics and tasks
  stored as JSON + markdown). Use whenever the user wants to add, refine, move,
  prioritize, or complete epics/tasks, fill an epic from a few questions, or run
  a session handoff. Triggers: "add an epic", "new epic", "fill epic", "what's
  next", "mark T3 done", "move E1.26 to active", "update the roadmap",
  "plan this work", "handoff", or any edit to docs/board/roadmap.json.
---

# agentkan — working with the board

agentkan keeps a project's roadmap as plain files in a board directory (default
`docs/board/`):

- `roadmap.json` — the live board: phases → epics → tasks. Source of truth for **state**.
- `archive.json` — finished/archived epics. Off the live board, still viewable.
- `next.json` — the thin pointer: the single next action, critical path, blockers.
- `board.tokens.json` — theme + emoji vocabulary (assignees, statuses, labels).
- `epics/<ID>.md` — long-form body for an epic. Source of truth for **how**.
- `index.html` — the read-write viewer (the human drives this).

Read `data-model.md` in this skill folder for the exact field shapes. In a
consumer project the JSON Schema is `roadmap.schema.json` in the board directory.

## The one rule: AI proposes, the human disposes

This is the core convention that keeps the human in control of their own board.

- The AI **may**: add epics and tasks (as `backlog`), advance work it is doing
  (`backlog → next → active`), set a task `todo → doing → done`, flag `blocked`,
  and fill in `goal`, `exit`, `labels`, `planned`, and epic bodies.
- The AI **must not**: mark an *epic* `done`, archive an epic, delete epics or
  tasks, or reorder the board wholesale — unless the user explicitly asks in
  this turn. Promotion to "done" and archiving are the human's calls; they
  happen in the viewer by dragging the card.

When you finish building something, move its epic to `active` (or leave it where
the user put it) and set its tasks to `done`. Then tell the user it's ready for
them to verify and mark the epic done. Do not self-congratulate by closing it.

## Editing the JSON safely

1. Read the whole file, modify the object, write it back with 2-space indent and
   a trailing newline. Never hand-edit with regex.
2. Keep IDs stable. Epic IDs look like `E<phase>.<n>` (e.g. `E1.26`); task IDs are
   `<EPIC>-T<n>` (e.g. `E1.26-T3`). New epic number = max in that phase + 1.
3. `goal` and `exit` are single lines. `goal` = what done looks like; `exit` =
   one AI-verifiable observable behavior. If the epic has a markdown body, the
   body's Goal/Exit expand on these and must not contradict them.
4. Only use labels that exist in `board.tokens.json` (otherwise the card renders
   without an emoji). If a new label is genuinely needed, add it there too.
5. After any edit, run `npx agentkan validate <dir>` (or `node bin/cli.mjs
   validate`) and fix anything it reports before handing back.

## Creating an epic (the interview flow)

When the user says "add an epic" / "new epic" / "fill epic X":

1. Scaffold the stub if it doesn't exist:
   `npx agentkan epic new "<title>" --assignee <ai|me|ai+verify> --labels a,b`
   This appends a `backlog` epic to the active phase and creates `epics/<ID>.md`.
2. **Interview the user** — ask only what you can't infer, ideally in one batch:
   - What does *done* look like in one sentence? (→ `goal`)
   - What observable check proves it's done? (→ `exit`)
   - Roughly what are the steps? (→ `tasks`)
   - Who does it — AI, you, or AI-then-you-verify? (→ `assignee`)
   - Any target date? (→ `planned`)
3. Write the answers into both places: the epic's fields + tasks in
   `roadmap.json`, and the matching sections in `epics/<ID>.md`.
4. Validate, then show the user the new card and ask if the goal/exit are right.

If the user gives you a rough brain-dump instead of answering questions, extract
the goal/exit/tasks yourself and confirm rather than interrogating them.

## Handoff (end of session)

When asked to "handoff" or wrap up:

1. Set statuses to reality (tasks `done`, epics `active`/`blocked` as true).
2. Update `next.json`: `next` = the single most important next action, refresh
   `criticalPath`, `revenueBlockers`, `fragile`.
3. `updated` dates get bumped automatically on save by the viewer, but if you
   wrote files directly, set `roadmap.updated`/`next.updated` to today.
4. Run validate. Summarize what changed in two or three sentences.

## Quick command reference

```
npx agentkan init [dir]                 scaffold a board
npx agentkan epic new "<title>" [opts]  add epic stub + body
npx agentkan serve [dir]                open the read-write board on localhost
npx agentkan validate [dir]             check the board against the schema
```
