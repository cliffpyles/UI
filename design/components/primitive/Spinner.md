---
name: Spinner
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["any hand-rolled CSS keyframe loader"]
---

# Spinner

> A small animated indeterminate progress indicator.

## Purpose
The system's only sanctioned indeterminate-loading glyph. Used inside Buttons, inline with content, and as a fallback while a region loads.

## When to use
- Inside a Button while an async action is in flight
- Inline placeholder for a small region waiting on data
- Anywhere a tiny "working…" affordance is required

## When NOT to use
- Skeleton placeholders for content shape → use **Skeleton** (Level 3)
- Determinate progress → use a `ProgressBar` (future)
- Full-page loading shells → that's a feature/layout concern

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<span role="status">`    | bespoke loader markup elsewhere    |
| Animation      | Built-in `@keyframes ui-spinner-*` | per-call-site keyframes            |
| Hidden label   | Internal visually-hidden span      | extra `<VisuallyHidden>` wrapper  |

## API contract
```ts
type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerOwnProps {
  size?: SpinnerSize; // default "md"
  label?: string;     // default "Loading"
}

type SpinnerProps = SpinnerOwnProps & HTMLAttributes<HTMLSpanElement>;
```

## Required states
| State          | Behavior                                                          |
|----------------|-------------------------------------------------------------------|
| default        | Rotating SVG circle; `role="status"` with visually-hidden label   |
| reduced-motion | `@media (prefers-reduced-motion: reduce)` swaps rotate → pulse    |

## Accessibility
- Root has `role="status"` so screen readers announce the visually-hidden label.
- The internal label defaults to `"Loading"`; callers should override when context-specific (e.g. `"Saving"`, `"Refreshing report"`).
- Honors `prefers-reduced-motion` — never spins for users who opted out.

## Tokens
- Sizing: `--spacing-4`, `--spacing-5`, `--spacing-6`
- Color: `--color-action-primary`

## Do / Don't
```tsx
// DO
<Button loading><Spinner size="sm" label="Saving" /> Save</Button>

// DON'T — hand-rolled
<div className="my-loader" />

// DON'T — wrapping the built-in label
<Spinner><VisuallyHidden>Loading</VisuallyHidden></Spinner>
```

## Forbidden patterns (enforced)
- Custom `@keyframes` for loaders outside this file
- Hardcoded color, size, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `role="status"` with the label text in the accessible name
- Each size renders the correct class / dimensions
- Custom `label` overrides the default
- Forwards ref; spreads remaining props
- axe-core passes
