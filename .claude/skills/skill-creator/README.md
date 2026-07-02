# skill-creator

Agent Skill for creating and validating other Agent Skills, following [Anthropic's Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) and [authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## What it does

Guides an agent through a six-step workflow:

1. **Discover** — purpose, triggers, storage location, constraints
2. **Design** — name, description, structure, freedom level
3. **Draft** — `SKILL.md` plus optional `references/` and `scripts/`
4. **Validate** — run structural checks
5. **Review** — conciseness pass and user approval
6. **Write** — create files in the target location

## Install

Copy or symlink into your skills directory:

| Surface | Path |
|---------|------|
| This repo | `skills/skill-creator/` |
| Claude Code (project) | `.claude/skills/skill-creator/` |
| Claude Code (personal) | `~/.claude/skills/skill-creator/` |
| Cursor (project) | `.cursor/skills/skill-creator/` |
| Cursor (personal) | `~/.cursor/skills/skill-creator/` |

## Usage

Ask your agent to create or improve a skill:

- "Create a skill for writing commit messages"
- "Help me author a SKILL.md for PDF processing"
- "Review this skill against best practices"

The agent loads `SKILL.md` when the task matches the skill description.

## Validate a skill

```bash
bash skills/skill-creator/scripts/validate.sh path/to/skill-name
```

Checks frontmatter (`name`, `description`), line count, path style, and script presence. Exits `1` on errors.

## Contents

```
skill-creator/
├── SKILL.md                      # Main workflow
├── references/
│   ├── structure.md              # Layout, frontmatter, loading levels
│   ├── description-guide.md      # Naming and description formula
│   ├── patterns.md               # Workflow, template, feedback patterns
│   └── checklist.md              # Pre-ship checklist
└── scripts/
    └── validate.sh               # Structural validation
```

## Key rules enforced

- `name`: lowercase, hyphens, max 64 chars; no reserved words (`anthropic`, `claude`)
- `description`: third person, max 1024 chars; includes what it does and when to use it
- `SKILL.md`: under 500 lines; procedural content only
- References: one level deep from `SKILL.md`
- Scripts: execute for deterministic ops; errors handled explicitly
