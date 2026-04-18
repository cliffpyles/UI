---
name: ExpandableRow
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, navigation-and-hierarchy]
uses: [Box, Button, Icon]
replaces-raw: []
---

# ExpandableRow

> A table row that toggles a panel of additional content directly beneath it.

## Purpose
ExpandableRow owns the disclosure pattern for tabular data — the chevron control, the keyboard activation, the `aria-expanded` wiring, and the structure of the secondary content row. It exists so every drill-down inside a `DataTable` shares the same affordance and never re-implements the toggle.

## When to use
- A `DataTable` row that has additional details (line items, raw payload, JSON)
- Inbox-style rows that reveal a body when expanded
- Group/aggregate rows that drill down into their members

## When NOT to use
- A row that navigates to a detail page on click → use a clickable row + `Button` link
- A standalone collapsible section outside a table → use **Accordion**
- An aggregation header → use **GroupedRowHeader**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap="0">` for the expanded panel; `Box direction="row" align="center" gap="1">` for the toggle cell | hand-rolled flex/gap in CSS |
| Toggle control  | `Button variant="ghost" size="sm" iconOnly>` wrapping `Icon name={"chevron-right"|"chevron-down"}>` | raw `<button>` with `<svg>` |
| Toggle icon     | `Icon name={"chevron-right"|"chevron-down"}>`           | inline `<svg>` or unicode arrow      |
| Expanded panel  | `Box>` rendered as the next `<tr><td colSpan>`          | hand-rolled `<div>` with padding     |

## API contract
```ts
interface ExpandableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  expanded: boolean;
  onToggle: (next: boolean) => void;
  expandedContent: ReactNode;
  toggleLabel?: string;                  // aria-label for the toggle button
  colSpan: number;                       // span for the expanded panel row
  children: ReactNode;                   // the row's normal cells
}
```
Forwarded ref targets the visible `<tr>` (the row, not the panel). Remaining props are spread onto the row.

## Required states
| State      | Behavior                                                                  |
|------------|---------------------------------------------------------------------------|
| collapsed  | Chevron-right `Icon`; expanded panel not in DOM                            |
| expanded   | Chevron-down `Icon`; expanded panel `<tr>` rendered immediately after     |
| keyboard   | Toggle reachable via Tab; Enter/Space invoke `onToggle`                   |
| disabled   | `Button` disabled; `aria-disabled` reflected                              |

## Accessibility
- Toggle `Button` carries `aria-expanded` and `aria-controls` pointing to the panel id.
- Panel row carries `role="row"` and `id` matching `aria-controls`.
- `toggleLabel` defaults to "Expand row" / "Collapse row" based on state.
- Chevron icon swap is the visual signal; `aria-expanded` carries the semantic state.

## Tokens
- Inherits all tokens from `Button`, `Icon`, `Box`
- Adds (component tier): `--expandable-row-panel-padding`, `--expandable-row-panel-bg`

## Do / Don't
```tsx
// DO
<ExpandableRow
  expanded={isOpen}
  onToggle={setOpen}
  colSpan={cols.length + 1}
  expandedContent={<RowDetail row={row} />}
>
  <Table.Cell>{row.name}</Table.Cell>
  <Table.Cell>{row.total}</Table.Cell>
</ExpandableRow>

// DON'T — bespoke chevron button
<button onClick={toggle}><svg>…</svg></button>

// DON'T — clickable row instead of explicit toggle
<tr onClick={toggle}>…</tr>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `Icon name="chevron-…"`)
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Toggle click invokes `onToggle` with the next state
- Keyboard Enter/Space on the toggle invokes `onToggle`
- `expanded` true renders the panel `<tr>` with `colSpan` matching prop
- `aria-expanded` reflects `expanded` state
- `aria-controls` matches the panel id
- Composition probe: `Button` and `Icon` resolve as the toggle
- Forwards ref; spreads remaining props onto the visible `<tr>`
- axe-core passes for collapsed and expanded states
