---
name: EmptyChart
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, EmptyState]
replaces-raw: []
---

# EmptyChart

> The empty state for a chart with no data — a chart-shaped container wrapping `EmptyState`.

## Purpose
EmptyChart is the standardized "no data to show" surface for any chart. It owns the chart-sized wrapper that keeps the page layout from collapsing when a chart has no data, and it composes `EmptyState` for the message, illustration, and call-to-action. It is what every chart component renders in its `empty` state, and it is also usable directly when callers want to render an empty chart slot before data is loaded.

## When to use
- Inside any chart's empty state (always — every chart in this system delegates to EmptyChart)
- As a placeholder slot when a chart's data has not been requested yet
- When an analytics module has all charts empty for a given date range

## When NOT to use
- Empty states for tables, lists, or pages — use **EmptyState** directly
- Loading states — use a chart-specific `Skeleton`
- Error states — use **ErrorState** inside the same chart-sized container

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" align="center" justify="center" padding="6">` sized to the chart's height | hand-rolled flex in `.css`        |
| Message + illustration + action | `EmptyState`                                              | inline empty JSX                                   |

## API contract
```ts
interface EmptyChartProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;                             // px, matches the chart it replaces; default 240
  title?: string;                              // default "No data to display"
  description?: string;                        // default "There is no data for the selected range."
  action?: ReactNode;                          // optional CTA button
  illustration?: ReactNode;                    // override the default empty illustration
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | Renders the default title, description, and illustration via `EmptyState` |
| with action      | Renders the supplied `action` slot below the description                  |
| custom message   | `title`/`description` override defaults                                   |
| sized            | `height` constrains the container so layout does not jump on data load    |

## Accessibility
- Root: `role="status"` so screen readers announce the empty state
- All semantics are inherited from `EmptyState` (heading, description, action region)
- `EmptyChart` does not add its own ARIA on top of `EmptyState`

## Tokens
- Inherits all visual tokens from `EmptyState`
- Adds: `--empty-chart-min-height`
- No component-specific colors

## Do / Don't
```tsx
// DO — used internally by a chart
{data.length === 0 ? <EmptyChart height={320}/> : <CategoryChart series={data}/>}

// DO — as a placeholder
<EmptyChart height={320} title="Pick a date range" description="Choose a range above to see data."/>

// DON'T — hand-rolled empty state
<div style={{ height: 320 }}><p>No data</p></div>

// DON'T — using EmptyChart for non-chart contexts
<EmptyChart/>   // outside a chart slot — use EmptyState directly
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` (use `Icon` or pass `illustration`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Default renders title, description, and illustration via `EmptyState`
- `title`, `description`, `action`, `illustration` props override defaults
- `height` applies to the container so layout doesn't collapse
- `role="status"` is present
- Forwards ref; spreads remaining props onto the root
- Composition probe: `EmptyState` is rendered inside the container
- axe-core passes in default and with-action variants
