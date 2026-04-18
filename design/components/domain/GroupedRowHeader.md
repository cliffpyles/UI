---
name: GroupedRowHeader
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, navigation-and-hierarchy]
uses: [Box, Text, Button, Icon]
replaces-raw: []
---

# GroupedRowHeader

> An aggregation row marking the start of a group, with the group name, a count, and a collapse toggle.

## Purpose
GroupedRowHeader is the canonical "group separator row" for grouped tables. It owns the visual distinction between a header row and a data row, the collapse/expand toggle, and the slot for summary metrics so every grouping in the product looks and behaves the same.

## When to use
- A `DataTable` grouped by a column (e.g., "Region: US", "Region: EU")
- A queue or inbox grouped by date or owner
- A grouped report that shows subtotals per group

## When NOT to use
- An expandable detail row for a single record → use **ExpandableRow**
- A standalone section header outside a table → use a `Text as="h3">` inside a `Box`
- The bulk-action bar → use **BulkActionBar**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2" justify="between">` inside the row's spanning cell | hand-rolled flex/gap in CSS |
| Group label     | `Text size="caption" weight="semibold">`               | raw styled `<span>`                  |
| Count / summary | `Text size="caption" color="muted">` formatted via `formatNumber` | inline `Intl.NumberFormat` |
| Collapse toggle | `Button variant="ghost" size="sm" iconOnly>` wrapping `Icon name={"chevron-right"|"chevron-down"}>` | raw `<button>` with `<svg>` |

## API contract
```ts
interface GroupedRowHeaderProps extends HTMLAttributes<HTMLTableRowElement> {
  label: string;
  count?: number;
  collapsed?: boolean;
  onToggle?: (next: boolean) => void;
  colSpan: number;
  summary?: ReactNode;                   // slot for subtotal / aggregate metrics
}
```
Forwarded ref targets the `<tr>`. Remaining props are spread onto the row.

## Required states
| State        | Behavior                                                                |
|--------------|-------------------------------------------------------------------------|
| default      | Renders label, count, and (when present) summary slot                   |
| collapsible  | `onToggle` set → chevron `Button` rendered; rotates on `collapsed`      |
| collapsed    | Chevron-right; `aria-expanded="false"`                                  |
| expanded     | Chevron-down; `aria-expanded="true"`                                    |
| static       | `onToggle` absent → no chevron rendered                                 |

## Accessibility
- Row has `role="row"` and uses a single spanning `<th scope="rowgroup">` for the label.
- Toggle `Button` carries `aria-expanded` and `aria-controls` pointing to the group's row container.
- Label + count are read together by screen readers ("Region US, 24 items").
- Summary content inherits its own a11y from the components it composes.

## Tokens
- Inherits all tokens from `Text`, `Button`, `Icon`, `Box`
- Adds (component tier): `--grouped-row-header-bg`, `--grouped-row-header-padding`

## Do / Don't
```tsx
// DO
<GroupedRowHeader
  label="Region: US"
  count={24}
  colSpan={cols.length}
  collapsed={isCollapsed}
  onToggle={setCollapsed}
  summary={<MetricValue value={subtotal} format="currency" />}
/>

// DON'T — bespoke chevron
<button onClick={toggle}>▶</button>

// DON'T — inline number formatting
<span>{count.toLocaleString()} items</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatNumber`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `Icon name="chevron-…"`)
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `label` and `count` render
- `onToggle` set renders the chevron `Button`; click invokes `onToggle`
- `collapsed` true sets `aria-expanded="false"` and chevron-right icon
- `summary` slot renders inside the header row
- `colSpan` is applied to the spanning cell
- Composition probe: `Button`, `Icon`, and `Text` resolve in the rendered output
- Forwards ref; spreads remaining props onto `<tr>`
- axe-core passes for collapsed and expanded states
