---
name: CardListLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, Card, FilterChip, EmptyState]
replaces-raw: []
---

# CardListLayout

> A responsive grid of card-shaped entities with a filter strip and a uniform empty state.

## Purpose
CardListLayout is the canonical "browse a collection of entity cards" surface — projects, repos, people, integrations. It owns the responsive column tracks, the filter strip placement, and the empty state, so every collection screen looks identical regardless of the entity it represents and so cards never have to fight their containing grid.

## When to use
- Browsing a homogeneous collection of entities best represented as cards
- Surfaces with light filtering and no inherent column ordering
- Catalog or gallery views (templates, integrations, sample data)

## When NOT to use
- A list of records best shown as a table → use **DataGridLayout**
- A grid of KPI tiles → use **MetricOverviewLayout**
- Drag-to-reorder kanban → use **KanbanLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with named tracks `filters`/`grid`    | hand-rolled `display: grid`            |
| Filter strip row     | `Box direction="row" wrap gap>`              | hand-rolled flex CSS                   |
| Filter chips         | `FilterChip>`                                 | bespoke chip JSX                       |
| Card grid            | `Grid` (responsive `auto-fill` columns)      | hand-rolled `grid-template-columns`    |
| Card cell            | `Card>`                                       | raw `<div>` with surface CSS           |
| Empty state          | `EmptyState>`                                 | inline empty JSX                       |

## API contract
```ts
interface CardListLayoutProps<Item> extends HTMLAttributes<HTMLDivElement> {
  items: Item[];
  renderItem: (item: Item) => ReactNode;        // expected to return a `Card`
  itemKey: (item: Item) => string;
  filters?: { id: string; label: ReactNode; onRemove?: () => void }[];
  filterActions?: ReactNode;
  minCardWidth?: string;                        // default token-driven
  emptyState?: ReactNode;                       // overrides default EmptyState
  loading?: boolean;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Grid renders one cell per item via `renderItem`                       |
| empty          | `items.length === 0` → renders `EmptyState` in place of the grid      |
| filtered       | Filter strip shows current filter chips                               |
| loading        | Grid is replaced with skeleton `Card`s; count matches `minCardWidth`  |

## Accessibility
- Grid carries `role="list"`; each cell wrapper carries `role="listitem"`
- Filter strip exposes `role="toolbar"` with `aria-label="Filters"`
- Empty state primary action (if any) is keyboard-reachable
- The collection's accessible name comes from a labelled-by attribute the caller supplies

## Tokens
- Inherits all tokens from `Grid`, `Box`, `Card`, `FilterChip`, `EmptyState`
- Adds (component tier): `--card-list-layout-min-card-width`, `--card-list-layout-grid-gap`, `--card-list-layout-filter-gap`

## Do / Don't
```tsx
// DO
<CardListLayout
  items={projects}
  itemKey={(p) => p.id}
  renderItem={(p) => <Card>…</Card>}
  filters={[{ id: "team", label: "team: payments", onRemove }]}
/>

// DON'T — wrap items in raw <div>s
renderItem={(p) => <div className="card">…</div>}

// DON'T — hand-roll empty copy
{items.length === 0 && <p>No projects.</p>}
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `CardListLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one item per `items` entry; `itemKey` is used as React key
- Empty state replaces grid when `items.length === 0`
- Filter strip renders chips and invokes `onRemove`
- Loading replaces grid with skeleton cards
- Composition probes: `Grid` (root + inner grid); `Card`, `FilterChip`, `EmptyState` resolve as expected
- Forwards ref; spreads remaining props onto root
- axe-core passes in default, empty, and loading
