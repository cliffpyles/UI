---
name: ExplorationNotebookLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Card]
replaces-raw: []
---

# ExplorationNotebookLayout

> A vertically scrolling notebook frame whose cells freely mix queries, results, and prose narrative.

## Purpose
ExplorationNotebookLayout owns the page-level frame for ad-hoc analysis surfaces — data exploration tools, runbooks, post-mortem write-ups — where the user threads queries, charts, tables, and Markdown commentary into a single linear document. It centralizes cell stacking, gutter rhythm, focus management between cells, and the keyboard model for moving the cursor between cells. Callers supply cell content; the layout owns the frame and chrome.

## When to use
- A linear analysis surface where a user iterates: edit query → run → view result → annotate → repeat
- Runbooks or executable docs that interleave human prose with machine-rendered output
- Investigation tools where cells must keep their order and identity over time

## When NOT to use
- A static dashboard with a fixed grid of widgets — use a domain dashboard layout
- A single query workbench (one editor, one output panel) — use **MasterDetailLayout**
- A faceted list of records — use **FacetedSearchLayout**

## Composition (required)
The implementation MUST build from these components.

| Concern              | Use                                          | Never                                            |
|----------------------|----------------------------------------------|--------------------------------------------------|
| Frame layout         | `Box display="flex" direction="column">`     | raw `<div>` with hand-rolled flex CSS            |
| Outer page wrapper   | `Box as="main">`                             | raw `<main>` with padding CSS                    |
| Cell surface         | `Card>`                                      | raw `<div>` with border/shadow CSS               |
| Cell stack rhythm    | `Box gap>` between Cards                     | margin between siblings in stylesheet            |
| Cell header strip    | `Box display="flex" justify="between">`     | hand-rolled flex CSS                             |
| Section narrative    | `Box>` (text content slotted by caller)      | raw `<div>` with prose CSS                       |

The layout exposes a `cells` array (or children) of typed cells (`query`, `output`, `markdown`); each cell renders as a `Card` inside the column `Box`.

## API contract
```ts
type NotebookCellKind = "query" | "output" | "markdown" | "custom";

interface NotebookCell {
  id: string;
  kind: NotebookCellKind;
  content: ReactNode;
  status?: "idle" | "running" | "error";
}

interface ExplorationNotebookLayoutProps extends HTMLAttributes<HTMLElement> {
  cells: NotebookCell[];
  activeCellId?: string;
  onActivateCell?: (id: string) => void;
  onReorder?: (nextOrder: string[]) => void;
  toolbar?: ReactNode;            // optional sticky top bar
  emptyState?: ReactNode;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Cells render top-to-bottom in `cells` order, each inside a `Card`         |
| empty        | `cells.length === 0` → renders the `emptyState` slot                      |
| active-cell  | Cell matching `activeCellId` receives the focused-cell token treatment    |
| running      | Cell with `status === "running"` shows a status affordance in its header  |
| reordering   | While reorder is in progress, the layout exposes `data-reordering="true"` |

## Accessibility
- Root uses `role="main"` (via `Box as="main"`) so the notebook is the page landmark.
- Each cell is a `<section>` (rendered through `Card`'s `as` prop) with an `aria-labelledby` pointing to its header.
- Active cell is communicated via `aria-current="true"`, not via color alone.
- Vertical Arrow keys move focus between cell roots; Enter activates editing inside the cell (delegated to the cell content).

## Tokens
- Frame spacing: `--notebook-frame-padding-{x|y}`, `--notebook-cell-gap`
- Cell surface inherited from `Card`: `--color-surface-default`, `--radius-md`, `--shadow-sm`
- Active cell accent: `--color-border-focus`
- Status colors: `--color-status-info`, `--color-status-warning`, `--color-status-danger`

## Do / Don't
```tsx
// DO
<ExplorationNotebookLayout
  cells={cells}
  activeCellId={activeId}
  onActivateCell={setActiveId}
  toolbar={<NotebookToolbar/>}
/>

// DON'T — reimplement Card surface for cells
<div className="notebook-cell" style={{ border: "1px solid #ddd" }}>{…}</div>

// DON'T — hand-roll the stack
<main style={{ display: "flex", flexDirection: "column", gap: 16 }}>{…}</main>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owner components
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>`
- Hand-rolled `display: grid` or `display: flex` in this layout's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one `Card` per cell in `cells` order
- `cells={[]}` renders the `emptyState` slot
- `activeCellId` applies `aria-current="true"` and the focused-cell token treatment
- ArrowUp / ArrowDown move focus between cell roots
- Composition probe: at least one `Card` and the column `Box` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes in default and empty states
