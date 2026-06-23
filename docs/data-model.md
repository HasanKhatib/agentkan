# The data model

Three JSON files plus markdown bodies. The JSON Schema is
`assets/roadmap.schema.json`; `agentkan validate` enforces it plus a few rules
JSON Schema can't express (unique IDs, task-belongs-to-epic, known labels).

## roadmap.json — the live board

```jsonc
{
  "version": 1,
  "project": "My App",
  "updated": "2026-06-22",
  "phases": [
    {
      "id": "P1",
      "title": "MVP",
      "emoji": "🔨",
      "status": "active",            // planned | active | done
      "goal": "...",                  // phase-level, optional
      "exit": "...",
      "epics": [ /* see below */ ]
    }
  ]
}
```

### Epic

```jsonc
{
  "id": "E1.2",                       // E<phase>.<n>, stable forever
  "title": "Onboarding wizard",
  "emoji": "🧭",
  "status": "active",                 // backlog | next | active | blocked | done
  "assignee": "ai+verify",            // ai | me | ai+verify
  "labels": ["frontend", "design"],   // free-form; tokens only add an emoji
  "planned": "2026-06-25",            // YYYY-MM-DD or null
  "order": 2,                          // integer; controls position in a column
  "goal": "One line: what done looks like.",
  "exit": "One AI-verifiable line, phrased as observable behavior.",
  "body": "epics/E1.2.md",            // optional pointer to the long-form body
  "tasks": [ /* see below */ ]
}
```

### Task

```jsonc
{
  "id": "E1.2-T1",                    // <EPIC>-T<n>
  "title": "Wizard layout + steps",
  "status": "todo",                   // todo | doing | done
  "assignee": "ai",                   // optional
  "labels": ["frontend"],             // optional
  "planned": null                     // optional
}
```

## archive.json — finished epics

A flat list, same epic shape, each `status: "done"` with a `shipped` date and
the `phase` it came from. Kept out of the live board so it stays fast; the viewer
loads it only when you toggle **Archived**.

```jsonc
{ "version": 1, "updated": "2026-06-22", "epics": [ /* done epics */ ] }
```

## next.json — the pointer

Thin by design. Don't re-derive epic lists here; point at them.

```jsonc
{
  "updated": "2026-06-22",
  "next": "E1.2-T1",                  // task or epic id; the viewer resolves it to a title + epic
  "note": "One line of context.",
  "criticalPath": [                    // human-only, external-clock work
    { "title": "Register domain", "assignee": "me", "status": "todo", "unblocks": "E1.3" }
  ],
  "risks": ["..."]                     // known-broken, blocking, or risky — plain strings
}
```

The viewer's "Up next" surface resolves `next` against the board, so it can be a
task id (`E1.2-T1`), an epic id (`E1.2`), or free text.

## board.tokens.json — theme & vocabulary

The viewer is fully data-driven from this file: map `theme` to your project's
design tokens and define the emoji for each assignee and status. No code change
is needed to re-skin a board. **Labels are free-form** — any string is valid and
`validate` never rejects one. The `labels` map here only assigns an emoji to the
common ones; unknown labels render without an emoji and still appear as filters.

## Design rules worth keeping

- **IDs are forever.** Reordering changes `order`, never the id. That keeps git
  diffs small and cross-references (`unblocks`, task ids) stable.
- **`goal`/`exit` are one line each.** If you need a paragraph, it belongs in the
  markdown body, which expands on — and never contradicts — the JSON.
- **One source of truth per fact.** State lives in JSON; the "how" lives in the
  body. They reference each other by id.
