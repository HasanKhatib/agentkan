# AGENTS.md Template

Fill placeholders in `[BRACKETS]`. Remove optional sections that don't apply. Keep under 40 lines.

---

# [Project Name]

[One sentence: what this codebase builds and why.]

## Communication
- No em-dashes, ever. Use a comma, a period, or a new sentence.
- Be direct. State the thing. No filler, no hedging.
- Be practical. Use a short example over a long explanation.
[ADD any project-specific communication rules here]

## Design principles
[ADD 2-3 core architectural constraints for this project]

Examples to adapt:
- One source of truth per topic. When two files need the same content, one imports the other.
- Never duplicate logic across modules.
- [Framework-specific constraint, e.g.: no raw SQL outside the db/ layer]

## Always
[ADD non-negotiable rules for every code change]

Common ones:
- No hallucinated imports — only reference modules that exist
- [Testing rule, e.g.: all changes must pass tests before committing]
- [Safety rule, e.g.: no direct writes to production DB]

## Agents
[OPTIONAL — remove this section if no subagents are planned]

- **Council** — triggers: `@council`, "run the council". Use for irreversible changes.

## Session
**Start:** read `docs/next.md`.
**End:** update `docs/next.md` + `docs/roadmap.md`, close finished issues, write memory if anything non-obvious was decided.
**Archive:** write to `docs/sessions/YYYY-MM-DD-slug.md` using `docs/sessions/_template.md`.
