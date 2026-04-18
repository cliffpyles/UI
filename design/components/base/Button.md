---
name: Button
tier: base
level: 3
status: stable
since: 0.3.0
patterns: []
uses: [Text, Icon, Spinner]
replaces-raw: ["<button>", "<a> rendered as a button"]
---

# Button

> The canonical interactive control for triggering an action or navigating.

## Purpose
Button is the only path to a clickable, styleable control in the system. It owns the visual variants (primary, secondary, ghost, destructive), size scale, loading affordance, and disabled handling — so every interactive surface inherits the same focus ring, hit target, and theme colors. Polymorphism (`as="a"`) keeps link-styled-as-button cases on the same primitive instead of forking a `LinkButton`.

## When to use
- Any user-initiated action: submit, save, dismiss, open, run
- Navigation that should look and behave like a button (`as="a"` with `href`)
- Any place a `<button>` would otherwise be reached for

## When NOT to use
- A purely textual hyperlink — use **Link** (composite) when one exists; otherwise `Text as="a"` is acceptable for inline prose links
- An icon-only toggle that maintains pressed state — use **ToggleButton** (composite) if pressed semantics are required
- A menu trigger that needs a chevron + popover — wire **Button** as the trigger element of **Menu** / **Popover** rather than reimplementing

## Composition (required)
| Concern         | Use                                       | Never                                     |
|-----------------|-------------------------------------------|-------------------------------------------|
| Root tag        | Owns raw `<button>` / `<a>`               | `onClick` on a `<div>` or `<span>`        |
| Label text      | `Text as="span">` (or `children` string)  | inline-styled `<span>` for the label      |
| Leading/trailing icon | `Icon`                              | inline `<svg>`                            |
| Loading state   | `Spinner size="sm"`                       | hand-rolled CSS animation                 |

## API contract
```ts
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

type ButtonAsButton = { as?: "button" } & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonAsAnchor = { as: "a" } & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonOwnProps = {
  variant?: ButtonVariant;          // default "primary"
  size?: ButtonSize;                 // default "md"
  loading?: boolean;                 // default false
  children?: ReactNode;
};

export type ButtonProps = ButtonOwnProps & (ButtonAsButton | ButtonAsAnchor);
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders label via `Text`; optional leading/trailing `Icon` slots      |
| hover    | Token-driven background swap                                          |
| focus    | Visible focus ring via semantic `--color-focus-ring`                   |
| disabled | `disabled` attr on `<button>`, `aria-disabled` on `<a>`                |
| loading  | `Spinner` replaces label visually; label kept for width; click suppressed |

## Accessibility
- Native `<button>` ensures keyboard activation (Enter/Space) and correct role.
- `as="a"` requires `href`; `loading` sets `aria-disabled` since `disabled` is not valid on anchors.
- Icon-only buttons MUST receive `aria-label` from the consumer.
- Loading state must not change the rendered width (prevents focus jumps).

## Tokens
- Color: `--color-action-{primary|secondary|ghost|destructive}-{bg|bg-hover|bg-active|text|border}`
- Spacing: `--button-padding-{sm|md|lg}-{x|y}`, `--button-gap`
- Typography: inherited from `Text` (size mapped by `size` prop)
- Radius: `--radius-md`
- Shadow/focus: `--shadow-focus-ring`
- Duration: `--duration-fast`

## Do / Don't
```tsx
// DO
<Button variant="primary" onClick={save}>Save</Button>
<Button as="a" href="/dashboard">Dashboard</Button>
<Button loading>Saving…</Button>

// DON'T — hand-rolled icon
<Button><svg>…</svg> Save</Button>

// DON'T — inline typography
<Button><span style={{ fontWeight: 600 }}>Save</span></Button>

// DON'T — div with onClick
<div className="my-button" onClick={save}>Save</div>
```

## Forbidden patterns (enforced)
- Raw `<svg>` inside `Button.tsx` — use `Icon`
- Raw styled `<span>` for the label — use `Text`
- Hand-rolled spinner — use `Spinner`
- Hardcoded color, spacing, radius, shadow, duration values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `variant` and `size` renders the correct class
- `loading` swaps label for spinner, disables interaction, preserves width
- `disabled` prevents click
- `as="a"` renders an anchor and forwards `href`
- Forwards ref; spreads remaining props onto root
- Composition probe: `Spinner` renders when `loading`; `Text` renders the label
- axe-core passes in default, disabled, loading
