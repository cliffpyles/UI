---
name: ChartTooltip
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Text]
replaces-raw: []
---

# ChartTooltip

> A unified tooltip surface for all chart types — series rows with swatch, label, and value.

## Purpose
ChartTooltip is the consistent "what am I hovering" surface across every chart in the system. It owns the tooltip surface (background, border, shadow, padding), the header row (typically the x-axis category or timestamp), the per-series rows (swatch, label, value), and the optional total/footer row. It does not own positioning — the chart positions the tooltip via its hover handlers — and it does not own value formatting (the caller passes pre-formatted strings via `MetricValue` or `formatValue`).

## When to use
- The hover-tooltip surface inside any `CategoryChart`, `TimeSeriesChart`, `DistributionChart`, `FunnelChart`, `HeatmapGrid`
- Custom chart-like visualizations needing a consistent hover surface

## When NOT to use
- A generic UI tooltip — use **Tooltip**
- A floating menu — use **Popover** + **Menu**
- A persistent annotation on the chart — render directly inside the SVG

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="1" padding="2">` plus row `Box`es per series | hand-rolled `display: flex` / `gap` in `.css`  |
| Header text         | `Text size="xs" weight="semibold">`                                  | raw `<span>` with font CSS                         |
| Series label / value | `Text size="xs">`                                                   | raw `<span>` with font CSS                         |
| Color swatch        | `Box width="2" height="2" radius="full">` with background from series token | inline `<span style={{ background }}/>`     |

## API contract
```ts
interface ChartTooltipRow {
  id: string;
  label: string;
  value: string;                               // pre-formatted by caller
  color: string;                               // from `--chart-series-*` tokens
  emphasized?: boolean;                        // bold the row (e.g. focused series)
}

interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {
  header?: string;                             // typically the x-axis category or timestamp
  rows: ChartTooltipRow[];
  footer?: ReactNode;                          // e.g. a total row
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | Renders header, one row per series, optional footer                       |
| emphasized row   | `emphasized: true` row renders with bold label                            |
| no rows          | Renders header only (caller decides whether to show at all)               |
| many rows        | Long lists scroll vertically with a max-height cap                        |

## Accessibility
- Root: `role="tooltip"` with `aria-live="polite"` so values announce on update
- The chart owns `aria-describedby` wiring to the tooltip's id
- Color is reinforced by label text — never the sole channel
- Tooltip surface itself is non-interactive (pointer-events: none) — caller is responsible

## Tokens
- Surface: `--chart-tooltip-bg`, `--chart-tooltip-border`, `--chart-tooltip-shadow`, `--chart-tooltip-radius`
- Spacing: `--chart-tooltip-padding`, `--chart-tooltip-row-gap`
- Series colors: `--chart-series-*`

## Do / Don't
```tsx
// DO
<ChartTooltip
  header="Mar 14, 2026"
  rows={[
    { id: "us", label: "United States", value: "$12,400", color: "var(--chart-series-1)" },
    { id: "eu", label: "Europe",        value: "$8,210",  color: "var(--chart-series-2)" },
  ]}
/>

// DON'T — formatting numbers inside the tooltip
<ChartTooltip rows={[{ label: "US", value: (12400).toLocaleString(), … }]}/>

// DON'T — hand-rolled tooltip surface
<div className="my-tooltip" style={{ background: "#222", padding: 8 }}>...</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (caller pre-formats)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator` if needed)
- Inline `<svg>` (use `Icon`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders header, rows, and footer when provided
- `emphasized` row renders with stronger weight
- Color swatch uses the row's `color` token
- `role="tooltip"` and `aria-live="polite"` present
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Box` and `Text` render the layout and labels
- axe-core passes
