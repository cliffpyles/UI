---
name: LabelPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Select, Tag, Button, Popover]
replaces-raw: []
---

# LabelPicker

> A multi-select control for applying colored labels to a record.

## Purpose
LabelPicker owns the "apply tags/labels" interaction — opening a searchable list, toggling selections, showing applied labels as removable chips, and (optionally) creating new labels inline. It standardizes how every product surface attaches labels so applied labels look the same across tables, cards, and detail panels.

## When to use
- Apply one or more labels to a task, document, or record
- Inline label management on a row or detail panel
- Replace ad-hoc multi-checkbox label menus

## When NOT to use
- Single-value classification → use **Select** with `Tag` items
- Status workflow → use **WorkflowStatePicker**
- Priority value → use **PriorityPicker**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1" wrap>` for the chip strip | hand-rolled flex/gap |
| Applied labels  | `Tag variant=…` (one per label) with `removable`         | raw styled chips        |
| Open trigger    | `Button variant="ghost" size="sm">`                      | raw `<button>`          |
| Floating panel  | `Popover>`                         | hand-rolled positioned `<div>`     |
| Search + list inside panel | `Select` (multi mode)   | raw `<input>` / raw `<ul>`         |

## API contract
```ts
interface Label { id: string; name: string; color: string }   // color is a token name, not a hex

interface LabelPickerProps extends HTMLAttributes<HTMLDivElement> {
  options: Label[];
  value: string[];                    // applied label ids
  onChange: (next: string[]) => void;
  onCreate?: (name: string) => Promise<Label> | Label;   // inline label creation
  disabled?: boolean;
  placeholder?: ReactNode;            // default "Add labels"
}
```
Component uses `forwardRef<HTMLDivElement, LabelPickerProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| empty        | No labels applied → renders trigger `Button` with placeholder     |
| applied      | Renders chips for each applied label                              |
| open         | `Popover` shows `Select` list with checkable options              |
| creating     | If `onCreate` set, search-with-no-match offers "Create '${q}'"    |
| disabled     | Chips visible, trigger and remove disabled                        |

## Accessibility
- Trigger `Button` has `aria-haspopup="listbox"` and `aria-expanded`.
- The internal `Select` carries combobox/listbox semantics — this component does not duplicate them.
- Each applied `Tag` has a remove control with `aria-label="Remove label ${name}"`.
- Color-only differentiation is forbidden — the label name is always rendered.

## Tokens
- Inherits chip color tokens from `Tag` variant set (variants are mapped from `Label.color`)
- Gap inherited from `Box`: `--space-1`
- No new tokens

## Do / Don't
```tsx
// DO
<LabelPicker options={labels} value={ids} onChange={setIds} onCreate={createLabel} />

// DON'T — color-only label
<Tag variant={l.color}>{/* no text */}</Tag>

// DON'T — hand-rolled menu
<Popover>{labels.map(l => <div onClick={…}>{l.name}</div>)}</Popover>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Empty state renders trigger with placeholder
- Selecting an option adds the label chip; deselecting removes it
- `onCreate` is invoked when no match exists and user confirms creation
- Removing a chip fires `onChange` with the remaining ids
- `disabled` prevents trigger and chip removal
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Popover"]`, `[data-component="Tag"]`, `[data-component="Select"]` resolve
- axe-core passes in empty, applied, and open states
