---
name: ChartHeader
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Text, Button, Menu]
replaces-raw: []
---

# ChartHeader

> The standard chart chrome — title, subtitle, time-range indicator, and an export/actions menu.

## Purpose
ChartHeader is the consistent "header strip" that sits above every chart in a dashboard. It owns the title and subtitle typography, the optional time-range or comparison label, and the trailing actions menu (export PNG, export CSV, view full screen, etc.). It does not own the chart itself; it sits above any of `CategoryChart`, `TimeSeriesChart`, `DistributionChart`, etc., to give them a uniform top edge.

## When to use
- Above every chart in an analytics dashboard
- Above any visualization that needs a title and an actions menu
- As the consistent "chart top" when stacking many charts together

## When NOT to use
- A page header (with breadcrumbs, primary action) — use a Page Header pattern
- A generic card header — use **Card**'s header slot
- A section divider with no actions — use **Text as="h3">** + **Divider**

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" justify="between" align="center" gap="3">`      | hand-rolled `display: flex` / `gap` in `.css`      |
| Title text          | `Text as="h3" size="md" weight="semibold">`                          | raw `<h3>` with font CSS                           |
| Subtitle text       | `Text size="sm" color="muted">`                                      | raw `<p>`                                          |
| Time-range label    | `Text size="sm" color="muted">` (often inside a `Box`)               | raw `<span>` with styling                          |
| Actions menu        | `Menu` triggered by a `Button variant="ghost" size="sm"`             | raw `<button>` + hand-rolled menu                  |

## API contract
```ts
interface ChartHeaderAction {
  id: string;
  label: string;
  icon?: IconName;
  onSelect: () => void;
  variant?: "default" | "destructive";
}

interface ChartHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  timeRangeLabel?: string;                    // e.g. "Last 30 days"
  actions?: ChartHeaderAction[];               // when provided, renders the kebab menu
  trailing?: ReactNode;                        // additional caller-supplied controls
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | Renders title; subtitle and time range when provided                      |
| with actions     | Renders a trailing actions `Menu`; closed by default                      |
| with trailing    | Caller-supplied node renders to the right of the time-range label         |
| no chrome        | When only `title` is set, the row collapses to title-only                 |

## Accessibility
- Title is a heading element via `Text as="h3">`
- Time-range label is associated with the chart via `aria-describedby` (caller wires this)
- Actions menu trigger has `aria-label="Chart actions"` when icon-only
- Tab order: title → trailing → actions menu

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--chart-header-row-gap`, `--chart-header-padding-y`
- No component-specific colors

## Do / Don't
```tsx
// DO
<ChartHeader
  title="Revenue by region"
  subtitle="USD, gross"
  timeRangeLabel="Last 30 days"
  actions={[
    { id: "csv", label: "Export CSV", onSelect: exportCsv },
    { id: "png", label: "Export PNG", onSelect: exportPng },
  ]}
/>

// DON'T — hand-rolled header
<div style={{ display: "flex", justifyContent: "space-between" }}>
  <h3>Revenue</h3>
  <button onClick={...}>...</button>
</div>

// DON'T — inline icon for actions
<button><svg>...</svg></button>
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
- Renders title; subtitle, time range, and actions render only when provided
- Actions menu opens, items invoke `onSelect`, menu closes on selection
- `trailing` slot renders caller-supplied content
- Title is a heading-level element
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Text` for title; `Menu` and `Button` for actions
- axe-core passes with and without actions
