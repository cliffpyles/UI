---
name: Popover
tier: base
level: 3
status: stable
since: 0.4.0
patterns: []
uses: [Box]
replaces-raw: ["<div role=\"dialog\">"]
---

# Popover

> A floating, trigger-anchored panel for non-modal interactive content.

## Purpose
Popover is the canonical floating layer for any anchored UI: filter forms, inline editors, color pickers, secondary action surfaces. It owns the trigger ↔ content wiring (`aria-haspopup`, `aria-controls`, `aria-expanded`), placement, focus management on open, Escape and outside-click dismissal — so every floating panel behaves the same way. Higher-level components (`Menu`, `Tooltip`, `Dropdown`) compose Popover for positioning rather than reimplementing it.

## When to use
- An anchored, non-modal surface that hosts interactive content (form, list, picker)
- A help bubble that contains links or buttons (Tooltip can't host interactives)

## When NOT to use
- A blocking confirmation / form → use **Modal** (composite)
- A list of actions → use **Menu** (composes Popover)
- A short hover tip with no interactives → use **Tooltip** (composes Popover)
- A persistent drawer → use **Drawer** (layout)

## Composition (required)
| Concern          | Use                                | Never                              |
|------------------|------------------------------------|------------------------------------|
| Content surface  | `Box` (padding, radius, shadow)    | bespoke surface CSS                |
| Trigger          | Consumer-provided via `asChild` (typically a `Button`) | raw styled `<button>` baked in |

## API contract
```ts
type PopoverPlacement =
  | "bottom-start" | "bottom" | "bottom-end"
  | "top-start" | "top" | "top-end";

interface PopoverOwnProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;       // default "bottom-start"
  children: ReactNode;
}
export type PopoverProps = PopoverOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

interface PopoverTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Compound: Popover, Popover.Trigger, Popover.Content
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| closed   | Only trigger is rendered                                              |
| open     | Content rendered; first focusable child is focused (or content itself if none) |
| dismissing | Escape closes and returns focus to trigger; outside click closes  |

## Accessibility
- Content is `role="dialog"`, `aria-labelledby={triggerId}`, `tabIndex=-1`.
- Trigger has `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls={contentId}` while open.
- Non-modal: focus is moved into the content but not trapped — Tab can leave (which closes).
- Returning focus to the trigger on close is mandatory.

## Tokens
- Background: `--popover-background` (typically `--color-background-surface-raised`)
- Border: `--popover-border`
- Padding: `--popover-padding`
- Radius: `--radius-md`
- Shadow: `--shadow-lg`
- z-index: `--z-popover`
- Duration: `--duration-fast`

## Do / Don't
```tsx
// DO
<Popover>
  <Popover.Trigger asChild><Button>Filters</Button></Popover.Trigger>
  <Popover.Content>
    <FormField label="Status"><Select options={…}/></FormField>
  </Popover.Content>
</Popover>

// DON'T — render Popover.Content unconditionally
<Popover.Content>…</Popover.Content>     // it manages its own mount via context

// DON'T — modal use
<Popover>{/* blocking confirm */}</Popover>   // use Modal
```

## Forbidden patterns (enforced)
- Hand-rolled positioning math (will move to a positioning helper later) — but if added, must live in `Popover.tsx`, not in callers
- Bespoke surface CSS in callers — use `Popover.Content` styles only
- Hardcoded color, spacing, radius, shadow, z-index, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger toggles open/closed; `aria-expanded` mirrors state
- Open moves focus to first focusable child in content
- Escape closes and returns focus to trigger
- Outside click closes
- `placement` prop maps to a `--placement-{value}` modifier class on content
- `asChild` clones the child trigger and forwards aria props + ref
- Forwards ref on Root and Content
- axe-core passes in open state
