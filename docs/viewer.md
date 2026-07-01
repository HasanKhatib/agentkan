# The viewer

`index.html` is the whole UI: one file, no dependencies, no build. It reads the
board's JSON and writes it back. Nothing leaves your machine.

## Read vs. write

- **Read-write** is on whenever the board is **served**: run `agentkan serve`
  and open the localhost URL. Edits POST straight back to the local server,
  which writes the files — no folder dialog, ever. The header shows `saved` /
  `unsaved` / `saving…`. Works in any browser.
- **Read-only** is what you get when you open `index.html` directly off disk
  (`file://`). It still fetches and renders everything; it just can't write,
  because a page on `file://` has no server to save through. The drawer shows
  "run `agentkan serve` to edit".

There's no browser-specific requirement and no permission prompt: the server
already owns the board directory you launched it from.

## Layout

- **Sidebar** (left): switch between **Board** and **Timeline**, see and edit
  **Up next**, and toggle Archived / Legend. Hide or show it with the ☰ button in
  the top bar (the collapsed state is remembered); on narrow screens ☰ opens it
  as a slide-over.
- **Top bar**: ☰ (sidebar), the current view, search (Board view), the
  light/dark toggle (☀/🌙), reload, and the save chip.
- **Phase stepper** (both views): one chip per phase with a progress bar; the
  phase whose `status` is `active` is marked **you**. Click a phase to filter.
- **Filter bar** (under the stepper): an **Assignee** row and a **Labels** row
  beneath it; "clear filters" resets everything. The **+** in the Labels row opens
  a manager to add, rename, re-emoji, or delete labels (saved to
  `board.tokens.json`; renames and deletes propagate to every epic and task).
  (Phases filter from the stepper chips.)

## The two views

- **Board** — kanban columns by epic status. Drag a card between columns to change
  its status (Backlog → Next → Active; drop in Blocked when stuck). Within each
  column, epics sort by id (`E1.1`, `E1.2`, `E1.10`, …).
- **Timeline** — the roadmap: each phase is a lane holding its epics sorted by id,
  colored by status. The active phase is flagged "you are here" and the Up-next
  epic is highlighted. Click any epic to open its drawer.

## What you can do

- **Open an epic** (click a card or timeline bar) to edit title, assignee, status,
  and planned date; pick labels from a dropdown (remove with the × on each chip);
  read goal and exit; and manage tasks — toggle ⬜ → 🔨 → ☑️, rename inline, add,
  reorder (↑/↓), or delete. The epic's markdown
  body (`epics/<ID>.md`) renders inline; click **Edit** then **Save** to write it
  back — the `.md` file stays on disk for agents and git.
- **Edit Up next** from the sidebar (**Edit**): pick the next action (any epic or
  task), set the note, and manage the critical-path and risk lists. Saves to
  `next.json`.
- **Archive** a Done epic from its drawer — it moves to `archive.json` with a
  `shipped` date and leaves the live board. **Restore** brings it back.
- **Filter** by assignee and label (filter bar) and by phase (stepper chips), or
  **search** by id/title. **Archived** toggles finished epics into view.
  **Legend** shows the full emoji vocabulary.
- **Switch light/dark** with the ☀/🌙 toggle. It defaults to your OS appearance
  and remembers your choice; text stays high-contrast in both.

## Re-skinning

Colors and emoji come entirely from `board.tokens.json`. Point `theme` at your
project's design tokens and the board adopts them in **light** mode. For example,
to match a green operational product you'd set `brand` to your brand green,
`bg-canvas` to your app canvas, and so on — no edit to `index.html`.

**Dark** mode uses a built-in high-contrast palette. To customize it too, add a
`themeDark` block to `board.tokens.json` with the same keys as `theme`; if it's
absent, the built-in dark palette is used.

## Accessibility notes

The default theme meets WCAG AA contrast for text and chips. Focus states are
visible, the layout reflows to a single column on narrow screens, and emojis are
always paired with a text label (never the only signal). If you re-skin, keep
text-on-surface contrast at 4.5:1 or higher.
