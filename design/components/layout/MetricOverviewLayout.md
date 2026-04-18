---
name: MetricOverviewLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, MetricCard]
replaces-raw: []
---

# MetricOverviewLayout

> A responsive grid of KPI metric cards with optional supporting chart slots beneath.

## Purpose
MetricOverviewLayout is the canonical "headline numbers at the top of the page" surface. It owns the responsive column tracks for KPI tiles, the optional supporting-chart row, and the consistent gap rhythm so every overview screen — product analytics, billing, infra health — opens with an identical visual structure regardless of which metrics are surfaced.

## When to use
- The top of a page summarizing 2-8 KPI metrics
- An overview/landing surface that leads with totals and trends
- A dashboard section that pairs KPI tiles with a few supporting charts

## When NOT to use
- A configurable widget canvas → use **DashboardFrame**
- A grid of independent charts (no KPIs) → use **ChartGridLayout**
- A list of entities → use **CardListLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with named tracks `metrics`/`charts`  | hand-rolled `display: grid`            |
| Metric tile grid     | `Grid` (responsive `auto-fit` tracks)        | hand-rolled `grid-template-columns`    |
| Metric tile          | `MetricCard>`                                 | bespoke KPI tile JSX                   |
| Supporting chart row | `Box direction="row" wrap gap>`              | hand-rolled flex CSS                   |

## API contract
```ts
interface OverviewMetric {
  id: string;
  card: ReactNode;                 // expected to be a MetricCard
}

interface MetricOverviewLayoutProps extends HTMLAttributes<HTMLDivElement> {
  metrics: OverviewMetric[];
  supportingCharts?: ReactNode;    // typically multiple chart components
  metricMinWidth?: string;         // token-driven default
  loading?: boolean;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Tiles render in responsive grid; supporting row renders if provided   |
| loading        | Tiles render in loading state via `MetricCard loading`                |
| no-supporting  | `supportingCharts` omitted → chart track collapses                     |
| narrow viewport| Tiles wrap to fewer columns based on `metricMinWidth`                 |

## Accessibility
- Root carries `role="region"` with `aria-label="Overview"`
- Each tile is its own labelled region (provided by `MetricCard`)
- Reading order matches DOM order; visual reflow does not change semantics

## Tokens
- Inherits all tokens from `Grid`, `Box`, `MetricCard`
- Adds (component tier): `--metric-overview-tile-min-width`, `--metric-overview-tile-gap`, `--metric-overview-section-gap`

## Do / Don't
```tsx
// DO
<MetricOverviewLayout
  metrics={[
    { id: "rev", card: <MetricCard label="Revenue" value={1240} .../> },
    { id: "act", card: <MetricCard label="Active users" value={812} .../> },
  ]}
  supportingCharts={<><TimeSeriesChart .../><CategoryChart .../></>}
/>

// DON'T — render KPI tiles inline
<div className="kpi"><span>Revenue</span><span>{v}</span></div>

// DON'T — hand-roll tile grid math
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `MetricOverviewLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one tile per metric entry
- `loading` propagates so tiles render skeletons via `MetricCard`
- Supporting chart row renders only when `supportingCharts` is provided
- Composition probes: `Grid` (root + tile grid); `MetricCard` for each tile
- Forwards ref; spreads remaining props onto root
- axe-core passes in default and loading
