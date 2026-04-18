---
name: TimeSeriesChart
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, ChartTooltip, ChartLegend, EmptyChart]
replaces-raw: []
---

# TimeSeriesChart

> A line or area chart for one or more series over a continuous time axis.

## Purpose
TimeSeriesChart is the canonical "trend over time" visualization — line charts, area charts, and stacked area charts for one or more series sharing a time axis. It owns the SVG rendering of lines and areas, the time axis (with appropriate tick density for the range), the y-axis scale, the crosshair on hover, and the integration of `ChartTooltip`, `ChartLegend`, and `EmptyChart`. Chart chrome (header, time-range picker, export menu) is the responsibility of `ChartHeader` composed alongside.

## When to use
- Trends over time (revenue per day, signups per week, latency per minute)
- Multi-series comparisons over the same time axis
- Stacked area charts for compositional trends

## When NOT to use
- Comparing across discrete categories — use **CategoryChart**
- Distribution of a single variable — use **DistributionChart**
- Stage-by-stage conversion — use **FunnelChart**
- A handful of points with no time meaning — use **CategoryChart**

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="2">` for chart + legend chrome           | hand-rolled flex in `.css`                         |
| Axis tick labels    | `Text size="xs" color="muted">`                                      | raw `<text>` with font CSS                         |
| SVG primitives      | `<svg>` rendering of marks (lines, areas, axes, crosshair) is permitted; chrome (header, legend, tooltip) MUST use composed components | inline `<svg>` for chrome elements |
| Tooltip on hover    | `ChartTooltip`                                                        | hand-rolled floating div                           |
| Legend              | `ChartLegend`                                                         | raw `<ul>` of swatches                             |
| Empty / no-data     | `EmptyChart`                                                          | inline empty JSX                                   |

## API contract
```ts
interface TimeSeriesPoint {
  t: string;                                   // ISO timestamp
  value: number;
}

interface TimeSeries {
  id: string;
  label: string;
  color?: string;                              // resolved from theme tokens by default
  data: TimeSeriesPoint[];
}

type TimeSeriesMode = "line" | "area" | "stacked-area";

interface TimeSeriesChartProps extends HTMLAttributes<HTMLDivElement> {
  series: TimeSeries[];
  mode?: TimeSeriesMode;                       // default "line"
  height?: number;                             // px, default 320
  loading?: boolean;
  showCrosshair?: boolean;                     // default true
  formatValue?: (n: number) => string;         // y-axis and tooltip formatter
  formatTime?: (t: string) => string;          // x-axis tick formatter
  emptyMessage?: string;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Renders one line/area per series with axes and legend                 |
| loading      | Renders `Skeleton` placeholders matching chart dimensions              |
| empty        | When all series are empty, renders `EmptyChart`                        |
| hover        | Crosshair follows the cursor; `ChartTooltip` shows all series at that x |
| series toggle | Clicking a `ChartLegend` entry hides/shows that series                |
| stacked      | `mode="stacked-area"` stacks series additively                        |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing the chart ("Line chart: revenue over the last 30 days")
- Linearized data available as a visually-hidden table for screen readers
- Color is never the sole encoding — line patterns or labels back up color differences
- Keyboard: arrow keys traverse the time axis; current point announced via `aria-live="polite"`

## Tokens
- Series colors from `--chart-series-*` semantic tokens
- Adds: `--time-series-line-width`, `--time-series-area-opacity`, `--time-series-axis-color`, `--time-series-crosshair-color`
- No hardcoded colors

## Do / Don't
```tsx
// DO
<Box>
  <ChartHeader title="Daily revenue" timeRangeLabel="Last 30 days"/>
  <TimeSeriesChart series={series} mode="line"/>
</Box>

// DO — stacked area for composition
<TimeSeriesChart series={series} mode="stacked-area"/>

// DON'T — formatting time/values inline
<TimeSeriesChart series={[{ data: data.map(d => ({ t: d.t, value: d.v.toLocaleString() })) }]}/>

// DON'T — using TimeSeriesChart for categorical axes
<TimeSeriesChart series={[{ data: [{ t: "Region A", value: 1 }] }]}/>   // use CategoryChart
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatValue`/`formatTime`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator`)
- Inline `<svg>` for chrome elements (header, legend, tooltip) — only the chart marks themselves may use `<svg>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one line/area per series
- `mode="area"` and `mode="stacked-area"` change the rendering
- Crosshair appears on hover when `showCrosshair` is true
- Hovering shows `ChartTooltip` with all series values at the cursor's x
- Toggling a `ChartLegend` entry hides/shows the series
- Empty data renders `EmptyChart`
- Loading renders `Skeleton`
- Forwards ref; spreads remaining props onto the root
- Composition probe: `ChartTooltip`, `ChartLegend`, `EmptyChart` all render in their states
- axe-core passes in default, empty, and loading
