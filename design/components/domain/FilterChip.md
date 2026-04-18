---
name: FilterChip
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search]
uses: [Box, Text, Button, Icon]
replaces-raw: []
---

# FilterChip

> A pill that shows one active filter (field + operator + value) with a remove affordance.

## Purpose
FilterChip is the visual representation of a single applied filter in a filter bar — "Status is Open", "Owner is Alice", "Created after 2026-01-01". It owns the field/operator/value layout, the truncation behavior for long values, and the remove button that drops the filter from the active set. Editing the filter is delegated to a popover the caller mounts; FilterChip is purely the chip itself.

## When to use
- Showing applied filters above a list, table, or board
- Representing a saved-search criterion that can be removed inline
- Faceted-search interfaces where multiple chips compose into a query

## When NOT to use
- A static label or category — use **Tag**
- A free-form text query — use **SearchInput**
- Building the filter (field-picker UI) — use **FilterPicker**
- A single-state on/off toggle — use **Toggle** or **Checkbox**

## Composition (required)
The implementation MUST build from these components. Reimplementing any row is a violation.

| Concern             | Use                                                                         | Never                                              |
|---------------------|-----------------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" align="center" gap="2"`                                | hand-rolled `display: flex` / `gap` in `.css`      |
| Field/operator/value text | `Text size="sm">` with weight variants for the field name             | raw `<span>` with font CSS                         |
| Remove control      | `Button variant="ghost" size="sm"` icon-only                                | raw `<button>` with manual aria                    |
| Remove glyph        | `Icon name="x">`                                                            | inline `<svg>` or `×` glyph                        |

## API contract
```ts
interface FilterChipProps extends HTMLAttributes<HTMLDivElement> {
  field: string;                            // human label, e.g. "Status"
  operator: string;                         // e.g. "is", "contains", "after"
  value: ReactNode;                         // pre-formatted value (string, Avatar, Tag, etc.)
  onRemove?: () => void;                    // when omitted, no remove button
  onEdit?: () => void;                      // when set, the chip body is clickable
  invalid?: boolean;                        // value no longer satisfies field type
  disabled?: boolean;
}
```
The component forwards its ref to the root `<div>` and spreads remaining props onto it.

## Required states
| State     | Behavior                                                                 |
|-----------|--------------------------------------------------------------------------|
| default   | Renders `field operator value` with remove button                        |
| editable  | `onEdit` set → body is a `Button variant="ghost">`; remove stays separate |
| invalid   | Visual variant signaling the value is stale; tooltip explains            |
| disabled  | No remove or edit; reduced opacity                                       |
| truncated | Long values truncate with ellipsis; full value in `title`                |

## Accessibility
- Root: `role="group"` with `aria-label` summarizing the filter (`"Filter: Status is Open"`)
- Remove `Button`: `aria-label="Remove filter <field>"`
- When `invalid`, the chip exposes `aria-invalid="true"` and the tooltip is reachable by keyboard
- Edit affordance is keyboard-activatable via the underlying `Button`

## Tokens
- Inherits chip surface tokens from a shared `--chip-*` set (background, border, radius)
- Adds: `--filter-chip-gap`, `--filter-chip-padding-x`, `--filter-chip-padding-y`
- No component-specific colors beyond the invalid variant which uses `--color-status-danger-*`

## Do / Don't
```tsx
// DO
<FilterChip
  field="Status"
  operator="is"
  value="Open"
  onRemove={() => removeFilter("status")}
/>

// DO — value can be a richer node
<FilterChip field="Owner" operator="is" value={<Avatar size="xs" name="Alice"/>} onRemove={drop}/>

// DON'T — hand-rolled chip
<div className="chip">Status: Open <span onClick={drop}>×</span></div>

// DON'T — building the editor inside the chip
<FilterChip>...<Popover>...</Popover></FilterChip>
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
- Renders field, operator, and value
- `onRemove` fires when remove button is activated by click and Enter/Space
- `onEdit` makes the body keyboard-activatable
- `invalid` exposes `aria-invalid="true"`
- `disabled` hides remove and edit affordances
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Button` and `Icon` render the remove control
- axe-core passes in default, invalid, disabled
