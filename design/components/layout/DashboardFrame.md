---
name: DashboardFrame
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, FilterChip]
replaces-raw: []
---

# DashboardFrame

> A canvas for placing dashboard widgets on a responsive grid, with an optional filter bar pinned above.

## Purpose
DashboardFrame standardizes how dashboards arrange their content: a global filter strip on top and a configurable widget grid below. It owns the column-track math, gap rhythm, and filter-chip placement so every dashboard looks and behaves the same regardless of which widgets it hosts.

## When to use
- An overview screen composed of multiple independent widgets (charts, KPIs, tables)
- Any surface that needs a global filter scope applied across many child visualizations
- Configurable home/landing pages where users place tiles

## When NOT to use
- A grid of homogeneous KPI tiles → use **MetricOverviewLayout**
- A grid of charts only → use **ChartGridLayout**
- A drag-to-rearrange kanban → use **KanbanLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with named tracks `filters`/`canvas`  | hand-rolled `display: grid`            |
| Filter bar row       | `Box direction="row" wrap gap>`              | hand-rolled flex CSS                   |
| Filter chips         | `FilterChip>`                                 | bespoke chip JSX                       |
| Widget canvas        | `Grid` (responsive column tracks)            | hand-rolled `grid-template-columns`    |
| Widget cell wrapper  | `Box>`                                        | raw `<div>` for placement              |

## API contract
```ts
interface DashboardFilter {
  id: string;
  label: ReactNode;
  onRemove?: () => void;
}

interface DashboardFrameProps extends HTMLAttributes<HTMLDivElement> {
  filters?: DashboardFilter[];
  filterActions?: ReactNode;        // e.g. "Add filter", "Save view"
  columns?: number;                 // default 12
  gap?: "compact" | "comfortable";  // default inherited from density
  children: ReactNode;              // widgets
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                         |
|----------------|------------------------------------------------------------------|
| default        | Filter bar visible; canvas renders children on responsive grid    |
| no-filters     | Filter bar track collapses                                       |
| empty-canvas   | Children empty → frame still renders filter bar; canvas is empty  |
| many-filters   | Filter bar wraps to multiple rows                                |

## Accessibility
- Frame root carries `role="region"` with `aria-label="Dashboard"`
- Filter bar exposes `role="toolbar"` with `aria-label="Filters"`
- Each `FilterChip` is an interactive element with its own removal affordance
- Widget canvas is a presentational container — semantics live inside each widget

## Tokens
- Inherits all surface tokens from `Box`, `Grid`, `FilterChip`
- Adds (component tier): `--dashboard-frame-canvas-gap`, `--dashboard-frame-filter-gap`, `--dashboard-frame-columns`

## Do / Don't
```tsx
// DO
<DashboardFrame
  filters={[{ id: "env", label: "env: prod", onRemove }]}
  filterActions={<Button variant="ghost">Add filter</Button>}
>
  <MetricCard ... />
  <CategoryChart ... />
</DashboardFrame>

// DON'T — hand-roll the canvas
<div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)" }}>…</div>

// DON'T — build filter chips inline
<span className="chip">env: prod ×</span>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `DashboardFrame.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders filter bar when `filters.length > 0`; collapses track when empty
- Each filter renders as a `FilterChip`; removal invokes its `onRemove`
- Canvas renders all children
- `columns` prop drives the responsive track count
- Composition probes: `Grid` at root and inside canvas; `FilterChip` for each filter
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without filters
