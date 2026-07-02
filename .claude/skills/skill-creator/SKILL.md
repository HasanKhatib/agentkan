---
name: skill-creator
description: Creates and validates Agent Skills following Anthropic best practices. Guides discovery, drafts SKILL.md with proper frontmatter, scaffolds references and scripts, and runs validation. Use when creating a new skill, authoring SKILL.md, improving an existing skill, or asked about skill structure, naming, or descriptions.
---

# skill-creator

Creates Agent Skills that follow the [Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) and [authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Discover — gather purpose, triggers, location, constraints
- [ ] Step 2: Design — name, description, structure, freedom level
- [ ] Step 3: Draft — write SKILL.md and supporting files
- [ ] Step 4: Validate — run scripts/validate.sh
- [ ] Step 5: Review — conciseness pass and user approval
- [ ] Step 6: Write — create files in target location
```

**Step 1: Discover**

Gather (ask only what is missing from context):

| Question | Why |
|----------|-----|
| What task should this skill automate? | Defines scope |
| When should the agent trigger it? | Drives description triggers |
| Personal or project skill? | Sets target path |
| Verbatim user text to preserve? | Copy exactly into SKILL.md |
| Scripts or reference files needed? | Determines bundle size |

**Target paths:**

| Scope | Path |
|-------|------|
| Project (this repo) | `skills/<name>/` |
| Claude Code project | `.claude/skills/<name>/` |
| Claude Code personal | `~/.claude/skills/<name>/` |
| Cursor project | `.cursor/skills/<name>/` |
| Cursor personal | `~/.cursor/skills/<name>/` |

Default to `skills/<name>/` in this repo unless the user specifies otherwise.

**Step 2: Design**

1. **Name** — lowercase, hyphens, max 64 chars. Prefer gerund form (`processing-pdfs`) or noun phrase (`pdf-processing`). Never `helper`, `utils`, `tools`, or reserved words (`anthropic`, `claude`).
2. **Description** — third person, max 1024 chars. Include WHAT it does and WHEN to use it. Add concrete trigger terms users will say.
3. **Structure** — keep SKILL.md under 500 lines. Put details in `references/`. Put deterministic ops in `scripts/`.
4. **Freedom level** — see [references/patterns.md](references/patterns.md).

Read [references/structure.md](references/structure.md) for directory layout and frontmatter rules.
Read [references/description-guide.md](references/description-guide.md) before writing the description.

**Step 3: Draft**

Minimum bundle:

```
skill-name/
├── SKILL.md              # Required — workflow + boundaries
├── references/           # Optional — loaded on demand
└── scripts/              # Optional — executed, not loaded
```

SKILL.md template:

```markdown
---
name: skill-name
description: [Third-person WHAT + WHEN with trigger terms]
---

# skill-name

## Workflow
[Numbered steps or checklist]

## Boundaries
[Hard rules — what to never do]
```

Rules while drafting:

- Only add context the agent does not already have
- Link reference files one level deep from SKILL.md only
- Use forward slashes in all paths
- One default approach per task; escape hatch only when needed
- If the user provided exact wording, use it verbatim

For workflow, template, examples, and conditional patterns, see [references/patterns.md](references/patterns.md).

**Step 4: Validate**

Run from the skill directory:

```bash
bash scripts/validate.sh .
```

Or from anywhere:

```bash
bash skills/skill-creator/scripts/validate.sh path/to/skill-name
```

Fix every error before proceeding. Warnings are recommendations — address unless the user explicitly overrides.

**Step 5: Review**

Before writing files, show the user:

1. Full `description` field
2. SKILL.md body (or summary if long)
3. List of supporting files to create

Ask: "Does this look right before I write the files?"

Do not write until approved — unless the user already said to create it.

Conciseness pass — remove anything the agent already knows:

- Generic explanations of common formats (PDF, JSON, git)
- Multiple library options when one default suffices
- Time-sensitive version notes (move to "Old patterns" section if needed)

**Step 6: Write**

Create the directory and all files. Report each path written.

If improving an existing skill, change only what the task requires.

## Evaluation mindset

Before expanding a skill, identify real gaps:

1. Run the task without the skill — note what context you repeat
2. Write minimal instructions that close those gaps
3. Test on three representative scenarios
4. Iterate from observed failures, not imagined requirements

See [references/checklist.md](references/checklist.md) for the full pre-ship checklist.

## Boundaries

- Never create skills in `~/.cursor/skills-cursor/` — reserved for Cursor built-ins
- Never use reserved words in `name`: `anthropic`, `claude`
- Never nest references deeper than one level from SKILL.md
- Never write files before user approves the draft (Step 5), unless explicitly told to proceed
- Keep SKILL.md procedural — move encyclopedic content to `references/`
- Scripts must handle errors explicitly; do not punt failures back to the agent
