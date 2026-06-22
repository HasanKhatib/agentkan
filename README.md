# agentkan

A local-first roadmap board for building with AI agents. Your epics and tasks
live as plain **JSON + markdown** in your repo; a single self-contained
**`index.html`** renders them as a drag-and-drop board you can edit directly —
no server, no build step, no account, no lock-in.

It exists to fix one specific friction: when an AI keeps appending to a markdown
to-do file, the file grows without bound and you lose track of what's actually
yours to do right now. agentkan splits **state** (structured, scannable,
movable) from **prose** (the context an agent needs), and puts you in control of
what's done.

```bash
npx agentkan init            # scaffold docs/board/ in any project
npx agentkan serve           # open the board on localhost (read-write)
npx agentkan epic new "Billing integration"   # add an epic, then let your AI fill it
npx agentkan validate        # schema gate for CI
```

## Why it's shaped this way

- **Hybrid, not pure JSON.** Each epic's one-line `goal` and `exit` live inline
  in `roadmap.json` so the board shows them; longer context lives in
  `epics/<ID>.md`. Pure JSON is token-heavy and a poor home for the prose an
  agent needs; pure markdown can't be moved around a board. This keeps both.
- **You own "done".** The AI proposes (adds to backlog, advances its own work);
  you dispose (drag a card to Done, archive it). That single split is what stops
  an agent from quietly burying your board in new items.
- **Nothing to maintain.** The viewer is one HTML file with zero dependencies.
  It reads your JSON over `file://`/localhost and writes back through the
  browser's File System Access API. There's no database and no framework to rot.
- **Git is the history.** Stable IDs and an explicit `order` integer keep diffs
  small and reviewable. Archiving is a status move, because git already remembers.

## The board

Five columns by epic status — 📥 Backlog, ⏭️ Next, 🔨 Active, 🔴 Blocked,
✅ Done — filterable by assignee (🤖 AI / 🧑 Me / 🤖✅ AI+verify) and by label.
Each card shows its emoji, id, title, assignee, labels, a relative planned-date
chip, and task progress. Click a card to edit fields, toggle tasks, or archive
it. A "Now" banner surfaces `next.json`: the single next action, the human-only
critical path, and anything fragile.

Read-only by default (handy behind `agentkan serve` or in any browser). Click
**Enable editing** once to grant the folder read-write; the board remembers it.

## Install for real

`npx agentkan ...` needs no install. To pin it as a dev dependency:

```bash
npm install -D agentkan
```

## The Claude skill

`skill/SKILL.md` teaches an AI agent the conventions the CLI can't enforce: the
*AI-proposes-human-disposes* rule, how to edit the JSON without corrupting it,
and an **interview flow** — you run `agentkan epic new`, the agent asks you a
few questions (goal, exit, tasks, assignee, date) and fills both the JSON entry
and the markdown body. Drop the folder into your agent's skills directory.

## Docs

- [Getting started](docs/getting-started.md)
- [The data model](docs/data-model.md)
- [The viewer](docs/viewer.md)
- [The skill & AI workflow](docs/skill.md)
- [Distribution & publishing](docs/distribution.md)
- [Origin & naming](docs/origin.md)

## Layout

```
bin/        the agentkan CLI
lib/        init, epic new, serve, validate
assets/     index.html (the viewer) + roadmap.schema.json
templates/  files copied on `init`
skill/      the Claude skill
examples/   sample board for git-clone dev only (not in the npm tarball);
            from a clone: agentkan serve examples/sample-board
docs/board/ this repo's dogfood board (ship tracker)
```

After `npx agentkan init`, your project gets `docs/board/` — no `roadmap.md`.

MIT licensed.
