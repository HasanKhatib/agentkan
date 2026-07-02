# Skill structure reference

## Directory layout

```text
skill-name/
├── SKILL.md              # Main instructions (loaded when triggered)
├── references/           # Detailed guides (loaded on demand)
│   ├── checklist.md
│   └── domain-guide.md
├── scripts/              # Utility scripts (executed, not loaded)
│   └── validate.sh
└── assets/               # Templates, CSS, static files (used by scripts)
```

## YAML frontmatter

Required fields in `SKILL.md`:

```yaml
---
name: skill-name
description: Third-person summary of capabilities and trigger scenarios.
---
```

### `name` rules

- Maximum 64 characters
- Lowercase letters, numbers, and hyphens only
- No XML tags
- No reserved words: `anthropic`, `claude`

### `description` rules

- Non-empty, maximum 1024 characters
- No XML tags
- Third person ("Processes…", not "I can help…")
- Include both WHAT and WHEN

## Three loading levels

| Level | When loaded | Content |
|-------|-------------|---------|
| 1 — Metadata | Always at startup | `name` and `description` from frontmatter (~100 tokens/skill) |
| 2 — Instructions | When skill triggers | SKILL.md body (keep under 500 lines) |
| 3 — Resources | As needed | `references/`, `scripts/`, `assets/` |

Scripts run via bash — only their output enters context, not the script source.

## Progressive disclosure

- SKILL.md = table of contents + essential workflow
- `references/` = domain detail, templates, examples, schemas
- `scripts/` = deterministic validation and transformation
- `assets/` = files scripts or instructions consume without loading into context

Keep every reference linked directly from SKILL.md. Do not chain references (SKILL → a.md → b.md).

## Storage by surface

| Surface | Custom skill location | Notes |
|---------|----------------------|-------|
| This repo | `skills/<name>/` | Shared skill library |
| Claude Code | `.claude/skills/` or `~/.claude/skills/` | Filesystem-based, no API upload |
| Cursor | `.cursor/skills/` or `~/.cursor/skills/` | Project or personal scope |
| Claude API | Upload via Skills API | Workspace-wide; no network in container |
| claude.ai | Settings → Features | Per-user upload as zip |

Skills do not sync across surfaces — deploy separately where needed.

## Runtime constraints (API / claude.ai)

When a skill targets the Claude API code-execution container:

- No network access at runtime
- No package installation — only pre-installed packages
- List required dependencies and verify availability

Claude Code and Cursor skills run on the user's machine with full filesystem and network access.
