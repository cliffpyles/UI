---
name: PivotLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, Text]
replaces-raw: []
---

# PivotLayout

> A two-dimensional matrix of cells with sticky row and column headers and dual-axis scroll.

## Purpose
PivotLayout is the canonical 2D matrix surface — pivot tables, cohort grids, cross-tabulations, retention matrices. It owns the corner/row-header/column-header/cell-body grid structure, the sticky behavior of both header axes, and the dual-axis scroll containment, so every pivot-shaped surface in the product looks and behaves the same regardless of which values fill the cells.

## When to use
- Cross-tabulating values across two dimensions
- Cohort analysis or retention matrices
- Any surface where users must read across both row and column headers

## When NOT to use
- A geo-aggregated heatmap → use **HeatmapGrid** inside a regular page
- A flat list of records → use **DataGridLayout**
- Independent visualizations → use **ChartGridLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with `corner`/`columnHeaders`/`rowHeaders`/`body` named tracks | hand-rolled `display: grid` |
| Header label         | `Text size="sm" weight="medium">`            | raw `<span>` with typography CSS       |
| Row header wrapper   | `Box direction="column">` (sticky)           | hand-rolled flex CSS                   |
| Column header wrapper| `Box direction="row">` (sticky)              | hand-rolled flex CSS                   |
| Cell body wrapper    | `Box>` (scroll container, both axes)         | raw `<div>` with overflow CSS          |

## API contract
```ts
interface PivotAxis<H> {
  headers: H[];
  renderHeader: (header: H) => ReactNode;     // expected to render Text
}

interface PivotLayoutProps<RH, CH> extends HTMLAttributes<HTMLDivElement> {
  rows: PivotAxis<RH>;
  columns: PivotAxis<CH>;
  renderCell: (row: RH, column: CH, rIndex: number, cIndex: number) => ReactNode;
  cornerLabel?: ReactNode;
  cellMinWidth?: string;
  cellMinHeight?: string;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | All four regions render; row + column headers stay sticky during scroll |
| empty          | Either axis with `headers.length === 0` renders an empty body region   |
| many-cells     | Body scrolls in both axes; headers remain pinned                       |
| narrow viewport| Cell min width preserved; horizontal scroll engages                    |

## Accessibility
- Root carries `role="grid"` with `aria-label`
- Column headers carry `role="columnheader"`; row headers carry `role="rowheader"`
- Body cells carry `role="gridcell"`
- Keyboard navigation: arrow keys move between cells; Home/End jump to row edges; Page Up/Down jump by viewport
- Sticky headers maintain semantic association via DOM order

## Tokens
- Inherits all tokens from `Grid`, `Box`, `Text`
- Adds (component tier): `--pivot-layout-cell-min-width`, `--pivot-layout-cell-min-height`, `--pivot-layout-header-gap`

## Do / Don't
```tsx
// DO
<PivotLayout
  rows={{ headers: weeks, renderHeader: (w) => <Text>{w.label}</Text> }}
  columns={{ headers: cohorts, renderHeader: (c) => <Text>{c.label}</Text> }}
  renderCell={(w, c) => <RetentionCell value={lookup(w, c)} />}
/>

// DON'T — render headers as raw spans
renderHeader={(h) => <span>{h.label}</span>}

// DON'T — hand-roll the four-region grid
<div style={{ display: "grid", gridTemplateAreas: "'corner cols' 'rows body'" }}/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `PivotLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders corner, column headers, row headers, and body regions
- Body scroll keeps both header axes pinned
- Arrow-key navigation moves the focused cell within the body
- Composition probes: `Grid` at root; `Text` inside headers; `Box` around each region
- Forwards ref; spreads remaining props onto root
- axe-core passes; `role="grid"` semantics verified
