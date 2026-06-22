# The skill & AI workflow

`skill/SKILL.md` is a Claude skill (also usable as plain context for any agent).
It encodes the conventions the CLI can't enforce, so an agent edits your board
the way you'd want.

## Install

- **Claude Code / Cowork:** drop the `skill/` folder into your skills directory,
  or run `./scripts/pack-skill.sh` to build `agentkan.skill` and install it.
- **Any agent:** paste `SKILL.md` into the project's agent instructions
  (e.g. `AGENTS.md` / `CLAUDE.md`), or keep `docs/board/` and let the agent read
  the schema and this file.

## The one rule it teaches: AI proposes, the human disposes

- The agent **may** add epics/tasks (as `backlog`), advance its own work
  (`backlog → next → active`), set tasks `todo → doing → done`, mark `blocked`,
  and fill `goal`, `exit`, `labels`, `planned`, and bodies.
- The agent **must not** mark an epic `done`, archive, delete, or reorder the
  board wholesale unless you ask in that turn. Closing and archiving are yours,
  done by dragging the card.

So when an agent finishes building, it moves the epic to `active`, sets its tasks
`done`, and tells you it's ready to verify — it doesn't close it for you.

## The interview flow

When you say "add an epic" or "fill epic E1.2", the agent:

1. Scaffolds the stub if needed: `npx agentkan epic new "<title>" ...`
2. Asks only what it can't infer, in one batch:
   - what does *done* look like in a sentence? → `goal`
   - what observable check proves it? → `exit`
   - rough steps? → `tasks`
   - who does it (ai / me / ai+verify)? → `assignee`
   - any date? → `planned`
3. Writes the answers into both the JSON entry and `epics/<ID>.md`.
4. Runs `agentkan validate` and shows you the new card.

If you'd rather brain-dump than answer questions, the agent extracts the fields
itself and confirms.

## Handoff

Ask for a "handoff" at the end of a session and the agent sets statuses to
reality, refreshes `next.json` (next action, critical path, blockers, fragile),
validates, and summarizes what changed in a couple of sentences.

## Safe editing

The agent always reads the whole JSON file, mutates the object, and writes it
back with 2-space indent — never regex-patches — keeps IDs stable, keeps
`goal`/`exit` to one line, only uses labels defined in `board.tokens.json`, and
validates before handing back.
