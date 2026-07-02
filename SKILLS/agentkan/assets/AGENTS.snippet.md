## Roadmap (agentkan)

Board directory: `{{BOARD_DIR}}/`. State lives in JSON (`roadmap.json`, `next.json`); do not append unbounded markdown roadmaps.

**Start:** read `{{BOARD_DIR}}/next.json` and skim active epics in `{{BOARD_DIR}}/roadmap.json`.

**Board work:** follow the installed `agentkan` skill. After edits: `npx agentkan validate {{BOARD_DIR}}`.

**End (handoff):** run agentkan handoff — status snapshot, update board, validate, optionally log to `docs/sessions/`.

**Human owns:** dragging epics to Done and archiving in the viewer (`npx agentkan serve {{BOARD_DIR}}`).

**New epic stub:** `npx agentkan epic new "<title>" [--phase Pn] [--release v1]`, then fill goal, exit, tasks, and `{{BOARD_DIR}}/epics/<ID>.md`.
