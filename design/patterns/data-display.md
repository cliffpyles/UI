# Data Display

Tables, charts, and metrics are the core of data-intensive applications. Each has specific design requirements that go far beyond what typical component libraries provide.

## Tables

Tables are the hardest component in the system. A production data table is a small application with sorting, filtering, pagination, selection, inline editing, and virtual scrolling.

### Table Anatomy

```
┌─────────────────────────────────────────────────────┐
│ Table Header: Title, description, column controls   │
├──────┬───────────┬────────────┬──────────┬──────────┤
│  ☐   │ Name ↕    │ Status     │ Value ↕  │ Actions  │  ← Column headers (sticky)
├──────┼───────────┼────────────┼──────────┼──────────┤
│  ☐   │ Item A    │ ● Active   │ 1,234.56 │ ··· │
│  ☑   │ Item B    │ ○ Inactive │   456.78 │ ··· │
│  ☐   │ Item C    │ ● Active   │ 9,012.34 │ ··· │
├──────┴───────────┴────────────┴──────────┴──────────┤
│ Table Footer: Pagination, row count, selected count │
└─────────────────────────────────────────────────────┘
```

### Core Table Features

| Feature | Specification |
|---------|--------------|
| **Sorting** | Click column header to sort. Toggle between ascending, descending, and unsorted. Multi-column sort via shift+click. Sort indicators (↑↓) in header. |
| **Filtering** | Per-column filter controls (text search, select, date range depending on data type). Active filter indicators. "Clear all filters" action. |
| **Pagination** | Page size selector (10/25/50/100). Page navigation (first/prev/next/last). Total row count. "Showing X-Y of Z" label. |
| **Row selection** | Checkbox column. Select all (current page vs. all pages distinction). Selection count in footer/toolbar. |
| **Column resizing** | Drag column border to resize. Double-click to auto-fit to content. Minimum column width. |
| **Column reordering** | Drag column header to reorder. Persisted to user preferences. |
| **Sticky header** | Column headers remain visible when scrolling vertically. |
| **Sticky first column** | First column(s) remain visible when scrolling horizontally. |
| **Expandable rows** | Chevron to expand a row and reveal detail content below. |
| **Inline editing** | Click a cell to enter edit mode. Escape to cancel, Enter/Tab to confirm. |
| **Virtual scrolling** | For large datasets (1000+ rows), only render visible rows. Smooth scroll with consistent row heights. |

### Table Accessibility

- Semantic HTML: `<table>`, `<thead>`, `<tbody>`, `<th>` with `scope`.
- ARIA: `role="grid"` for interactive tables, `aria-sort` on sortable columns, `aria-selected` on selected rows.
- Keyboard: Arrow keys navigate cells, Enter activates a cell, Space toggles selection.

### Table Density

Tables support all three density levels. At compact density, row height is ~32px. At default, ~44px. At comfortable, ~56px. Cell padding adjusts accordingly.

## Charts

Data visualization is a first-class citizen, not an afterthought. Charts share a visual grammar with the rest of the system.

### Chart Grammar

Every chart has these structural elements:

| Element | Specification |
|---------|--------------|
| **Title** | Uses `font.size.lg`, `font.weight.semibold`. Optional subtitle in `color.text.secondary`. |
| **Axes** | Labels in `font.size.xs` or `font.size.sm`. Gridlines in `color.border.default` at 0.5px. Axis lines in `color.border.strong`. |
| **Legend** | Below or beside the chart. Uses system font and categorical colors. Interactive (click to toggle series). |
| **Tooltip** | Appears on hover/focus. Shows exact values. Uses `shadow.sm` and `color.background.surface.raised`. |
| **Empty state** | Chart frame with axes, centered message: "No data available" with optional guidance. |
| **Loading state** | Chart frame with skeleton pulse where data would appear. |
| **Error state** | Chart frame with error icon and message. Retry button. |

### Chart Colors

Charts use the categorical color palette. Series are assigned colors in order: blue, teal, amber, purple, pink, indigo, orange, cyan.

For sequential data (heatmaps, choropleth), use a single-hue ramp from the primary color (e.g., blue.50 → blue.900).

For diverging data (positive/negative), use blue → neutral → red (colorblind-safe).

### Responsive Charts

Charts must adapt to their container width:
- Labels may abbreviate or rotate at narrow widths.
- Legends move from beside to below the chart.
- Dense data may show fewer axis labels.
- Some chart types (complex multi-axis charts) may be replaced with a simpler variant or a "view full chart" action at narrow widths.

## Metrics

Metric displays are the most frequent data element in dashboards.

### Metric Card Anatomy

```
┌──────────────────────────┐
│ Revenue         ℹ️       │  ← Label + info tooltip
│ $1,234,567              │  ← Primary value (large, bold)
│ ▲ 12.3% vs last month  │  ← Trend indicator
│ ~~~~~~~~~~~~~~~~~~~~~~~~│  ← Optional sparkline
└──────────────────────────┘
```

### Metric Rules

- **Primary value** uses `font.size.2xl` or `font.size.3xl`, `font.weight.bold`, tabular numerals.
- **Trend indicators** include direction (▲/▼/—), magnitude (percentage or absolute), and comparison period. Never rely on color alone for trend direction.
- **Compact number formatting** for large values: 1.2K, 3.4M, 1.2B. Full value in tooltip.
- **Sparklines** are optional. When present, they use the same time range as the trend comparison.
- **Loading state**: Skeleton for value and trend. Label remains visible.
- **Error state**: Label visible, value area shows error indicator with retry.

## Data Formatting

All data formatting is centralized through formatting utilities, not handled per-component.

| Type | Utility | Handles |
|------|---------|---------|
| Numbers | `formatNumber()` | Thousands separators, decimal precision, compact notation |
| Currency | `formatCurrency()` | Symbol placement, decimal rules, locale |
| Percentages | `formatPercent()` | Decimal precision, sign (+/-) |
| Dates | `formatDate()` | Relative/absolute, locale-specific format |
| Duration | `formatDuration()` | Human-readable (2h 15m), compact (2:15) |
| File size | `formatBytes()` | KB/MB/GB with appropriate precision |

See [Internationalization](../standards/internationalization.md) for locale-specific formatting behavior.
