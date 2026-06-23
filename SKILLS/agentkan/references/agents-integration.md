# Agents integration

Wire agentkan into the **consumer project's** agent instructions. Do not copy the agentkan **tool repo** AGENTS.md (that file is for developing the npm package).

## What goes where

| File | Purpose |
|------|---------|
| Project `AGENTS.md` | Stable rules: board path, session start/end, pointer to this skill |
| `CLAUDE.md` | Often one line: `@AGENTS.md` |
| Cursor rules / skills | Install `SKILLS/agentkan` under `.cursor/skills/agentkan` |
| This skill | Workflows for onboard, migrate, edit board, handoff |

## AGENTS.md merge

1. Read the project's existing AGENTS.md (or CLAUDE.md) first.
2. Merge [assets/AGENTS.snippet.md](../assets/AGENTS.snippet.md) — do not delete unrelated sections.
3. Replace placeholders:
   - `{{BOARD_DIR}}` — default `docs/board`
   - `{{PROJECT_NAME}}` — from package.json or repo name
4. Keep project-specific sections (stack, tests, communication style) unchanged.

## CLAUDE.md

Minimal option ([assets/CLAUDE.snippet.md](../assets/CLAUDE.snippet.md)):

```markdown
@AGENTS.md
```

Or paste the Roadmap section from AGENTS.snippet.md if the project has no AGENTS.md yet.

## Cursor

1. Copy skill: `cp -r SKILLS/agentkan .cursor/skills/agentkan` (from package or clone)
2. Optional rule in `.cursor/rules/`: "When editing files under docs/board/ or when the user mentions epics, tasks, or handoff, follow the agentkan skill."

## Custom board path

If the board is not `docs/board/`, set `{{BOARD_DIR}}` in AGENTS.md and pass the path to all commands:

```bash
npx agentkan validate path/to/board
npx agentkan serve path/to/board
```

## After integration

Confirm with the user:

- Board directory path is documented
- Session start reads `next.json` + active epics
- Session end runs handoff (see [handoff.md](handoff.md))
- Skill is installed where their agent discovers it
