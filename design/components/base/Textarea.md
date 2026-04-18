---
name: Textarea
tier: base
level: 3
status: stable
since: 0.4.0
patterns: [data-entry]
uses: []
replaces-raw: ["<textarea>"]
---

# Textarea

> The multi-line text-entry control — the canonical wrapper around `<textarea>`.

## Purpose
Textarea owns the chrome and resize behavior of a multi-line input. Like `Input`, it carries no labels or error messages — those are `FormField`'s responsibility. Token-driven border, padding, and focus styling guarantee parity with `Input` and consistent error visuals across forms.

## When to use
- Any free-form multi-line text: comments, descriptions, notes, bug reports
- A field where the user may need to control vertical extent (`resize="vertical"`)

## When NOT to use
- A labeled, error-bearing field → use **FormField** (composite) — it composes Textarea + label + hint + error
- Single-line text → use **Input**
- Rich text (formatting, mentions) → use a dedicated rich-text component (out of scope)

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Native control | Owns raw `<textarea>`              | a `<div contentEditable>` shim     |

This is intentionally bare — Textarea is essentially the styled native control with no slots. Adornments belong on `FormField`. (`uses:` is empty by design.)

## API contract
```ts
type TextareaSize = "sm" | "md" | "lg";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";

interface TextareaOwnProps {
  size?: TextareaSize;       // default "md"
  error?: boolean;           // default false; sets aria-invalid
  resize?: TextareaResize;   // default "vertical"
}

export type TextareaProps = TextareaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Border + padding from tokens; user agent resize handle per `resize`   |
| focus    | Border + ring swap to `--input-border-focus`                          |
| error    | `aria-invalid="true"`; border swaps to `--color-status-error`         |
| disabled | Disabled visual; resize handle suppressed                             |

## Accessibility
- Forwards every native attribute (`required`, `rows`, `cols`, `aria-describedby`, …).
- `error` only signals invalid state — message text comes from `FormField`.
- `resize` defaulting to `vertical` keeps horizontal layout stable; never default to `both`.

## Tokens
- Inherits the `Input` token set: `--input-border-*`, `--input-background-*`, `--input-padding-*`, `--radius-md`, `--color-text-*`, `--duration-fast`
- Adds (component tier): `--textarea-min-height-{sm|md|lg}`

## Do / Don't
```tsx
// DO
<Textarea rows={4} placeholder="Notes" />
<Textarea error aria-describedby="notes-error" resize="vertical" />

// DON'T — render label inside Textarea
<Textarea label="Notes" />

// DON'T — disable resize via inline style
<Textarea style={{ resize: "none" }}/>   // use the resize prop
```

## Forbidden patterns (enforced)
- Rendering a `<label>`, hint, or error string inside `Textarea.tsx`
- Hardcoded color, spacing, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `size` and `resize` renders the correct class
- `error` sets `aria-invalid="true"`
- `disabled` propagates to native textarea
- Forwards ref to the native `<textarea>`; spreads remaining props
- axe-core passes in default, error, disabled
