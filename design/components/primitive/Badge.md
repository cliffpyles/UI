---
name: Badge
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["styled <span> used as a status/category pill"]
---

# Badge

> A small inline label that categorizes or annotates an adjacent element.

## Purpose
Badges call out short, low-frequency metadata — a count, a status word, a category tag — without competing with the content they annotate. They are the lightest visual treatment for "this thing is X".

## When to use
- Inline status or category labels next to titles or rows (e.g. "Beta", "Draft")
- Counts attached to navigation items or tabs
- Short, non-interactive tags inside dense tables and lists

## When NOT to use
- Interactive selectable chips → use **Tag** (Level 3) when removable/clickable
- Active product status mapped from an enum → use **StatusBadge** (Level 5)
- Standalone "is online" indicator without text → use **Dot**
- Large emphatic call-outs → that is a **Banner/Alert**, not a badge

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<span>` directly         | wrap in extra `<div>`              |
| Color/spacing  | semantic status + spacing tokens   | hardcoded hex / px                 |

## API contract
```ts
type BadgeVariant = "neutral" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md";

interface BadgeOwnProps {
  variant?: BadgeVariant; // default "neutral"
  size?: BadgeSize;       // default "md"
}

type BadgeProps = BadgeOwnProps & HTMLAttributes<HTMLSpanElement>;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders children inside a pill with the variant's bg/text tokens      |
| empty    | No children → empty pill (caller's responsibility to avoid)           |

## Accessibility
- No implicit role; behaves as inline text. Callers must ensure surrounding context conveys meaning.
- Color alone never carries the signal — variant must be paired with text content.
- Disabled/loading are not applicable (non-interactive).

## Tokens
- `--font-weight-medium`, `--font-size-2xs`, `--font-size-xs`, `--font-line-height-tight`
- `--radius-full`
- `--spacing-0-5`, `--spacing-1-5`, `--spacing-2`
- `--color-background-surface-raised`, `--color-text-secondary`
- `--color-status-{success,warning,error,info}-bg`
- `--color-status-{success,warning,error,info}-text`

## Do / Don't
```tsx
// DO
<Badge variant="success">Active</Badge>

// DON'T — bare styled span
<span className="my-pill">Active</span>

// DON'T — interactive
<Badge onClick={...}>Active</Badge>  // use Tag instead
```

## Forbidden patterns (enforced)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section
- `onClick` handlers (Badge is non-interactive — use Tag)

## Tests (required coverage)
- Renders each variant with the correct class
- Renders each size with the correct class
- Forwards ref; spreads remaining props onto root `<span>`
- className merges with computed classes
- axe-core passes
