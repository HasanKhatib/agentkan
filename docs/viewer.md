# The viewer

`index.html` is the whole UI: one file, no dependencies, no build. It reads the
board's JSON and writes it back. Nothing leaves your machine.

## Read vs. write

- **Read-only** is the default. Opened over `file://` or behind `agentkan
  serve`, it fetches `roadmap.json`, `archive.json`, `next.json`, and
  `board.tokens.json` and renders them. Good for a glance or on any browser.
- **Read-write** turns on when you click **Enable editing**. It uses the
  browser's File System Access API to get a read-write handle to the board
  folder, and remembers it (via IndexedDB) so it reconnects next time with one
  click. Every change saves back to the JSON, debounced; the header shows
  `saved` / `unsaved` / `saving…`.

Editing needs Chrome or Edge (the File System Access API). In Firefox or Safari
the board is read-only — edit the JSON in your editor or your agent does it.

Serving on **localhost is recommended for editing** because it's a guaranteed
secure context for the API.

## What you can do

- **Drag a card** between columns to change its status. Backlog → Next → Active
  as work moves; drop in Blocked when it's stuck.
- **Click a card** to open the drawer: change assignee, status, planned date, and
  labels; read goal and exit; toggle each task ⬜ → 🔨 → ☑️; open the body path
  in your editor.
- **Archive** a Done epic from its drawer — it moves to `archive.json` with a
  `shipped` date and leaves the live board. **Restore** brings it back.
- **Filter** by assignee and label, or **search** by id/title. **Archived**
  toggles finished epics into view. **Legend** shows the full emoji vocabulary.

## Re-skinning

Colors and emoji come entirely from `board.tokens.json`. Point `theme` at your
project's design tokens and the board adopts them. For example, to match a green
operational product you'd set `brand` to your brand green, `bg-canvas` to your
app canvas, and so on — no edit to `index.html`.

## Accessibility notes

The default theme meets WCAG AA contrast for text and chips. Focus states are
visible, the layout reflows to a single column on narrow screens, and emojis are
always paired with a text label (never the only signal). If you re-skin, keep
text-on-surface contrast at 4.5:1 or higher.
