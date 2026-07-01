# agentkan

A local-first epic/task roadmap board for building with AI agents: hybrid JSON state, markdown bodies, a single-file read-write viewer. No server, no build, no lock-in.

## Communication
- No em-dashes, ever. Use a comma, a period, or a new sentence.
- Be direct. State the thing. No filler, no hedging.
- Be practical. Use a short example over a long explanation.

## Design principles
- Hybrid by design: one-line `goal`/`exit` live inline in `roadmap.json`; longer prose lives in `epics/<ID>.md`. Don't collapse to pure JSON or pure markdown.
- The viewer is one zero-dependency `index.html`. No frameworks, no build step, no new runtime deps.
- Git is the history. Stable epic ids and status columns keep diffs small; archive by status move, don't delete.
- One source of truth per topic. When two files need the same content, one imports the other.

## Always
- No hallucinated imports — only reference modules that exist.
- ESM only, Node >=18. Match the existing `.mjs` style.
- Run `npm test` (smoke) and `npm run validate` (schema gate) before committing.
- The AI proposes, the human disposes: never move a card to Done on the user's behalf.

## Session
**Start:** read `docs/board/next.json` and skim active epics in `docs/board/roadmap.json`. For deeper context see `docs/getting-started.md` and `docs/origin.md`.
**Board work:** follow `SKILLS/agentkan/SKILL.md` (this copy is for developing the tool; consumer projects install the skill and merge `SKILLS/agentkan/assets/AGENTS.snippet.md`). Edit JSON safely, run `npm run validate`, never mark an epic `done` or archive unless the user asks in this turn.
**End (handoff):** set statuses to reality, refresh `docs/board/next.json` (`next`, `criticalPath`, `risks`), bump `updated` dates, run `npm run validate`, summarize changes briefly.
**New epic stub:** `npx agentkan epic new "<title>" [--phase Pn]`, then fill goal, exit, tasks, and `docs/board/epics/<ID>.md`.
