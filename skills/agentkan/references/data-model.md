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
  "releases": [                         // optional: shippable product scope
    {
      "id": "v1",
      "title": "MVP",
      "emoji": "🚀",
      "status": "active",              // planned | active | done
      "goal": "...",                    // optional
      "exit": "...",
      "releaseDoc": "releases/v1.md"    // optional: exit-criteria markdown
    }
  ],
  "phases": [
    {
      "id": "P1",
      "title": "MVP",
      "emoji": "🔨",
      "status": "active",            // planned | active | done
      "release": "v1",               // optional: default release for epics in this phase
      "goal": "...",                  // phase-level, optional
      "exit": "...",
      "epics": [ /* see below */ ]
    }
  ]
}
```

### Release

Optional top-level array. Releases are **shippable product scope** (e.g. `v1`, `v2`).
Phases are **execution grouping**. Many phases can map to one release via
`phase.release`; epics can override with `epic.release`.

**Release resolution** (viewer, archive): `epic.release` → else `phase.release` → else none.

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
  "release": "v1",                    // optional: release id (inherits phase.release if omitted)
  "releaseDoc": "releases/v1.md",     // optional: per-epic exit-criteria doc
  "order": 2,                          // optional legacy integer; viewer sorts by id instead
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

A flat list, same epic shape, each `status: "done"` with a `shipped` date,
the `phase` it came from, and optionally `release`. Kept out of the live board
so it stays fast; the viewer loads it only when you toggle **Archived**.

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
common ones; unknown labels render without an emoji. Labels are not in the filter
bar; they appear on epic cards and in the drawer.

## Display order

Within each kanban column and each timeline lane, the viewer sorts epics by **id**
(`E1.1`, `E1.2`, `E1.10`, …) numerically. Dragging changes **status** (which
column), not sort position. To signal priority, move cards to Next/Active or point
`next.json` at the epic or task.

## Design rules worth keeping

- **IDs are forever.** Never renumber epics to reshuffle the board. Stable ids
  keep git diffs small and cross-references (`unblocks`, task ids) valid.
- **`goal`/`exit` are one line each.** If you need a paragraph, it belongs in the
  markdown body, which expands on — and never contradicts — the JSON.
- **One source of truth per fact.** State lives in JSON; the "how" lives in the
  body. They reference each other by id.
