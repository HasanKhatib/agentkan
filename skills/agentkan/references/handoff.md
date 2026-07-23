# Handoff

End-of-session procedure. Triggers: "handoff", "wrap up", "done for today", "save session".

Replace `{{BOARD_DIR}}` with the project's board path (default `docs/board`).

## Checklist

```
- [ ] Step 1: Run status.sh — git and board snapshot
- [ ] Step 2: Read current next.json and board state
- [ ] Step 3: Set statuses to reality
- [ ] Step 4: Refresh next.json
- [ ] Step 5: Bump updated dates if you edited JSON directly
- [ ] Step 6: Note epics ready to archive
- [ ] Step 7: Validate
- [ ] Step 8: Summarize briefly
- [ ] Step 9: Ask about session log (optional)
```

**Step 1: Snapshot**

From this skill folder:

```bash
bash scripts/status.sh {{BOARD_DIR}}
```

Read the full output before writing anything.

**Step 2: Read**

- `{{BOARD_DIR}}/next.json`
- Active and in-progress epics in `{{BOARD_DIR}}/roadmap.json`

**Step 3: Statuses**

- Tasks you finished → `done`
- Tasks in progress → `doing`
- Epics reflect truth: `active`, `blocked`, `next`, `backlog` as appropriate
- Update phase status if a phase completed or priority changed
- Update release status if a release shipped or became the current focus
- Do **not** set epic `done` or archive unless the user asked this turn

**Step 4: Refresh next.json**

Thin pointer only. Do not re-derive epic lists here.

- `next` — single most important next action (task id, epic id, or short text)
- `note` — one line of context
- `criticalPath` — human-only items with external clocks
- `risks` — plain strings for fragile or blocking items

**Step 5: Dates**

Set `roadmap.updated` and `next.updated` to today (`YYYY-MM-DD`) if you wrote files directly (the viewer bumps these on save).

**Step 6: Epics ready to archive**

If every task in an epic is `done`, tell the user it is ready to archive in the viewer (`npx agentkan serve {{BOARD_DIR}}`). Human drags to Done and archives. Skip if none qualify.

**Step 7: Validate**

```bash
npx agentkan validate {{BOARD_DIR}}
```

**Step 8: Summarize**

Tell the user: what moved, what `next` points at, anything blocked on them, and suggest `npx agentkan serve` to review on the board.

**Step 9: Session log (optional)**

Ask: "Archive this session to `docs/sessions/`?"

If yes:

1. Create `docs/sessions/` if missing
2. On first use, copy [assets/session.template.md](../assets/session.template.md) to `docs/sessions/_template.md`
3. Write `docs/sessions/YYYY-MM-DD-slug.md` from the template (worked on, shipped, decisions, next)

Session logs are optional narrative. `roadmap.json` and `next.json` remain the source of truth for state.

If the user says no, done.
