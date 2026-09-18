# Changelog

## 0.2.0 — 2026-09-18

### Added

- Sidebar **Phases** list collapses `done` phases under a "▸ N done" toggle, grayed out when expanded
- Closing the last open epic in a phase (drag-to-done, drawer status change, or archive) offers to mark the phase `done` too
- Sidebar phase rows get a **ⓘ** button opening a details drawer: editable status (`planned`/`active`/`done`), goal, exit, progress, and a clickable epic list

### Fixed

- `docs/viewer.md` and `data-model.md` described the pre-0.1.6 UI (separate phase stepper/release rail, "labels not in filter bar") — rewritten to match the shipped sidebar + filter-popover redesign
- Deduplicated `data-model.md`: `docs/data-model.md` and `skills/agentkan/references/data-model.md` were hand-maintained identical copies with no build step syncing them; the skill copy is now canonical

### Compatibility

- No schema changes; `roadmap.json` `version` stays `1`

## 0.1.6 — 2026-08-31

### Changed

- Viewer nav redesigned: sidebar replaces the phase stepper + release rail, with **Board**/**Timeline** switch, **Up next**, **Phases**, **Releases**, **Archived**/**Legend**/**Labels**
- Filter bar gained a **Filters** popover: phase focus, release focus, and (new) **label** filtering — labels are no longer just card/drawer decoration
- Phase-selection highlight uses the themed accent color instead of a dark border
- `agentkan upgrade` refreshes `index.html` in an existing board without touching `roadmap.json`

### Note

This release shipped without a changelog entry at the time — backfilled 2026-09-18 after the gap caused `docs/viewer.md` to go stale (see 0.2.0).

## 0.1.5 — 2026-07-02

### Added

- Optional `releases[]` in `roadmap.json` for shippable product scope (`v1`, `v2`), alongside phases
- Optional `release` and `releaseDoc` on phases and epics
- `npx agentkan epic new --release <id>` (inherits `phase.release` when omitted)
- Viewer release rail, release badges on cards, release info in epic drawer
- Phase stepper and release rail as single-select navigation focus

### Changed

- Viewer filter bar is assignee-only (phases, releases, and labels are structure/context, not filters)
- Label manager moved to sidebar **Labels** button (write mode)

### Compatibility

- Additive schema: `roadmap.json` `version` stays `1`
- Boards without `releases` validate and work unchanged
- Epic IDs stay stable; no rename required

## 0.1.4 and earlier

See git history.
