---
name: FunnelChart
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, ChartTooltip, EmptyChart]
replaces-raw: []
---

# FunnelChart

> A multi-stage funnel showing volume and conversion rate at each step.

## Purpose
FunnelChart visualizes a sequential conversion process — visitors → signups → activated → paid. It owns the SVG rendering of the funnel bars (stage rectangles, optional trapezoid taper), the per-stage volume label, the conversion rate from the previous stage, and the integration of `ChartTooltip` and `EmptyChart`. Chart chrome (header, time range, export) is the responsibility of `ChartHeader` composed alongside.

## When to use
- Conversion funnels (sign-up flows, checkout flows, onboarding sequences)
- Sales pipelines with sequential stages
- Any sequential drop-off visualization

## When NOT to use
- Comparing categories that are not sequential — use **CategoryChart**
- Time-based trends — use **TimeSeriesChart**
- Single distribution of values — use **DistributionChart**
- 2D density across two dimensions — use **HeatmapGrid**

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="2">` for chart + chrome                  | hand-rolled flex in `.css`                         |
| Stage labels        | `Text size="sm" weight="medium">`                                    | raw `<text>` with font CSS                         |
| Conversion rate     | `Text size="xs" color="muted">` (rate is pre-formatted by caller)    | inline `(n).toLocaleString()` formatting           |
| SVG primitives      | `<svg>` rendering of marks (stage rectangles, connectors) is permitted; chrome (header, tooltip) MUST use composed components | inline `<svg>` for chrome elements |
| Tooltip on hover    | `ChartTooltip`                                                        | hand-rolled floating div                           |
| Empty / no-data     | `EmptyChart`                                                          | inline empty JSX                                   |

## API contract
```ts
interface FunnelStage {
  id: string;
  label: string;
  value: number;                               // raw count at this stage
}

interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
  stages: FunnelStage[];                       // ordered top-to-bottom (or left-to-right)
  orientation?: "vertical" | "horizontal";     // default "vertical"
  height?: number;                             // px, default 320
  loading?: boolean;
  formatValue?: (n: number) => string;         // count formatter; delegates to MetricValue
  formatRate?: (n: number) => string;          // rate formatter; delegates to Percentage
  emptyMessage?: string;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Renders one stage per entry with volume and step-over-step conversion |
| loading      | Renders `Skeleton` placeholders matching chart dimensions             |
| empty        | When `stages.length === 0`, renders `EmptyChart`                      |
| hover        | Stage hover shows `ChartTooltip` with volume and conversion           |
| zero-value top | When the first stage is 0, all conversions render as `—`            |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing the funnel
- Linearized stage data available as a visually-hidden table for screen readers
- Conversion rate is announced as text, not implied by visual size
- Keyboard: focusable stages expose volume and conversion rate via `aria-label`

## Tokens
- Stage fill from a graduated `--chart-funnel-stage-*` token sequence
- Adds: `--funnel-chart-stage-gap`, `--funnel-chart-axis-color`
- No hardcoded colors

## Do / Don't
```tsx
// DO
<Box>
  <ChartHeader title="Signup funnel"/>
  <FunnelChart stages={[
    { id: "visit", label: "Visited", value: 12400 },
    { id: "signup", label: "Signed up", value: 3210 },
    { id: "active", label: "Activated", value: 980 },
    { id: "paid", label: "Paid", value: 220 },
  ]}/>
</Box>

// DON'T — computing/formatting rate inline
<FunnelChart stages={[…]}/>
<span>{(220 / 12400 * 100).toFixed(1)}%</span>

// DON'T — using FunnelChart for non-sequential categories
<FunnelChart stages={[{ label: "Region A", value: 100 }, { label: "Region B", value: 50 }]}/>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatValue`/`formatRate`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator`)
- Inline `<svg>` for chrome elements (header, tooltip) — only the chart marks themselves may use `<svg>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one stage per `stages` entry
- Step-over-step conversion is computed and passed to the formatter
- `orientation` swaps vertical/horizontal layout
- Hovering a stage shows `ChartTooltip` with volume and conversion
- Empty `stages` renders `EmptyChart`
- Zero-volume top stage renders all conversions as `—`
- Loading renders `Skeleton`
- Forwards ref; spreads remaining props onto the root
- Composition probe: `ChartTooltip`, `EmptyChart` render in their states
- axe-core passes in default, empty, and loading
