# The skill & AI workflow

Day-to-day usage (epic stubs, tasks, phases, releases, labels): [how it works](how-it-works.md).

agentkan ships an [Agent Skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) for **consumer projects**: onboard a board, migrate scattered tasks, edit epics safely, and run session handoffs. The skill teaches conventions the CLI cannot enforce: propose vs dispose, safe JSON edits, and routing to the right workflow.

## Skill layout

Follows Anthropic's filesystem-based skill structure (metadata in frontmatter, instructions in `SKILL.md`, references loaded on demand):

```
SKILLS/agentkan/
  SKILL.md                    # Workflow, boundaries, routing
  references/
    onboarding.md             # New project, no board yet
    migration.md              # From roadmap.md, todos, issues
    agents-integration.md     # AGENTS.md / CLAUDE.md / Cursor
    handoff.md                # End-of-session
    data-model.md             # Field shapes
  assets/
    AGENTS.snippet.md         # Merge into consumer AGENTS.md
    CLAUDE.snippet.md
    next.template.json
    session.template.md       # Optional docs/sessions/ log
  scripts/
    validate-board.sh         # npx agentkan validate wrapper
    status.sh                 # git + next.json snapshot before handoff
```

**Tool repo vs consumer repo:** This repository's `AGENTS.md` is for **developing** agentkan. Projects that use agentkan merge `assets/AGENTS.snippet.md` into their own `AGENTS.md`.

## Install

**Claude Code** — copy the skill folder:

```bash
cp -r SKILLS/agentkan ~/.claude/skills/agentkan
# or project-local:
mkdir -p .claude/skills && cp -r SKILLS/agentkan .claude/skills/agentkan
```

From npm after `npm install -D agentkan`:

```bash
cp -r node_modules/agentkan/SKILLS/agentkan .claude/skills/agentkan
```

**Cursor** — project or personal skills directory:

```bash
mkdir -p .cursor/skills && cp -r SKILLS/agentkan .cursor/skills/agentkan
```

**claude.ai** — zip and upload in Settings → Features:

```bash
./scripts/pack-skill.sh   # writes agentkan.skill
```

**Any agent** — install the skill, or merge `assets/AGENTS.snippet.md` into project instructions and point at `SKILLS/agentkan/SKILL.md`.

## What the skill teaches

### Routing

| Situation | Reference |
|-----------|-----------|
| No board yet | onboarding |
| Scattered tasks / old roadmap | migration |
| Wire AGENTS.md or CLAUDE.md | agents-integration |
| End of session | handoff |
| JSON fields | data-model |

### AI proposes, the human disposes

- The agent **may** add epics/tasks (as `backlog`), advance its own work (`backlog → next → active`), set tasks `todo → doing → done`, mark `blocked`, and fill `goal`, `exit`, `labels`, `planned`, and bodies.
- The agent **must not** mark an epic `done`, archive, delete, or reorder the board wholesale unless you ask in that turn. Closing and archiving are yours, done by dragging the card in the viewer.

### Epic display order

The viewer sorts epics by **id** within each column and timeline lane (`E1.1` before `E1.10`). Priority is status columns and `next.json`, not the optional legacy `order` field in JSON.

### Interview flow

When you say "add an epic" or "fill epic E1.2", the agent:

1. Scaffolds the stub if needed: `npx agentkan epic new "<title>" ...`
2. Asks only what it can't infer (goal, exit, tasks, assignee, planned).
3. Writes the answers into both the JSON entry and `epics/<ID>.md`.
4. Runs `npx agentkan validate` and shows you the new card.

### Handoff

Say "handoff" at session end. The agent runs a git snapshot (`scripts/status.sh`), sets statuses to reality, refreshes `next.json`, validates, summarizes briefly, and optionally writes a session log to `docs/sessions/`.

Full instructions: [SKILLS/agentkan/SKILL.md](../SKILLS/agentkan/SKILL.md).
