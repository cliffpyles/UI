---
name: ChartLegend
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Text, Button, Icon]
replaces-raw: []
---

# ChartLegend

> A legend listing chart series with color swatches and per-series toggle buttons.

## Purpose
ChartLegend is the shared legend control used by every chart in the system. It owns the layout of legend entries (horizontal or vertical), the swatch + label rendering, and the toggle behavior for hiding/showing a series. It does not own the chart itself or the series colors — colors come from chart tokens; the chart owns the source-of-truth series list and the visibility state.

## When to use
- Below or beside any multi-series chart
- Anywhere series visibility needs to be user-toggleable
- As the consistent "what do these colors mean" affordance across charts

## When NOT to use
- A generic "chip group" — use a `Box` of `Tag`s
- Selecting one series exclusively — use **Tabs** or **Select**
- Showing a single series — omit the legend entirely

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" wrap="wrap" gap="3">` or `direction="column"`    | hand-rolled `display: flex` / `gap` in `.css`      |
| Entry button        | `Button variant="ghost" size="sm">`                                  | raw `<button>` with manual aria-pressed wiring     |
| Color swatch        | `Icon name="square-filled">` colored via the series token             | inline `<span style={{ background: ... }}/>`      |
| Entry label         | `Text size="sm">`                                                    | raw `<span>` with font CSS                         |

## API contract
```ts
interface ChartLegendItem {
  id: string;
  label: string;
  color: string;                              // resolved from `--chart-series-*` token
  visible?: boolean;                          // defaults to true
  disabled?: boolean;                         // cannot be toggled
}

interface ChartLegendProps extends HTMLAttributes<HTMLDivElement> {
  items: ChartLegendItem[];
  orientation?: "horizontal" | "vertical";    // default "horizontal"
  onToggle?: (id: string, visible: boolean) => void;
  align?: "start" | "center" | "end";         // default "start"
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | All items shown with full-color swatches                                  |
| hidden series    | `visible: false` items render with reduced-opacity swatch and strikethrough label |
| disabled item    | `disabled: true` items render but cannot be toggled                       |
| keyboard nav     | Tab moves between items; Space/Enter toggles                              |
| no items         | Renders nothing (empty state is the chart's responsibility)               |

## Accessibility
- Root: `role="list"` with each item as `role="listitem"` containing a `Button`
- Each toggle button has `aria-pressed` reflecting `visible`
- The accessible name of the button is `"Toggle series <label>"`
- Disabled items expose `aria-disabled="true"` and are skipped by Tab when configured

## Tokens
- Series swatch colors come from `--chart-series-*` semantic tokens
- Adds: `--chart-legend-gap`, `--chart-legend-swatch-size`
- No component-specific colors

## Do / Don't
```tsx
// DO
<ChartLegend
  items={series.map(s => ({ id: s.id, label: s.label, color: s.color, visible: s.visible }))}
  onToggle={(id, v) => setVisibility(id, v)}
/>

// DON'T — hand-rolled legend
<ul><li><span style={{ background: "#ff0000" }}/> Revenue</li></ul>

// DON'T — using the legend as the only color encoding
<ChartLegend items={...}/>   // chart must also encode via patterns or labels
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` (use `Icon`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one entry per item with swatch and label
- Clicking an entry fires `onToggle(id, !visible)` and flips `aria-pressed`
- Hidden entries have reduced-opacity swatch and strikethrough label
- Disabled entries are not toggleable
- Keyboard (Space/Enter) toggles entries
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Button`, `Icon`, `Text` render per entry
- axe-core passes in default, with hidden series, and disabled
