---
name: PopoverPeekLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Popover, Card]
replaces-raw: []
---

# PopoverPeekLayout

> A hover- or click-revealed popover that surfaces a rich, card-shaped detail summary anchored to a trigger.

## Purpose
PopoverPeekLayout owns the chrome for "peek" interactions — the hover preview on a row, the click-reveal on a chip, the tap-to-expand on a thumbnail. It centralizes anchor positioning, the open-on-hover-with-delay model, the close-on-blur model, focus restoration on close, and the contract that the peek body is a `Card`-shaped surface. Callers supply the trigger and body; the layout owns positioning, timing, and a11y.

## When to use
- Inline previews that summarize a record without navigation (user chip → user card)
- Hover-revealed metadata on long lists
- Click-revealed contextual detail on a chip, badge, or icon

## When NOT to use
- A persistent side panel — use **ContextualDrawerLayout**
- A page-level detail with deep tabs — use **EntityDetailLayout**
- A blocking confirmation — use **Modal**
- Tooltip-sized text only — use **Tooltip**

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box display="inline-flex">` around the trigger    | raw `<span>` with inline-flex CSS           |
| Floating layer       | `Popover` (positioning, portal, dismissal)         | hand-rolled fixed-position layer            |
| Peek surface         | `Card` (radius, shadow, padding via tokens)        | raw `<div>` with surface CSS                |
| Peek body region     | `Box display="flex" direction="column" gap>`       | hand-rolled flex CSS                        |

The trigger element is provided by the caller; the layout wraps it (without changing its tag) and attaches the open/close handlers via the underlying `Popover`.

## API contract
```ts
interface PopoverPeekLayoutProps extends HTMLAttributes<HTMLSpanElement> {
  trigger: ReactNode;                 // typically a UserChip, EntityLink, Tag, etc.
  children: ReactNode;                // peek body content
  openOn?: "hover" | "click" | "focus"; // default "hover"
  openDelayMs?: number;               // default 300
  closeDelayMs?: number;              // default 150
  placement?: "top" | "right" | "bottom" | "left" | "auto"; // default "auto"
  open?: boolean;                     // controlled
  onOpenChange?: (open: boolean) => void;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| closed       | Only the trigger renders; no Popover DOM                                  |
| opening      | After `openDelayMs`, Popover mounts and positions to the trigger          |
| open         | Peek surface visible; focus may move into it (when `openOn === "click" || "focus"`) |
| hover-leave  | After `closeDelayMs`, Popover dismisses; cursor moving into the popover before delay keeps it open |
| dismiss      | Esc, blur, or outside click closes (delegated to `Popover`)               |

## Accessibility
- Trigger receives `aria-haspopup="dialog"` and `aria-expanded` reflecting open state.
- Peek surface is `role="dialog"` with `aria-label` derived from the trigger label (or an explicit `aria-label` prop on the layout).
- Hover-only triggers must also be keyboard-reachable: focusing the trigger opens the peek, blur closes it.
- Esc closes; focus returns to the trigger.

## Tokens
- Surface inherited from `Card`: `--color-surface-overlay`, `--radius-md`, `--shadow-overlay`
- Z-index: `--z-popover`
- Open/close timing: `--duration-fast`
- Peek width: `--popover-peek-width-{sm|md|lg}`
- Padding: `--popover-peek-padding-{x|y}`

## Do / Don't
```tsx
// DO
<PopoverPeekLayout trigger={<UserChip user={u}/>}>
  <UserPeekCard user={u}/>
</PopoverPeekLayout>

// DON'T — hand-rolled position-fixed layer
<div style={{ position: "fixed", top: y, left: x }}>{…}</div>

// DON'T — bypass Card and tile the surface yourself
<Popover><div className="peek" style={{ borderRadius: 8, boxShadow: "…" }}>{…}</div></Popover>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owner components
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>`
- Hand-rolled `display: grid` or `display: flex` in this layout's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Closed state renders only the trigger; peek body is not in the DOM
- Hover with `openOn="hover"` opens after `openDelayMs` and closes after `closeDelayMs`
- Click with `openOn="click"` toggles open/closed and moves focus into the peek
- Focus on the trigger with `openOn="focus"` opens the peek; blur closes it
- Esc closes and returns focus to the trigger
- Composition probe: `Popover` and `Card` resolve in the rendered output when open
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with a labelled trigger and an open peek
