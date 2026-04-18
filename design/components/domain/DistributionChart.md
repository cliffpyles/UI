---
name: DistributionChart
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, ChartTooltip, EmptyChart]
replaces-raw: []
---

# DistributionChart

> A histogram or density plot for the distribution of a continuous variable.

## Purpose
DistributionChart visualizes how values of a single continuous variable are distributed — counts per bucket (histogram) or smoothed density (kernel density estimate). It owns the SVG rendering of bars or the density curve, the bucket calculation (or the caller-supplied buckets), the axis labels, and the integration of `ChartTooltip` and `EmptyChart`. Chart chrome (header, export menu) is the responsibility of `ChartHeader` composed alongside.

## When to use
- Showing how a metric is distributed across the population (response times, deal sizes)
- Identifying skew, modality, or outliers in a continuous variable
- Comparing two distributions side-by-side via overlapping density curves

## When NOT to use
- Comparing across discrete categories — use **CategoryChart**
- Trends over time — use **TimeSeriesChart**
- Stage-by-stage drop-off — use **FunnelChart**

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="2">` for chart + chrome                  | hand-rolled flex in `.css`                         |
| Axis tick labels    | `Text size="xs" color="muted">`                                      | raw `<text>` with font CSS                         |
| SVG primitives      | `<svg>` rendering of marks (bars, density curve, axes) is permitted; chrome (header, tooltip) MUST use composed components | inline `<svg>` for chrome elements |
| Tooltip on hover    | `ChartTooltip`                                                        | hand-rolled floating div                           |
| Empty / no-data     | `EmptyChart`                                                          | inline empty JSX                                   |

## API contract
```ts
type DistributionMode = "histogram" | "density";

interface DistributionChartProps extends HTMLAttributes<HTMLDivElement> {
  values: number[];                            // raw observations
  mode?: DistributionMode;                     // default "histogram"
  bucketCount?: number;                        // histogram only; default Sturges' rule
  buckets?: { min: number; max: number; count: number }[];  // pre-computed buckets
  height?: number;                             // px, default 240
  loading?: boolean;
  formatValue?: (n: number) => string;
  emptyMessage?: string;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Renders bars (histogram) or filled curve (density)                    |
| loading      | Renders `Skeleton` placeholders matching chart dimensions              |
| empty        | When `values.length === 0` and no `buckets`, renders `EmptyChart`     |
| hover        | Bar/area hover shows `ChartTooltip` with bucket range and count       |
| custom buckets | When `buckets` is provided, `bucketCount` is ignored                |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing the distribution
- Bucket counts available as a visually-hidden table for screen readers
- Color alone never conveys meaning — labels and shapes back up encoding
- Keyboard: focusable buckets expose value and range via `aria-label`

## Tokens
- Mark fill comes from `--chart-series-1` by default
- Adds: `--distribution-chart-bar-gap`, `--distribution-chart-axis-color`
- No hardcoded colors

## Do / Don't
```tsx
// DO
<Box>
  <ChartHeader title="Response time distribution" timeRangeLabel="Last 24h"/>
  <DistributionChart values={responseTimes} mode="histogram" bucketCount={20}/>
</Box>

// DON'T — hand-rolled tooltip
<svg>...<rect onMouseEnter={...}/></svg>
{open && <div className="my-tooltip">...</div>}

// DON'T — using DistributionChart for categorical data
<DistributionChart values={[/* category counts */]}/>   // use CategoryChart
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatValue`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` for chrome elements (header, tooltip) — only the chart marks themselves may use `<svg>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Histogram renders one bar per bucket
- Density mode renders a single filled curve
- Pre-computed `buckets` override `bucketCount`
- Hovering a bar shows `ChartTooltip` with bucket range and count
- Empty `values` renders `EmptyChart`
- Loading renders `Skeleton`
- Forwards ref; spreads remaining props onto the root
- Composition probe: `ChartTooltip`, `EmptyChart` render in their states
- axe-core passes in default, empty, and loading
