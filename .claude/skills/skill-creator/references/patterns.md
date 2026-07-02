# Common skill patterns

Match pattern to task fragility.

## Degrees of freedom

| Level | When | Example |
|-------|------|---------|
| High | Multiple valid approaches, context-dependent | Code review heuristics |
| Medium | Preferred pattern with acceptable variation | Report template to customize |
| Low | Fragile ops, consistency critical | Exact migration command sequence |

**Narrow bridge** → low freedom, exact steps.
**Open field** → high freedom, general direction.

## Workflow pattern

For multi-step tasks, use a copyable checklist:

```markdown
## Workflow

Copy this checklist and track progress:

\`\`\`
- [ ] Step 1: Gather inputs
- [ ] Step 2: Process
- [ ] Step 3: Validate
- [ ] Step 4: Deliver
\`\`\`

**Step 1: Gather inputs**
...
```

## Conditional workflow

Route by decision point:

```markdown
1. Determine task type:
   **Creating new content?** → Creation workflow
   **Editing existing?** → Editing workflow
2. Creation workflow: ...
3. Editing workflow: ...
```

## Template pattern

**Strict** (API responses, data formats):

```markdown
ALWAYS use this exact structure:
\`\`\`markdown
# [Title]
## Section
...
\`\`\`
```

**Flexible** (adapt to context):

```markdown
Default format — adjust sections as needed:
\`\`\`markdown
# [Title]
## Findings
[Tailor to discovery]
\`\`\`
```

## Examples pattern

For output-quality-sensitive skills, show input/output pairs:

```markdown
**Example 1:**
Input: Added JWT authentication
Output:
\`\`\`
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
\`\`\`
```

## Feedback loop pattern

For quality-critical tasks:

```markdown
1. Make changes
2. Validate: `bash scripts/validate.sh output/`
3. If errors — fix and re-validate
4. Proceed only when validation passes
```

## Domain-specific organization

Split references by domain so only relevant files load:

```text
skill/
├── SKILL.md
└── reference/
    ├── finance.md
    ├── sales.md
    └── product.md
```

Link each file directly from SKILL.md:

```markdown
**Finance metrics** → [reference/finance.md](reference/finance.md)
**Sales pipeline** → [reference/sales.md](reference/sales.md)
```

## Utility scripts

Prefer scripts over generated code for deterministic ops:

```markdown
**validate.py** — check output schema
\`\`\`bash
python scripts/validate.py fields.json
# Returns: "OK" or lists errors
\`\`\`
```

State intent clearly:

- **Execute**: "Run `scripts/validate.py`"
- **Read as reference**: "See `scripts/validate.py` for the algorithm"

Scripts should handle errors with actionable messages — never punt to the agent.

## Anti-patterns

- Windows paths (`scripts\foo.py`) — use forward slashes
- Too many library options — one default + escape hatch
- Time-sensitive notes in main body — use "Old patterns" section
- Inconsistent terms — pick one (`field` not `box`/`element`/`control`)
- Deeply nested references — keep links one level from SKILL.md
- Verbose primers on well-known concepts — trust the model
