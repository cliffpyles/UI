---
name: VisuallyHidden
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["ad-hoc \"sr-only\" / clip-rect spans"]
---

# VisuallyHidden

> A polymorphic wrapper that hides content visually while keeping it in the accessibility tree.

## Purpose
The single sanctioned implementation of the `clip: rect(0 0 0 0)` pattern. Used to expose accessible names, instructions, or live-region announcements to assistive tech without rendering visible text.

## When to use
- Accessible names for icon-only buttons / controls (when not provided by `aria-label`)
- Hidden headings that structure a region for screen readers
- Live-region announcements (`role="status"`, `aria-live`) that should not appear visually

## When NOT to use
- To hide content from everyone → use `display: none` / conditional render
- To collapse content with reveal → use a Disclosure / Accordion (Level 4)
- To hide an icon decoratively → use Icon's default `aria-hidden="true"`

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<span>` / `<div>`        | per-component "sr-only" classes    |
| Hide technique | Internal CSS clip-rect             | `display:none` / `visibility:hidden` |

## API contract
```ts
type VisuallyHiddenElement = "span" | "div";

interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: VisuallyHiddenElement; // default "span"
}
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders the chosen element off-screen but still in the a11y tree      |

## Accessibility
- Content remains focusable if it contains focusable descendants — generally avoid putting interactive content inside.
- Pair with `role="status"` / `aria-live` on the parent (or on this element) when used for announcements.

## Tokens
None — this primitive uses fixed accessibility-pattern values (1px clip-rect) that intentionally do not scale with the design system.

## Do / Don't
```tsx
// DO — accessible name for an icon button
<Button><Icon name="trash" /><VisuallyHidden>Delete row</VisuallyHidden></Button>

// DO — live-region announcement
<div role="status" aria-live="polite">
  <VisuallyHidden>{toastMessage}</VisuallyHidden>
</div>

// DON'T — hand-rolled clip
<span style={{ position: "absolute", clip: "rect(0 0 0 0)" }}>…</span>
```

## Forbidden patterns (enforced)
- Re-implementing the clip-rect pattern in any other component's CSS
- Hardcoded color, spacing values inside this primitive

## Tests (required coverage)
- Renders the chosen element with the `ui-visually-hidden` class
- Content remains in the DOM (queryable via `getByText` etc.)
- Forwards ref; spreads remaining props
- axe-core passes
