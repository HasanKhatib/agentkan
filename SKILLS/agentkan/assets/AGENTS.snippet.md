## Roadmap (agentkan)

Board directory: `{{BOARD_DIR}}/`. State lives in JSON (`roadmap.json`, `next.json`); do not append unbounded markdown roadmaps.

**Start:** read `{{BOARD_DIR}}/next.json` and skim active epics in `{{BOARD_DIR}}/roadmap.json`.

**Board work:** follow the installed `agentkan` skill. After edits: `npx agentkan validate {{BOARD_DIR}}`.

**End (handoff):** set statuses to reality, refresh `next.json` (`next`, `criticalPath`, `risks`), validate, summarize briefly.

**Human owns:** dragging epics to Done and archiving in the viewer (`npx agentkan serve {{BOARD_DIR}}`).

**New epic stub:** `npx agentkan epic new "<title>" [--phase Pn]`, then fill goal, exit, tasks, and `{{BOARD_DIR}}/epics/<ID>.md`.
