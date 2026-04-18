---
name: Menu
tier: base
level: 3
status: stable
since: 0.4.0
patterns: []
uses: [Box, Popover, Text, Divider]
replaces-raw: ["<div role=\"menu\">", "<div role=\"menuitem\">"]
---

# Menu

> A keyboard-navigable list of actions revealed by a trigger — the canonical action menu.

## Purpose
Menu owns the ARIA menu pattern: trigger → menu list → items, with focus management, roving tabindex, type-ahead, Escape handling, and outside-click close. It composes `Popover` for the floating positioning so all popups in the system share placement, portal, and dismissal logic.

## When to use
- A row's "more actions" overflow (`⋮` button)
- A toolbar's secondary action group
- A user-account menu hanging off an Avatar

## When NOT to use
- A single-select dropdown of values → use **Select** (base) or **Combobox** (composite)
- A non-interactive popover (info, form, filter) → use **Popover** directly
- Nested navigation tree → use **NavTree** (domain)
- A modal dialog → use **Modal** (composite)

## Composition (required)
| Concern          | Use                                | Never                              |
|------------------|------------------------------------|------------------------------------|
| Internal layout  | `Box direction="row" align="center" gap="2"` for each `Menu.Item`'s icon + label + shortcut row | hand-rolled `display: flex` / `gap` / `padding` in `Menu.css` |
| Floating layer   | `Popover` for positioning + portal + outside-click | hand-rolled positioning math |
| Trigger          | Consumer-provided via `asChild` (typically a `Button`) | raw `<button>` styled in Menu.css |
| Item label       | `Text size="body">`                | raw styled `<span>`                |
| Separator        | `Divider`                          | a `::before` border line           |

## API contract
```ts
interface MenuRootOwnProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}
export type MenuProps = MenuRootOwnProps;

interface MenuTriggerOwnProps {
  asChild?: boolean;
  children: ReactNode;
}
export type MenuTriggerProps = MenuTriggerOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export type MenuListProps = HTMLAttributes<HTMLDivElement>;

interface MenuItemOwnProps {
  onSelect?: () => void;
  disabled?: boolean;
  children: ReactNode;
}
export type MenuItemProps = MenuItemOwnProps & HTMLAttributes<HTMLDivElement>;

export type MenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

// Compound: Menu, Menu.Trigger, Menu.List, Menu.Item, Menu.Separator
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| closed   | Only the trigger is rendered                                          |
| open     | List rendered; first enabled item is focused                          |
| navigating | ArrowUp/ArrowDown move focus; Home/End jump; type-ahead supported   |
| dismissing | Escape returns focus to trigger; outside click closes; Tab closes  |
| item disabled | Skipped by keyboard nav; click is a no-op                          |

## Accessibility
- Trigger gets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls={listId}` while open.
- List is `role="menu"` with `aria-labelledby={triggerId}`.
- Items are `role="menuitem"` with `aria-disabled` when disabled.
- Activating an item (Enter/Space/click) calls `onSelect` AND closes the menu AND returns focus to the trigger.

## Tokens
- Inherits `Popover` tokens for the floating surface
- Item: `--menu-item-padding-{x|y}`, `--menu-item-background-{hover|focus|disabled}`, `--menu-item-text-{default|disabled}`
- Separator: `--divider-color` (via Divider primitive)

## Do / Don't
```tsx
// DO
<Menu>
  <Menu.Trigger asChild><Button variant="ghost"><Icon name="more"/></Button></Menu.Trigger>
  <Menu.List>
    <Menu.Item onSelect={edit}>Edit</Menu.Item>
    <Menu.Item onSelect={duplicate}>Duplicate</Menu.Item>
    <Menu.Separator/>
    <Menu.Item onSelect={remove}>Delete</Menu.Item>
  </Menu.List>
</Menu>

// DON'T — non-interactive content as a Menu.Item
<Menu.Item>Some heading</Menu.Item>   // use a non-Item element above the list

// DON'T — hand-rolled separator
<Menu.List><div className="hr"/></Menu.List>
```

## Forbidden patterns (enforced)
- Hand-rolled positioning / outside-click — compose `Popover`
- Raw styled `<span>` for item label — use `Text`
- A `<hr>` or `::before` border for separator — use `Divider`
- Hardcoded color, spacing, radius, shadow, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger toggles open/closed; open state mirrors `aria-expanded`
- ArrowDown opens the menu (when closed) and focuses first item
- Up/Down/Home/End move focus among enabled items
- Enter/Space on item fires `onSelect` and closes
- Escape closes and returns focus to trigger
- Outside click closes
- Disabled items are skipped
- Forwards refs on Trigger / List / Item
- axe-core passes in open state
