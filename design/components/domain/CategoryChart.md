---
name: CategoryChart
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, ChartTooltip, ChartLegend, EmptyChart]
replaces-raw: []
---

# CategoryChart

> A bar or column chart for comparing values across discrete categories.

## Purpose
CategoryChart is the canonical "compare across categories" visualization — bar charts (horizontal) and column charts (vertical) for one or more series. It owns the SVG rendering of bars/columns, the axis scales, the category and value labels, the grouped vs stacked layout, and the integration of the shared `ChartTooltip`, `ChartLegend`, and `EmptyChart` components. Chart chrome (header, time-range picker, export menu) is the responsibility of `ChartHeader` composed alongside.

## When to use
- Comparing a metric across categorical groups (regions, plans, statuses)
- Showing top-N rankings as a horizontal bar chart
- Multi-series category comparisons (grouped or stacked)

## When NOT to use
- Trends over continuous time — use **TimeSeriesChart**
- Distribution of a continuous variable — use **DistributionChart**
- Stage-by-stage conversion — use **FunnelChart**
- 2D density across two dimensions — use **HeatmapGrid**

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="2"` for chart + legend chrome           | hand-rolled flex in `.css`                         |
| Axis tick labels    | `Text size="xs" color="muted">`                                      | raw `<text>` with font CSS                         |
| SVG primitives      | `<svg>` rendering of marks (bars, axes) is permitted; chrome (header, legend, tooltip) MUST use composed components | inline `<svg>` for chrome elements |
| Tooltip on hover    | `ChartTooltip`                                                        | hand-rolled floating div                           |
| Legend              | `ChartLegend`                                                         | raw `<ul>` of swatches                             |
| Empty / no-data     | `EmptyChart`                                                          | inline empty JSX                                   |

## API contract
```ts
interface CategorySeries {
  id: string;
  label: string;
  color?: string;                              // resolved from theme tokens by default
  data: { category: string; value: number }[];
}

interface CategoryChartProps extends HTMLAttributes<HTMLDivElement> {
  series: CategorySeries[];
  orientation?: "vertical" | "horizontal";     // default "vertical"
  layout?: "grouped" | "stacked";              // default "grouped" for multi-series
  height?: number;                             // px, default 320
  loading?: boolean;
  formatValue?: (n: number) => string;         // delegates to MetricValue/formatNumber
  emptyMessage?: string;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Renders bars/columns with axes and legend                              |
| loading      | Renders `Skeleton` placeholders matching chart dimensions              |
| empty        | When all series are empty, renders `EmptyChart`                        |
| hover        | Bar hover shows `ChartTooltip` anchored to the bar                     |
| series toggle | Clicking a `ChartLegend` entry hides/shows that series                |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing the chart ("Category chart: revenue by region")
- A linearized data table is rendered visually hidden (`VisuallyHidden`) for screen readers
- Color is never the sole encoding — patterns or labels back up color differences
- Keyboard: focusable bars expose value via `aria-label`; arrow keys traverse categories

## Tokens
- Series colors come from a fixed `--chart-series-*` palette (semantic tokens)
- Adds: `--category-chart-bar-gap`, `--category-chart-axis-color`
- No hardcoded hex values for series colors

## Do / Don't
```tsx
// DO
<Box>
  <ChartHeader title="Revenue by region" />
  <CategoryChart series={series} orientation="vertical" />
</Box>

// DON'T — hand-rolling tooltip
<svg>...<g onMouseEnter={() => setOpen(true)}>...</g></svg>
{open && <div className="my-tooltip">...</div>}

// DON'T — using CategoryChart for time series
<CategoryChart series={[{ data: [{ category: "2026-01-01", value: 1 }, …] }]}/>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatValue` prop or `MetricValue`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator`)
- Inline `<svg>` for chrome elements (legend, tooltip, header) — only the chart marks themselves may use `<svg>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one bar per category per series
- `orientation` swaps vertical/horizontal layout
- `layout="stacked"` stacks values; `"grouped"` clusters them
- Hovering a bar shows `ChartTooltip` with formatted value
- Toggling a `ChartLegend` entry hides/shows the series
- Empty data renders `EmptyChart`
- Loading renders `Skeleton`
- Forwards ref; spreads remaining props onto the root
- Composition probe: `ChartTooltip`, `ChartLegend`, `EmptyChart` all render in their states
- axe-core passes in default, empty, and loading
