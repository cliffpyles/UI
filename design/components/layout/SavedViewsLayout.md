---
name: SavedViewsLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Card, Button, Menu]
replaces-raw: []
---

# SavedViewsLayout

> A catalog page for named, reusable views — create, edit, share, and delete personal or team-scoped configurations.

## Purpose
SavedViewsLayout owns the page-level frame for a saved-views catalog: the responsive grid of view cards, the page header with the New-view action, the per-card overflow menu (rename, share, duplicate, delete), and the empty state. Each card is composed from `Card`; per-card actions go through `Menu`. Callers supply view data and action handlers; the layout owns frame, grid, and chrome.

## When to use
- A library of saved filters, dashboards, or report configurations
- Team-shared "views" or "segments" that users return to often
- Any catalog of small, named, action-bearing entities

## When NOT to use
- A single picker dropdown of saved views — use **SavedViewPicker**
- A list with heavy detail rows — use **Table**
- A drill-down to one view — use **EntityDetailLayout**

## Composition (required)
| Concern              | Use                                                 | Never                                       |
|----------------------|-----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box as="main" display="flex" direction="column">`  | raw `<main>` with flex CSS                  |
| Card grid            | `Grid` with auto-fill column tracks                 | raw CSS Grid in stylesheet                  |
| View card            | `Card>` (one per saved view)                        | raw `<div>` with card CSS                   |
| Header layout        | `Box display="flex" justify="between">`             | hand-rolled flex CSS                        |
| New-view action      | `Button variant="primary">`                         | raw `<button>`                              |
| Per-card overflow    | `Menu` triggered by a `Button variant="ghost">`     | raw `<button>` toggling a popover           |
| Empty state region   | `Box>` (caller passes `EmptyState` content)         | raw `<div>` with empty CSS                  |

## API contract
```ts
interface SavedView {
  id: string;
  name: string;
  description?: string;
  scope: "personal" | "team";
  updatedAt: string;                  // formatted upstream via Timestamp
}

interface SavedViewsLayoutProps extends HTMLAttributes<HTMLElement> {
  views: SavedView[];
  onSelect?: (id: string) => void;
  onCreate?: () => void;
  onRename?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyState?: ReactNode;
  loading?: boolean;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Cards render in a responsive grid; New-view button in the header          |
| empty        | `views.length === 0` → renders the `emptyState` slot in place of the grid |
| loading      | Grid renders skeleton placeholders (caller-supplied) and `aria-busy="true"` |
| menu-open    | Per-card `Menu` renders rename/duplicate/share/delete items               |
| keyboard     | Tab order traverses each card's main affordance, then its overflow Menu   |

## Accessibility
- Root renders as `<main>` so it acts as the page landmark.
- Page header has an `<h1>` (rendered upstream through `Text as="h1">`); the layout exposes a `headerTitleId` so a heading slot can label the region.
- Each card root carries `role="group"` with `aria-labelledby` pointing at the view name.
- Per-card overflow `Menu` exposes its trigger as `aria-label="Actions for {viewName}"`.

## Tokens
- Grid: `--saved-views-card-min-width`, `--saved-views-grid-gap`
- Card surface inherited from `Card`
- Header padding: `--saved-views-header-padding-{x|y}`

## Do / Don't
```tsx
// DO
<SavedViewsLayout
  views={views}
  onCreate={create}
  onRename={rename}
  onDelete={confirmDelete}
/>

// DON'T — raw grid CSS
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 280px)" }}>{…}</div>

// DON'T — raw button trigger for the per-card menu
<button onClick={openMenu}>⋯</button>
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
- Renders one `Card` per view; clicking the card body fires `onSelect`
- New-view `Button` fires `onCreate`
- Per-card `Menu` exposes Rename/Duplicate/Share/Delete and wires the matching handlers
- `views={[]}` renders the `emptyState` slot
- `loading={true}` sets `aria-busy="true"` on the grid region
- Composition probe: `Grid`, at least one `Card`, one `Button`, and one `Menu` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes in default and empty states
