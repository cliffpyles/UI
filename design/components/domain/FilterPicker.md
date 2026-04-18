---
name: FilterPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search]
uses: [Box, Menu, Button, Text]
replaces-raw: []
---

# FilterPicker

> A dropdown for choosing which field to filter by.

## Purpose
FilterPicker is the "Add filter ▾" entry point in a filter bar. It owns the trigger button, the searchable field list, the grouping of fields by section (e.g. "Properties", "Activity", "People"), and the callback that hands the chosen field off to the surrounding query builder. It does not render the operator or value — that is the responsibility of the caller (typically composing `OperatorSelect` and `ValueInput`, or `QueryExpressionNode`).

## When to use
- The "Add filter" affordance above a table, list, or board
- A column-picker style menu of filterable attributes
- Any place where the user picks one of many fields to operate on

## When NOT to use
- Selecting a value for a form field — use **Select**
- A free-form text query — use **SearchInput**
- Editing an existing filter — use **OperatorSelect** + **ValueInput** (or **QueryExpressionNode**)
- Switching between saved filter sets — use **SavedViewPicker**

## Composition (required)
| Concern             | Use                                                              | Never                                              |
|---------------------|------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="1"` for sectioned content           | hand-rolled `display: flex` in `.css`              |
| Trigger             | `Button variant="ghost"` with leading icon                       | raw `<button>` with manual aria-expanded wiring    |
| Floating list       | `Menu` with `Menu.Item`, `Menu.Group`, `Menu.Separator`          | raw `<div role="menu">` and `<div role="menuitem">` |
| Field labels        | `Text size="sm">`                                                | raw `<span>` with font CSS                         |

## API contract
```ts
interface FilterField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "user" | "enum" | "boolean";
  group?: string;                    // section heading
  icon?: IconName;
  disabled?: boolean;
}

interface FilterPickerProps extends HTMLAttributes<HTMLDivElement> {
  fields: FilterField[];
  onSelect: (field: FilterField) => void;
  triggerLabel?: string;             // default "Add filter"
  placeholder?: string;              // search box placeholder, default "Find a field…"
  disabled?: boolean;
}
```
The component forwards its ref to the trigger element and spreads remaining props onto the root wrapper.

## Required states
| State        | Behavior                                                                 |
|--------------|--------------------------------------------------------------------------|
| closed       | Trigger renders normally; menu not in DOM                                |
| open         | Menu portals via `Popover` (provided by `Menu`); first item focused      |
| filtering    | Typing in the search slot narrows the visible items                      |
| empty result | When no fields match, an empty state message renders inside the menu     |
| disabled     | Trigger is disabled; menu cannot open                                    |

## Accessibility
- Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`
- Menu: `role="menu"` (delegated to `Menu`); group headings use `role="presentation"` with `aria-label` on the group
- Search slot is a labeled text field; results announce count via `aria-live="polite"`
- Escape closes and restores focus to the trigger

## Tokens
- Inherits all surface and spacing tokens from `Menu` and `Popover`
- Adds: `--filter-picker-section-gap`
- No component-specific colors

## Do / Don't
```tsx
// DO
<FilterPicker
  fields={availableFields}
  onSelect={(f) => addFilter(f)}
/>

// DON'T — building your own menu
<button onClick={() => setOpen(true)}>Add filter</button>
{open && <div className="menu">…</div>}

// DON'T — picking a value here
<FilterPicker onSelect={(f) => applyValue(f, "Open")}/>   // use ValueInput downstream
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
- Trigger opens and closes the menu via click and keyboard
- `onSelect` fires with the chosen field and closes the menu
- Search slot narrows the visible items; empty result renders message
- Grouped fields render with their section labels
- Disabled trigger does not open
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Menu` and `Button` render the surface and trigger
- axe-core passes in closed and open states
