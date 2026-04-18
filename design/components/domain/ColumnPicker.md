---
name: ColumnPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, navigation-and-hierarchy]
uses: [Box, Menu, Checkbox, Button]
replaces-raw: []
---

# ColumnPicker

> A menu for showing, hiding, and reordering table columns, with persistence hooks.

## Purpose
ColumnPicker owns the canonical UX for managing column visibility on a `DataTable`. It exposes a checklist of columns, supports drag-to-reorder, and provides a "reset to defaults" action — so every table in the product offers the same column-management affordance.

## When to use
- Inside a `DataTableToolbar` when the table has 6+ columns
- Any table where users will reasonably want to hide noise
- Surfaces where column preferences should persist per user

## When NOT to use
- Tables with fewer than 4 columns where hiding adds no value
- Pivot/cube tables where columns are dynamic — use a dedicated pivot UI
- A general "settings" menu (use **Menu** directly)

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap="1">` inside the menu surface | hand-rolled flex/gap in CSS       |
| Trigger         | `Button variant="ghost" iconLeading={Icon}>`           | raw `<button>`                       |
| Menu surface    | `Menu>`                                                | bespoke popover                      |
| Each option     | `Menu.Item>` containing `Checkbox`                     | raw `<input type="checkbox">`        |
| Reset action    | `Button variant="ghost" size="sm">`                    | raw `<button>`                       |

## API contract
```ts
interface ColumnDescriptor {
  id: string;
  label: string;
  required?: boolean;       // cannot be hidden
}

interface ColumnPickerProps extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDescriptor[];
  visible: string[];                      // currently visible column ids, in order
  onChange: (visible: string[]) => void;  // emits on toggle and reorder
  onReset?: () => void;                   // when present, "Reset" action shown
  reorderable?: boolean;                  // default true
  triggerLabel?: string;                  // default "Columns"
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                                |
|----------------|-------------------------------------------------------------------------|
| closed         | Trigger `Button` with column count badge                                |
| open           | `Menu` surfaces the checklist; first focus on the trigger close target  |
| reorderable    | Each row has a drag handle; keyboard reorder via Alt+ArrowUp/Down       |
| required column| Checkbox disabled with helper "Required" text                           |
| reset          | `onReset` invoked; visible state emitted via `onChange`                 |

## Accessibility
- Trigger button announces "Columns, N of M visible".
- `Menu` carries focus trap and Escape-to-close from its primitive.
- Each option is reachable by Tab; checkbox state announced via the `Checkbox` primitive.
- Keyboard reorder: Alt+ArrowUp/Alt+ArrowDown moves the focused option; live region announces the new position.

## Tokens
- Inherits all tokens from `Menu`, `Button`, `Checkbox`
- Adds (component tier): `--column-picker-row-gap`, `--column-picker-handle-size`

## Do / Don't
```tsx
// DO
<ColumnPicker
  columns={cols}
  visible={visibleIds}
  onChange={setVisibleIds}
  onReset={resetCols}
/>

// DON'T — bespoke checklist popover
<div className="popover">
  {cols.map(c => <label><input type="checkbox" /> {c.label}</label>)}
</div>

// DON'T — raw input checkbox inside the menu
<Menu.Item><input type="checkbox" /> Name</Menu.Item>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Toggling a checkbox emits `onChange` with updated `visible` array
- `required` columns render a disabled `Checkbox`
- `onReset` invocation emits a reset `onChange`
- Keyboard reorder (Alt+ArrowUp/Down) updates `visible` order
- Trigger label includes "N of M visible"
- Composition probe: `Menu`, `Checkbox`, and `Button` resolve in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for closed and open states
