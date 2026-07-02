# Session Handoff — Detailed Checklist

## Step 1: Get session snapshot

Run `scripts/status.sh`. Output includes:
- Git status and recent commits
- In-progress GitHub issues
- Current docs/next.md

Read the full output before writing anything.

## Step 2: Update docs/next.md

Update three sections:
- **What just shipped** — what was completed or merged this session
- **Next action** — the single most important next step; be specific
- **Open items** — anything deferred, blocked, or still open

Keep under 200 words. This is a handoff note, not a log.

## Step 3: Update docs/roadmap.md

Only update if:
- A phase was completed or marked done
- Phase priority changed
- A new phase was added

If nothing changed at the phase level, skip this step.

## Step 4: Close finished GitHub issues

From the status.sh output, identify in-progress issues completed this session.

Close each:
```bash
gh issue close <number> --comment "Completed."
```

If none were completed, skip.

## Step 5: Write memory

Write memory only if something non-obvious was decided:
- A design decision not obvious from the code
- A constraint or requirement that surfaced mid-session
- A direction change with a reason
- Something that would confuse a future Claude instance

Do NOT write memory for: what files changed, what was completed, summaries of work done.

## Step 6: Ask about archiving

Ask: "Should I archive this session to docs/sessions/?"

If yes: write to `docs/sessions/YYYY-MM-DD-slug.md` using `docs/sessions/_template.md`.
If no: done.
