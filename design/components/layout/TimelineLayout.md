---
name: TimelineLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Text]
replaces-raw: []
---

# TimelineLayout

> A horizontal time axis with stacked entity rows for Gantt-, schedule-, and incident-style timelines.

## Purpose
TimelineLayout is the canonical "things over time" surface — Gantt charts, deployment timelines, incident overlays, schedule grids. It owns the sticky time axis, the row-header column for entity labels, the body scroll containment, and the consistent placement of time markers, so every timeline-shaped surface in the product reads identically regardless of which event shapes its rows render.

## When to use
- Gantt or schedule visualizations of work or events
- Deployment, release, or incident timelines aligned to wall time
- Resource utilization shown row-by-row over a time range

## When NOT to use
- A single time-series chart → use **TimeSeriesChart** inside a regular page
- A 2D matrix of values → use **PivotLayout**
- An ordered list of events without a continuous axis → use **ActivityFeed**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with `corner`/`axis`/`rowLabels`/`body` named tracks | hand-rolled `display: grid` |
| Time-axis label      | `Text size="sm" color="secondary">`          | raw `<span>` with typography CSS       |
| Row label            | `Text size="sm" weight="medium">`            | raw `<span>` with typography CSS       |
| Row label column     | `Box direction="column">` (sticky)           | hand-rolled flex CSS                   |
| Time-axis header     | `Box direction="row">` (sticky)              | hand-rolled flex CSS                   |
| Body wrapper         | `Box>` (scroll container)                    | raw `<div>` with overflow CSS          |

## API contract
```ts
interface TimelineRow<R> {
  id: string;
  label: ReactNode;
  data: R;
}

interface TimelineLayoutProps<R> extends HTMLAttributes<HTMLDivElement> {
  rows: TimelineRow<R>[];
  rangeStart: Date;
  rangeEnd: Date;
  renderTickLabel: (date: Date) => ReactNode;        // expected to return Text
  renderRow: (row: TimelineRow<R>, scale: (d: Date) => number) => ReactNode;
  rowHeight?: string;
  cornerLabel?: ReactNode;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Sticky time axis on top; sticky row labels on the leading edge        |
| empty          | `rows.length === 0` renders the axis with an empty body region        |
| many-rows      | Body scrolls vertically; axis stays pinned                            |
| wide-range     | Body scrolls horizontally; row labels stay pinned                     |

## Accessibility
- Root carries `role="region"` with `aria-label="Timeline"`
- Time axis exposes time tick labels in DOM order, even when visually pinned
- Each row is a `region` whose accessible name comes from its `label`
- Keyboard navigation: arrow keys move focus between rows; Home/End jump to range edges
- Color is never the sole encoding for event type — text or icon must accompany it (handled by `renderRow`)

## Tokens
- Inherits all tokens from `Grid`, `Box`, `Text`
- Adds (component tier): `--timeline-layout-row-height`, `--timeline-layout-axis-height`, `--timeline-layout-row-label-width`

## Do / Don't
```tsx
// DO
<TimelineLayout
  rows={services}
  rangeStart={start}
  rangeEnd={end}
  renderTickLabel={(d) => <Text size="sm">{format(d)}</Text>}
  renderRow={(r, scale) => <DeploymentRow data={r.data} scale={scale}/>}
/>

// DON'T — render row labels as raw spans
renderRow={(r) => <span>{r.label}</span>}

// DON'T — hand-roll the 4-region grid
<div style={{ display: "grid", gridTemplateAreas: "'c a' 'l b'" }}/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `TimelineLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders corner, axis, row labels, and body regions
- Body scroll keeps the axis and row label column pinned
- One row rendered per `rows` entry; row label rendered via `Text`
- `renderTickLabel` invoked across the visible range
- Composition probes: `Grid` at root; `Text` inside ticks/labels; `Box` around each region
- Forwards ref; spreads remaining props onto root
- axe-core passes with empty rows and with many rows
