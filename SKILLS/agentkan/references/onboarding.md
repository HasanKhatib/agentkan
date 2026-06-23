# Onboarding

For projects that do not have an agentkan board yet.

## What agentkan is (30 seconds)

agentkan is a **local roadmap board** for working with AI agents. Instead of an ever-growing `roadmap.md` or scattered todos, you get:

- `roadmap.json` — phases, epics, tasks, columns (structured, movable)
- `next.json` — one next action, human critical path, risks
- `epics/<ID>.md` — prose context agents need
- `index.html` — drag-and-drop viewer the **human** operates

Install the CLI once: `npx agentkan` (no global install required).

## Scaffold the board

From the project root:

```bash
npx agentkan init
```

Creates `docs/board/` by default (or pass another path: `npx agentkan init path/to/board`).

Files created:

```
docs/board/
  roadmap.json
  archive.json
  next.json
  board.tokens.json
  index.html
  roadmap.schema.json
  epics/
```

## Open the board

```bash
npx agentkan serve
```

Opens localhost. The human drags cards, toggles tasks, and archives done work. The agent edits JSON and markdown.

## Install this skill

**Claude Code** (project):

```bash
mkdir -p .claude/skills
cp -r /path/to/agentkan/SKILLS/agentkan .claude/skills/agentkan
```

Or from npm package after `npm install -D agentkan`: copy `node_modules/agentkan/SKILLS/agentkan`.

**Cursor:** copy to `.cursor/skills/agentkan` (project) or `~/.cursor/skills/agentkan` (personal).

## Wire the project for agents

Merge [agents-integration.md](agents-integration.md) and [assets/AGENTS.snippet.md](../assets/AGENTS.snippet.md) into the project's AGENTS.md or CLAUDE.md.

## Next steps

- Migrating existing tasks? → [migration.md](migration.md)
- Adding work? → epic flow in SKILL.md
- Field reference → [data-model.md](data-model.md)
