# agentkan

A local-first roadmap board for building with AI agents. Epics and tasks live as plain JSON and markdown in your repo; a single `index.html` renders them as a drag-and-drop board you can edit on localhost. No server, no build step, no account, no lock-in.

It fixes one friction: when an AI keeps appending to a markdown to-do file, the file grows without bound and you lose track of what is actually yours to do. agentkan splits **state** (structured, movable) from **prose** (context for agents) and puts you in control of what is done.

```bash
npx agentkan init
npx agentkan serve
npx agentkan epic new "Billing integration"
npx agentkan validate
```

Pin locally with `npm install -D agentkan`.

## How it works

Your agent shapes work, the CLI stubs epics, and the board is where you operate (drag, toggle tasks, archive). See [how it works](docs/how-it-works.md) for the mental model, daily loop, and step-by-step scenarios.

## Docs

- [Getting started](docs/getting-started.md) — Install, scaffold `docs/board/`, open the viewer, and wire `validate` into your workflow.
- [How it works](docs/how-it-works.md) — Day-to-day usage: three surfaces (agent, CLI, board), scenarios, and what is configurable.
- [Data model](docs/data-model.md) — Field reference for `roadmap.json`, epics, tasks, `next.json`, and `board.tokens.json`. Use when editing JSON or reviewing agent changes.
- [Viewer](docs/viewer.md) — What the board UI does: drag-and-drop, in-board epic body editing, archiving, re-skinning via tokens, read-write when served.
- [Skill & AI workflow](docs/skill.md) — How to install the Agent Skill so Claude follows board conventions (propose vs dispose, interview, handoff).
- [Distribution & publishing](docs/distribution.md) — GitHub setup, npm publish, local `npm pack` testing, CI.
- [Origin & naming](docs/origin.md) — Why the package is called agentkan and early project decisions.

Contributors working on this repo: [AGENTS.md](AGENTS.md).

MIT licensed.
