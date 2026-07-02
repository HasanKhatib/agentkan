# Changelog

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
