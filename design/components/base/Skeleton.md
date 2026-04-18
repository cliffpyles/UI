---
name: Skeleton
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [states]
uses: [Box]
replaces-raw: []
---

# Skeleton

> An animated placeholder rectangle that occupies the shape of content while it loads.

## Purpose
Skeleton is the canonical loading affordance for content shape — a shimmering rectangle, circle, or stack of text lines. By centralizing the animation, color, and `role="status"` plumbing, every loading state in the product feels identical and is announced consistently to assistive tech.

## When to use
- The shape of a forthcoming value is known (text width, avatar size, card height)
- Filling a slot during the first paint of a domain component (`MetricCard` → loading: `<Skeleton width="6ch"/>`)

## When NOT to use
- Indeterminate progress on a pending action → use **Spinner** primitive (small) or **ProgressBar** (bar)
- A genuine empty state → use **EmptyState** (composite)
- A failed load → use **ErrorState** (composite)

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Shape container | `Box` (when wrapping multiple lines) | bespoke flex CSS in `.css`        |
| Single shape    | A token-styled `<div>` is acceptable here — it has no semantics or content | shimmer styled with hardcoded gradients |

## API contract
```ts
type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonOwnProps {
  variant?: SkeletonVariant;     // default "text"
  width?: string | number;        // default "100%"
  height?: string | number;        // default "1em"
  lines?: number;                  // default 1; only meaningful for variant="text"
}

export type SkeletonProps = SkeletonOwnProps & HTMLAttributes<HTMLDivElement>;
```

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| single shape | One element with token-driven shimmer animation                    |
| text + lines | Renders `lines` rows in a `Box direction="column" gap="2"`; last line is 80% width to mimic ragged-right text |
| circle       | Width and height equal; radius = `--radius-full`                  |

## Accessibility
- Root has `role="status"`, `aria-busy="true"`, `aria-label="Loading content"`.
- The shimmer animation MUST respect `prefers-reduced-motion` and fall back to a static surface.

## Tokens
- Background: `--skeleton-background-base`
- Highlight: `--skeleton-background-highlight`
- Radius: `--radius-{sm|md|full}` (per variant)
- Duration: `--skeleton-shimmer-duration`
- Easing: `--easing-default`

## Do / Don't
```tsx
// DO
<Skeleton width="6ch" />
<Skeleton variant="circle" width={32} />
<Skeleton variant="text" lines={3} />

// DON'T — Skeleton holding text content
<Skeleton>Loading…</Skeleton>            // empty by design

// DON'T — hand-rolled shimmer
<div className="my-shimmer" />
```

## Forbidden patterns (enforced)
- Bespoke flex CSS for line stacking — use `Box`
- Hardcoded color, gradient, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `variant` renders the correct class
- `lines > 1` renders that many rows; last is narrower
- `circle` enforces square dimensions
- `role="status"` and `aria-busy="true"` present
- Forwards ref; spreads remaining props
- axe-core passes
