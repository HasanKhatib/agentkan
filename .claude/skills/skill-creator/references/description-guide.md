# Writing effective descriptions

The `description` field is how agents discover and select skills. It is always loaded; make every word count.

## Formula

```
[What the skill does — specific capabilities]. Use when [trigger scenarios and key terms].
```

## Rules

1. **Third person** — description is injected into the system prompt
2. **Specific** — name concrete inputs, outputs, and file types
3. **Trigger-rich** — include words users actually say
4. **One description** — no separate "when to use" field; combine into `description`

## Good examples

```yaml
# Document processing
description: Extracts text and tables from PDF files, fills forms, and merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Git workflow
description: Generates descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.

# Session close-out
description: Runs the end-of-session procedure: updates docs/next.md and docs/roadmap.md, closes finished GitHub issues, and writes memory for non-obvious decisions. Use at the end of a work session or when asked to wrap up, handoff, or end session.

# Meta — this skill
description: Creates and validates Agent Skills following Anthropic best practices. Use when creating a new skill, authoring SKILL.md, improving an existing skill, or asked about skill structure, naming, or descriptions.
```

## Bad examples

```yaml
description: Helps with documents          # Too vague — no triggers
description: I can help you process PDFs   # Wrong person
description: Use this for data tasks       # No specifics
description: Does stuff with files         # Not discoverable
```

## Naming conventions

Prefer gerund form — clearly describes the activity:

- `processing-pdfs`, `analyzing-spreadsheets`, `writing-documentation`

Acceptable alternatives:

- Noun phrase: `pdf-processing`, `spreadsheet-analysis`
- Action: `process-pdfs`, `analyze-spreadsheets`

Avoid:

- `helper`, `utils`, `tools`, `documents`, `data`
- `anthropic-*`, `claude-*` (reserved)
