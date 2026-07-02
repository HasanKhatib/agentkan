---
name: scaffold-repo
description: Scaffolds a new repo's Claude Code harness: creates CLAUDE.md, AGENTS.md with project context, docs/ with next.md and roadmap.md, and optional session-handoff skill. Use when starting a new project, setting up AI for a new repo, or asked to scaffold repo, init harness, set up claude, or new project setup.
---

# scaffold-repo

Initializes the Claude Code harness for a new repo. Produces CLAUDE.md, AGENTS.md, docs/, and optionally a session-handoff skill.

## Workflow

Copy this checklist and track progress:

```
- [ ] Step 1: Collect project context
- [ ] Step 2: Read templates
- [ ] Step 3: Draft AGENTS.md
- [ ] Step 4: Prepare docs/ content
- [ ] Step 5: Ask about optional skills
- [ ] Step 6: Show AGENTS.md draft and get approval
- [ ] Step 7: Write all files
```

**Step 1: Collect project context**

Ask the user (or extract from their description):
- Project name and one-sentence purpose
- Primary language/stack
- Any specific communication or architecture constraints
- Any "always" rules (e.g., no direct DB writes, tests required before merge)
- Target directory (default: current directory)

If the user provides context upfront, skip the question and go to Step 2.

**Step 2: Read templates**

Read `references/agents-template.md` for the AGENTS.md structure.
Read `references/docs-templates.md` for the docs/ file contents.

**Step 3: Draft AGENTS.md**

Fill the template with collected context:
- Under 40 lines total — every line must earn its place
- Remove placeholder sections that do not apply (e.g., remove Agents section if no subagents planned)
- Communication rules are the minimum baseline — add project-specific ones on top
- Session section is always included

CLAUDE.md is always one line: `@AGENTS.md`

**Step 4: Prepare docs/ content**

From `references/docs-templates.md`, prepare content for:
- `docs/next.md`
- `docs/roadmap.md`
- `docs/sessions/_template.md`

Replace `[Project Name]` with the actual project name.

**Step 5: Ask about optional skills**

Ask: "Add a session-handoff skill? Gives you a `/handoff` trigger to close sessions cleanly. (y/n)"

If yes: plan to create `.claude/skills/session-handoff/` with three files:
- `SKILL.md` from `assets/session-handoff-skill.md`
- `references/checklist.md` from `assets/session-handoff-checklist.md`
- `scripts/status.sh` from `assets/session-handoff-status.sh`

**Step 6: Show AGENTS.md draft and get approval**

Print the full AGENTS.md draft. Ask: "Does this look right before I write everything?"

Do not write any files until the user approves.

**Step 7: Write all files**

Write to the target directory:
- `CLAUDE.md`
- `AGENTS.md`
- `docs/next.md`
- `docs/roadmap.md`
- `docs/sessions/_template.md`
- `.claude/skills/session-handoff/` (if requested in Step 5)

Report each file written.

## Boundaries

- Never write files before showing AGENTS.md and getting approval (Step 6)
- AGENTS.md must be under 40 lines
- CLAUDE.md is always exactly one line: `@AGENTS.md`
- Do not create README.md, .gitignore, or any non-harness file
- Do not create skills the user did not explicitly ask for
