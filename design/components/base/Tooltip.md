---
name: Tooltip
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [help-and-onboarding]
uses: [Box, Text, Popover]
replaces-raw: ["<div role=\"tooltip\">"]
---

# Tooltip

> A short, hover- or focus-triggered explanatory bubble attached to a control.

## Purpose
Tooltip provides supplementary, non-essential context on demand. It owns the hover/focus delay, viewport-flipping placement, dismissal on Escape, and `aria-describedby` wiring. By delegating positioning to `Popover`, Tooltip stays focused on its narrower contract: short, transient, label-only content.

## When to use
- Naming an icon-only button ("Settings", "Delete")
- Surfacing a truncated value in full
- A short explanation of a label or threshold

## When NOT to use
- Essential information the user MUST see → render it inline; tooltips are not announced reliably on touch
- Anything interactive (links, buttons inside) → use **Popover**
- A long block of help → use **Popover** or a side **HelpDrawer**
- A validation error → use **FormField** error slot

## Composition (required)
| Concern          | Use                                | Never                              |
|------------------|------------------------------------|------------------------------------|
| Internal layout  | `Box direction="row" align="center" gap="1.5"` for the bubble content (text and any optional inline icon) | hand-rolled `display: flex` / `gap` / `padding` in `Tooltip.css` |
| Floating layer   | `Popover` (positioning + portal + flip) | hand-rolled `getBoundingClientRect` math |
| Content text     | `Text size="caption" color="inverse">` | raw styled `<span>` or `<div>` |
| Trigger wrapper  | An unstyled `<span>` (or the child via `asChild`) | wrapping in a `<div>` that breaks inline flow |

## API contract
```ts
type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipOwnProps {
  content: ReactNode;
  side?: TooltipSide;        // default "top"
  delay?: number;            // ms, default 500
  maxWidth?: number;         // px, default 240
  children: ReactNode;       // the trigger
}

export type TooltipProps = TooltipOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "content">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| hidden   | Trigger renders normally; tooltip not in DOM                          |
| showing  | After `delay` ms on hover, or immediately on focus, renders the tooltip and wires `aria-describedby` |
| flipped  | If preferred `side` overflows the viewport, flip to opposite side     |
| dismissed | Escape keypress hides; mouseleave/blur hides immediately              |

## Accessibility
- `role="tooltip"` on the bubble; trigger gets `aria-describedby` while open.
- MUST appear on focus, not only on hover (keyboard users).
- MUST be dismissable with Escape.
- Don't put interactive content inside (focus can't reach it) — use `Popover` for that.

## Tokens
- Background: `--tooltip-background` (typically inverse surface)
- Text: `--color-text-inverse`
- Padding: `--tooltip-padding-{x|y}`
- Radius: `--radius-sm`
- Shadow: `--shadow-md`
- z-index: `--z-tooltip`
- Duration: `--duration-fast`

## Do / Don't
```tsx
// DO
<Tooltip content="Delete row">
  <Button variant="ghost" aria-label="Delete"><Icon name="trash"/></Button>
</Tooltip>

// DON'T — interactive content
<Tooltip content={<Button>Undo</Button>}>…</Tooltip>   // use Popover

// DON'T — essential information
<Tooltip content="Required field">                    // surface inline instead
  <Input/>
</Tooltip>
```

## Forbidden patterns (enforced)
- Hand-rolled positioning math — compose `Popover`
- Raw styled `<span>`/`<div>` for content text — use `Text`
- Hardcoded color, spacing, radius, shadow, z-index, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Appears after `delay` ms on hover; immediately on focus
- Hides on mouseleave, blur, and Escape
- `aria-describedby` set on the trigger while visible
- Flips when overflow is detected
- `maxWidth` is honored
- Forwards ref to the bubble; spreads remaining props
- axe-core passes
