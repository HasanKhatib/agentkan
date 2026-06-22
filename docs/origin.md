# Origin and naming

Decision record for how agentkan got its name and shape.

## Security note

During early planning an npm automation token was pasted into a chat. Treat it
as **burned** — revoke it in npm account settings before creating a fresh token
for future publishes.

## Name search (June 2026)

Verified free on npm at selection time:

| Lane | Names |
|------|-------|
| Breaking Bad / BCS | fring, heisenkan, half-measures, pollos |
| Engineer + AI | jsonkan, **agentkan**, wipkan, roadmapd, kanson, promptkan, vibekan, yakboard, shipit-board |
| Taken / skip | schrute (browser automation), dunder (inheritance lib) |

### Why agentkan

- **Discoverability:** someone reading the name guesses kanban + AI agent shared board
- **Theme fit:** encodes the core model — you and your agent share one board
- **Commands:** `agentkan` / `ak`

jsonkan was the other top pick (pure JSON + kanban). fring is the most brandable
if opacity is acceptable.

## Locked delivery plan

- Dependency-free CLI: `init`, `epic new`, `serve`, `validate`
- Single-file viewer (`index.html`), zero build, File System Access API on localhost
- Hybrid JSON state + markdown epic bodies
- AI proposes, human disposes
- Local verification via `npm pack` before registry publish
- Two outputs:
  1. This repo (the tool)
  2. Per-project boards via `npx agentkan init` (e.g. Zaboun app repo)

## Publish history

- **v0.1.0** — initial npm publish (repository metadata had USER placeholder)
- **v0.1.1** — metadata fix: HasanKhatib GitHub URL, author, homepage, bugs
