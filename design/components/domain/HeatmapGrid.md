---
name: HeatmapGrid
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Grid, Text, ChartTooltip, EmptyChart]
replaces-raw: []
---

# HeatmapGrid

> A 2D matrix where cell color encodes the value at the (row, column) intersection.

## Purpose
HeatmapGrid visualizes a value across two discrete dimensions — day-of-week × hour-of-day, region × product, cohort × week. Unlike the SVG-based charts, the cell matrix is a true 2D layout best expressed with `Grid`. The component owns the row/column header rendering, the cell color scale (linear or quantized), the per-cell hover surface, and the integration of `ChartTooltip` and `EmptyChart`. Chrome (header, legend) sits around the matrix as composed `Box` content.

## When to use
- Time-of-day vs day-of-week activity heatmaps
- Cohort retention grids (cohort × period)
- Confusion matrices and other category × category density views
- Geographic-style binned grids (lat/lng buckets)

## When NOT to use
- A single-axis distribution — use **DistributionChart**
- Trends over a single time axis — use **TimeSeriesChart**
- Comparing values across one categorical axis — use **CategoryChart**
- A list of items with status colors — use **Table** with status `Tag`s

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Surrounding chrome (header, legend, axis labels) | `Box direction="column" gap="2">` and `Box direction="row">` for axis rows | hand-rolled flex in `.css` |
| 2D cell matrix      | `Grid` with `columns` set to the column count and one cell per (row, col) intersection | hand-rolled `display: grid` in `.css` or nested flex rows |
| Row / column labels | `Text size="xs" color="muted">`                                      | raw `<th>` / `<span>` with font CSS                |
| Tooltip on hover    | `ChartTooltip`                                                        | hand-rolled floating div                           |
| Empty / no-data     | `EmptyChart`                                                          | inline empty JSX                                   |

`Grid` is used here precisely because the cell matrix is an inherently 2D structure — the layout is the data. All other composition (axis labels, legend, header) uses `Box`.

## API contract
```ts
interface HeatmapCell {
  row: string;
  column: string;
  value: number | null;                        // null → renders as a "no data" cell
}

type ColorScale = "sequential" | "diverging" | "quantized";

interface HeatmapGridProps extends HTMLAttributes<HTMLDivElement> {
  rows: string[];                              // ordered row labels
  columns: string[];                           // ordered column labels
  cells: HeatmapCell[];
  colorScale?: ColorScale;                     // default "sequential"
  steps?: number;                              // for "quantized"; default 5
  min?: number;                                // domain min override
  max?: number;                                // domain max override
  loading?: boolean;
  formatValue?: (n: number) => string;
  emptyMessage?: string;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Renders the matrix with cells colored by value                        |
| loading      | Renders `Skeleton` placeholders matching grid dimensions              |
| empty        | When `cells` is empty, renders `EmptyChart`                           |
| no-data cell | `value === null` cells render with a neutral pattern (not a color)    |
| hover        | Cell hover shows `ChartTooltip` with row, column, and value           |

## Accessibility
- Root: `role="img"` with `aria-label` summarizing the heatmap
- Linearized cell data available as a visually-hidden table for screen readers
- Color is reinforced by the tooltip value text — never the sole channel
- Keyboard: focusable cells expose row, column, and value via `aria-label`; arrow keys traverse the grid

## Tokens
- Cell colors come from `--chart-heatmap-sequential-*`, `--chart-heatmap-diverging-*` token scales
- Adds: `--heatmap-grid-cell-size`, `--heatmap-grid-cell-gap`, `--heatmap-grid-axis-color`
- No hardcoded colors

## Do / Don't
```tsx
// DO
<HeatmapGrid
  rows={daysOfWeek}
  columns={hoursOfDay}
  cells={activity}
  colorScale="sequential"
/>

// DON'T — using HeatmapGrid for one-dimensional data
<HeatmapGrid rows={["all"]} columns={categories} cells={oneRow}/>   // use CategoryChart

// DON'T — hardcoding cell colors
<div style={{ background: value > 50 ? "#ff0000" : "#ffaaaa" }}/>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatValue`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` (the heatmap is built from `Grid` + `Box`, not SVG)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders rows × columns cells
- Cell color reflects value relative to `[min, max]` domain
- `value === null` cells render with the no-data pattern
- `colorScale` switches between sequential, diverging, quantized
- Hovering a cell shows `ChartTooltip` with row, column, and value
- Keyboard arrow keys traverse the grid
- Empty `cells` renders `EmptyChart`
- Loading renders `Skeleton`
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Grid` renders the matrix; `ChartTooltip` and `EmptyChart` render in their states
- axe-core passes in default, empty, and loading
