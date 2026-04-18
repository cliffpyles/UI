---
name: ChartGridLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, ChartHeader]
replaces-raw: []
---

# ChartGridLayout

> A responsive grid of independent charts, each with its own header and consistent inter-chart spacing.

## Purpose
ChartGridLayout is the standard layout for showing multiple charts side by side: comparing slices, breaking a metric down by dimension, or assembling a visual report. It owns the column-track math, inter-chart gap, header placement, and span overrides so every grid of charts in the product is visually consistent regardless of which chart components are placed inside.

## When to use
- A page that displays several independent visualizations in a uniform grid
- "Breakdown" surfaces showing the same metric across multiple dimensions
- Visual reports composed from chart building blocks

## When NOT to use
- A single dashboard with mixed widget types → use **DashboardFrame**
- KPI tiles → use **MetricOverviewLayout**
- Charts that share a single time axis stacked vertically → use a vertical `Box` of charts inside a regular page

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` (responsive column tracks)            | hand-rolled `display: grid`            |
| Chart cell           | `Box>` (with span variants)                  | raw `<div>` with positioning CSS       |
| Per-chart header     | `ChartHeader>`                                | bespoke title row                      |

## API contract
```ts
interface ChartGridItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  span?: 1 | 2 | 3;                // column span
  actions?: ReactNode;             // forwarded to ChartHeader
  content: ReactNode;              // a chart component
}

interface ChartGridLayoutProps extends HTMLAttributes<HTMLDivElement> {
  charts: ChartGridItem[];
  columns?: number;                 // default 3
  loading?: boolean;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Each chart rendered in a cell with its `ChartHeader` above the body   |
| spanned        | `span` controls how many tracks the cell occupies (capped to columns) |
| loading        | All chart bodies are replaced with skeleton placeholders               |
| empty-charts   | `charts.length === 0` renders nothing inside the grid (caller-handled)|

## Accessibility
- Root carries `role="region"` with `aria-label="Charts"`
- Each chart cell is a `region` labelled by its `ChartHeader` title
- Chart actions (per `ChartHeader`) are keyboard-reachable
- The grid's reading order matches DOM order; visual span never changes that

## Tokens
- Inherits all tokens from `Grid`, `Box`, `ChartHeader`
- Adds (component tier): `--chart-grid-layout-gap`, `--chart-grid-layout-columns`, `--chart-grid-layout-min-chart-height`

## Do / Don't
```tsx
// DO
<ChartGridLayout
  charts={[
    { id: "revenue", title: "Revenue", content: <TimeSeriesChart .../> },
    { id: "cohort",  title: "Cohort",  content: <HeatmapGrid    .../> },
  ]}
/>

// DON'T — render bespoke titles
<div className="chart-grid">
  <h3>Revenue</h3><MyChart/>
</div>

// DON'T — hand-roll the column math
<div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>…</div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ChartGridLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one cell per chart with the right header
- `span` widens the corresponding cell across tracks
- `loading` replaces each chart body with a skeleton
- Composition probes: `Grid` at root; `ChartHeader` for each chart cell
- Forwards ref; spreads remaining props onto root
- axe-core passes with mixed spans and in loading
