---
name: Input
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-entry]
uses: [Box, Icon]
replaces-raw: ["<input>"]
---

# Input

> The single-line text-entry control — the canonical wrapper around `<input type="text|email|number|…">`.

## Purpose
Input owns the visual chrome of a text field — border, padding, focus ring, error state, leading/trailing icon and addon slots — without any opinions about labels, hints, or error messages. Those are the job of `FormField` (composite). By stripping the input down to its control, every form composition stays consistent.

## When to use
- Any single-line text entry: text, email, number, search, tel, url, password
- Need for inline icon adornment (`leadingIcon`, `trailingIcon`) or addon (`leadingAddon`, `trailingAddon`) like currency prefixes

## When NOT to use
- A labeled, error-bearing field → use **FormField** (composite) — it composes Input + label + hint + error
- A search input with clear button → use **SearchInput** (composite)
- Multi-line text → use **Textarea**
- A dropdown of options → use **Select**

## Composition (required)
| Concern           | Use                                  | Never                                |
|-------------------|--------------------------------------|--------------------------------------|
| Native control    | Owns raw `<input>`                   | a `<div contentEditable>` shim       |
| Internal layout   | `Box direction="row" align="center" gap="2"` for the leading-addon + input + trailing-addon row | hand-rolled `display: flex` / `gap` / `padding` in `Input.css` |
| Leading/trailing icon | `Icon`                            | inline `<svg>`                       |
| Addon text        | `Text` for any styled string content | raw `<span>` with font CSS           |

## API contract
```ts
type InputSize = "sm" | "md" | "lg";

interface InputOwnProps {
  size?: InputSize;          // default "md"
  error?: boolean;           // default false; sets aria-invalid
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  leadingAddon?: ReactNode;
  trailingAddon?: ReactNode;
}

export type InputProps = InputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Border + padding from tokens                                          |
| focus    | Border + ring swap to `--input-border-focus`                          |
| error    | `aria-invalid="true"`; border swaps to `--color-status-error`         |
| disabled | Input disabled; wrapper desaturated; addons inherit disabled visual    |

## Accessibility
- Forwards every native attribute (`required`, `aria-describedby`, `autocomplete`, …) via prop spread.
- `error` only signals invalid state — the message text MUST come from `FormField` and be linked via `aria-describedby`.
- Icon slots must be decorative (`aria-hidden`) unless the consumer provides an actionable element.

## Tokens
- Border: `--input-border-{default|hover|focus|error|disabled}`
- Background: `--input-background-{default|disabled}`
- Padding: `--input-padding-{sm|md|lg}-{x|y}`
- Radius: `--radius-md`
- Color: `--color-text-primary`, `--color-text-placeholder`
- Duration: `--duration-fast`

## Do / Don't
```tsx
// DO
<Input placeholder="Email" type="email" />
<Input leadingIcon={<Icon name="search"/>} placeholder="Search" />
<Input error aria-describedby="email-error" />

// DON'T — render label inside Input
<Input label="Email" />            // labels live on FormField

// DON'T — inline svg adornment
<Input leadingIcon={<svg>…</svg>}/>
```

## Forbidden patterns (enforced)
- Inline `<svg>` for adornments — use `Icon`
- Rendering a `<label>`, hint, or error string inside `Input.tsx` — that's `FormField`'s job
- Hardcoded color, spacing, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `size` renders the correct class
- `error` sets `aria-invalid="true"`
- Icon and addon slots render in correct order (leading → input → trailing)
- `disabled` propagates to native input
- Forwards ref to the native `<input>`; spreads remaining props
- axe-core passes in default, error, disabled
