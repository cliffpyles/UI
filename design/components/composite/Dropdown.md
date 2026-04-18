---
name: Dropdown
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: []
uses: [Popover, Menu, Button]
replaces-raw: ["<div role=\"menu\">", "<button> trigger with hand-rolled aria-expanded wiring"]
---

# Dropdown

> A button that opens a menu of actions or selectable items.

## Purpose
Dropdown is the trigger-plus-menu pattern: a `Button` that toggles a floating `Menu`. It owns open/closed state, the trigger ↔ menu ARIA wiring (`aria-haspopup`, `aria-expanded`, `aria-controls`), focus restoration to the trigger on close, and the open-on-ArrowDown convention. Positioning, portal, and outside-click dismissal come from `Popover`; menu semantics, item roles, and keyboard navigation come from `Menu`. Dropdown is the small layer that ties them together.

## When to use
- A button that reveals a list of related actions ("More actions ▾")
- A "kebab" or overflow trigger on a row or card
- A primary action with a secondary list ("Save ▾ → Save as…")

## When NOT to use
- Selecting one of several values for a form — use **Select**
- Tooltip-style hover help — use **Tooltip**
- Free-form floating content (not a menu of actions) — use **Popover** directly
- Persistent navigation — use a sidebar or nav, not a dropdown

## Composition (required)
| Concern              | Use                                            | Never                                            |
|----------------------|------------------------------------------------|--------------------------------------------------|
| Floating layer       | `Popover` (portal, positioning, outside-click) | hand-rolled `getBoundingClientRect` + portal     |
| Menu surface + items | `Menu`, `Menu.Item`, `Menu.Separator`          | raw `<div role="menu">` and `<div role="menuitem">` |
| Trigger              | `Button` (or caller-provided control via `asChild`) | raw `<button>` with manual aria wiring        |

## API contract
```ts
interface DropdownProps {
  children: ReactNode;            // expects <Dropdown.Trigger> and <Dropdown.Content>
}

interface DropdownTriggerProps {
  children: ReactNode;            // typically a <Button>; cloned with aria + ref wiring
  asChild?: boolean;              // when true, attaches handlers to the child instead of rendering a wrapper Button
}

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";   // forwarded to Popover, default "bottom"
  align?: "start" | "center" | "end";           // forwarded to Popover, default "start"
  children: ReactNode;            // expects <Dropdown.Item> / <Dropdown.Separator>
}

interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  children: ReactNode;
}

// Compound:
// Dropdown.Trigger, Dropdown.Content, Dropdown.Item, Dropdown.Separator
```

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| closed       | Trigger renders normally; content not in DOM; `aria-expanded="false"` |
| opening      | ArrowDown / Enter / Space / click opens; content portals via `Popover`; first enabled item focused |
| open         | `aria-expanded="true"`, `aria-controls` set; ArrowUp/Down move focus; Home/End jump; outside click and Escape close |
| flipped      | When preferred `side` overflows, `Popover` flips placement            |
| dismissed    | Escape closes and returns focus to trigger; selecting an item closes  |

## Accessibility
- Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` while open.
- Content: `role="menu"`, `aria-labelledby` pointing at the trigger id.
- Items: `role="menuitem"` (delegated to `Menu.Item`); destructive items keep the same role with a visual variant only.
- Focus returns to the trigger on close.
- Disabled items receive `aria-disabled` and are skipped by arrow keys.

## Tokens
- Inherits all positioning/surface tokens from `Popover` and `Menu`
- No component-specific tokens — Dropdown is wiring, not chrome

## Do / Don't
```tsx
// DO
<Dropdown>
  <Dropdown.Trigger>
    <Button variant="secondary">Actions <Icon name="chevron-down"/></Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onSelect={duplicate}>Duplicate</Dropdown.Item>
    <Dropdown.Separator/>
    <Dropdown.Item variant="destructive" onSelect={remove}>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>

// DON'T — hand-rolled positioning
<button onClick={…}>Actions</button>
{open && <div style={{ position: "absolute", top: y }}>…</div>}

// DON'T — using Dropdown for value selection in a form
<Dropdown>…choose a country…</Dropdown>   // use Select
```

## Forbidden patterns (enforced)
- `getBoundingClientRect` / manual position math (delegate to `Popover`)
- `createPortal` directly (delegate to `Popover`)
- Raw `<div role="menu">` / `<div role="menuitem">` (use `Menu` / `Menu.Item`)
- Raw `<button>` for the trigger (use `Button`)
- Hardcoded color, spacing, radius, shadow, z-index, duration
- `var(--…)` references not declared in this spec or in `Popover`/`Menu`

## Tests (required coverage)
- Trigger has correct ARIA attributes in open and closed states
- ArrowDown / Enter / Space opens; Escape closes and restores focus to the trigger
- ArrowUp/Down/Home/End move focus among enabled items; disabled items are skipped
- Selecting an item invokes `onSelect` and closes the menu
- Outside click closes the menu
- Composition probe: `Popover` provides positioning; `Menu` renders the surface
- axe-core passes in open and closed states
