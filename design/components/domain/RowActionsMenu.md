---
name: RowActionsMenu
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, navigation-and-hierarchy]
uses: [Box, Menu, Button, Icon]
replaces-raw: []
---

# RowActionsMenu

> A kebab menu in the trailing column of a row, exposing per-row actions (edit, duplicate, archive, delete).

## Purpose
RowActionsMenu is the canonical per-row overflow menu. It owns the icon-only kebab trigger, the menu surface, the destructive-action separation, and the positioning anchored to the trigger — so every table in the product offers the same row-level affordance and never re-rolls a popover.

## When to use
- The trailing column of a `DataTable` row
- A list-row component where actions are secondary to the row content
- Card grids where each card has 3+ actions

## When NOT to use
- A primary action that should always be visible → use a `Button` in the row
- Bulk actions across the selection → use **BulkActionBar**
- A toolbar above the table → use **DataTableToolbar**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box>` only as needed inside menu items                | hand-rolled flex/gap in CSS          |
| Trigger         | `Button variant="ghost" size="sm" iconOnly>` wrapping `Icon name="more-vertical">` | raw `<button>` with `<svg>` |
| Menu surface    | `Menu>`                                                | bespoke popover                      |
| Action item     | `Menu.Item>` with optional `Icon` leading              | raw clickable `<div>`                |
| Destructive item| `Menu.Item variant="danger">` after a `Menu.Separator>` | hand-rolled red row                |

## API contract
```ts
interface RowAction {
  id: string;
  label: string;
  icon?: ReactNode;             // composes <Icon> at call site
  destructive?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface RowActionsMenuProps extends HTMLAttributes<HTMLDivElement> {
  actions: RowAction[];
  triggerLabel?: string;        // default "Row actions"
  align?: "start" | "end";       // default "end"
}
```
Forwarded ref targets the root `<div>` wrapping the trigger. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                                |
|----------------|-------------------------------------------------------------------------|
| closed         | Trigger `Button` only                                                   |
| open           | `Menu` surfaces; first item focused; Escape closes                      |
| destructive    | Destructive items appear after a `Menu.Separator`; styled with danger token |
| disabled item  | Item rendered in disabled state, not selectable                         |
| empty actions  | Component renders nothing                                               |

## Accessibility
- Trigger `Button` carries `aria-label` from `triggerLabel` and `aria-haspopup="menu"`.
- `Menu` primitive provides focus trap, arrow-key navigation, Escape-to-close.
- Destructive items announce "destructive" via the `Menu.Item` primitive.
- Item activation closes the menu and returns focus to the trigger.

## Tokens
- Inherits all tokens from `Menu`, `Button`, `Icon`
- Adds (component tier): none

## Do / Don't
```tsx
// DO
<RowActionsMenu
  actions={[
    { id: "edit", label: "Edit", icon: <Icon name="edit" />, onSelect: edit },
    { id: "duplicate", label: "Duplicate", onSelect: duplicate },
    { id: "delete", label: "Delete", destructive: true, onSelect: remove },
  ]}
/>

// DON'T — bespoke kebab popover
<button onClick={toggle}>⋮</button>
{open && <div className="popover">…</div>}

// DON'T — raw clickable div for items
<div onClick={edit}>Edit</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `actions.length === 0` renders nothing
- Trigger click opens the `Menu`; Escape closes
- Selecting an item invokes its `onSelect` and closes the menu
- Destructive items rendered after a separator with danger styling
- Disabled items are not selectable
- Trigger `aria-label` matches `triggerLabel`
- Composition probe: `Menu`, `Button`, `Icon` resolve in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for closed and open states
