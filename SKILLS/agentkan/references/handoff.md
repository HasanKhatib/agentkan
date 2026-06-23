# Handoff

End-of-session procedure. Triggers: "handoff", "wrap up", "done for today", "save session".

## Checklist

```
- [ ] Step 1: Read current next.json and board state
- [ ] Step 2: Set statuses to reality
- [ ] Step 3: Refresh next.json
- [ ] Step 4: Bump updated dates if you edited JSON directly
- [ ] Step 5: Validate
- [ ] Step 6: Summarize in two or three sentences
```

**Step 1: Read**

- `{{BOARD_DIR}}/next.json`
- Active and in-progress epics in `{{BOARD_DIR}}/roadmap.json`

**Step 2: Statuses**

- Tasks you finished → `done`
- Tasks in progress → `doing`
- Epics reflect truth: `active`, `blocked`, `next`, `backlog` as appropriate
- Do **not** set epic `done` or archive unless the user asked this turn

**Step 3: Refresh next.json**

- `next` — single most important next action (task id, epic id, or short text)
- `note` — one line of context
- `criticalPath` — human-only items with external clocks
- `risks` — plain strings for fragile or blocking items

**Step 4: Dates**

Set `roadmap.updated` and `next.updated` to today (`YYYY-MM-DD`) if you wrote files directly (the viewer bumps these on save).

**Step 5: Validate**

```bash
npx agentkan validate {{BOARD_DIR}}
```

**Step 6: Summarize**

Tell the user: what moved, what `next` points at, anything blocked on them, and suggest `npx agentkan serve` to review on the board.
