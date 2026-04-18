---
name: KanbanLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Card]
replaces-raw: []
---

# KanbanLayout

> Horizontally-arranged columns of draggable cards representing items moving through states.

## Purpose
KanbanLayout is the canonical "items across stages" surface — task boards, pipeline views, deal stages, ticket workflows. It owns the column tracks, per-column scroll containment, drop-target affordances, and consistent column header placement, so every kanban-style surface in the product behaves identically regardless of the entity type.

## When to use
- Items that progress through a finite set of explicit states or stages
- Task boards (To Do / In Progress / Done)
- Sales pipelines or applicant tracking

## When NOT to use
- A flat list of cards with no stages → use **CardListLayout**
- A grid of independent visualizations → use **ChartGridLayout**
- A primary/detail editing surface → use **MultiPanelWorkspace**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with one named track per column        | hand-rolled `display: grid`            |
| Column wrapper       | `Box direction="column">` (scroll container) | raw `<div>` with overflow CSS          |
| Column header row    | `Box direction="row" justify="between">`     | hand-rolled flex CSS                   |
| Card                 | `Card>`                                       | raw `<div>` with surface CSS           |

## API contract
```ts
interface KanbanColumn<Item> {
  id: string;
  title: ReactNode;
  count?: number;
  items: Item[];
  headerActions?: ReactNode;
  emptyState?: ReactNode;
}

interface KanbanLayoutProps<Item> extends HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn<Item>[];
  itemKey: (item: Item) => string;
  renderItem: (item: Item, columnId: string) => ReactNode;     // expected to return a Card
  onItemMove?: (item: Item, fromColumn: string, toColumn: string, toIndex: number) => void;
  columnMinWidth?: string;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | One scrollable column per entry; cards rendered via `renderItem`      |
| dragging       | Drop-target columns receive a visible affordance                      |
| empty-column   | Column body renders provided `emptyState` (or default placeholder)     |
| narrow viewport| Board scrolls horizontally; column min width preserved                |

## Accessibility
- Root carries `role="region"` with `aria-label="Board"`
- Each column carries `role="list"` with `aria-labelledby` pointing at its header
- Each card is `role="listitem"` and exposes its draggable affordance with `aria-grabbed` (or the modern equivalent)
- Keyboard drag-and-drop: focus a card, then move with arrow keys + space/enter to commit
- Drop announcements use `aria-live="polite"`

## Tokens
- Inherits all tokens from `Grid`, `Box`, `Card`
- Adds (component tier): `--kanban-layout-column-min-width`, `--kanban-layout-column-gap`, `--kanban-layout-card-gap`

## Do / Don't
```tsx
// DO
<KanbanLayout
  columns={cols}
  itemKey={(t) => t.id}
  renderItem={(t) => <Card>…</Card>}
  onItemMove={moveTask}
/>

// DON'T — use bare divs as cards
renderItem={(t) => <div className="task">…</div>}

// DON'T — hand-roll the column tracks
<div style={{ display: "grid", gridTemplateColumns: `repeat(${n},1fr)` }}>…</div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `KanbanLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one column per entry; each column lists its items via `renderItem`
- Empty column renders supplied `emptyState`
- Pointer drag of a card across columns invokes `onItemMove` with correct args
- Keyboard reorder commits via space/enter and invokes `onItemMove`
- Composition probes: `Grid` at root; `Card` for each rendered item; `Box` for column scroll
- Forwards ref; spreads remaining props onto root
- axe-core passes with multiple columns and an empty column
