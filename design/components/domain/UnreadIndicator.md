---
name: UnreadIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Badge, Text, Dot]
replaces-raw: []
---

# UnreadIndicator

> A dot or numeric badge attached to an item to signal unread or new activity.

## Purpose
UnreadIndicator is the canonical "you have new things" mark — a dot when only presence matters, a count badge when quantity matters. Centralizing this prevents every nav item, tab, and avatar from rolling its own little red circle, and keeps the count cap (`99+`) consistent.

## When to use
- A nav item, tab, or icon needs a "new" mark
- An inbox or feed needs an unread count
- An avatar needs a small presence-of-activity dot

## When NOT to use
- A status pill on a row → use **Tag** with `showDot`
- A general numeric badge unrelated to unread state → use **Badge** primitive directly
- A presence/online dot on an avatar → use **Dot** through the avatar component

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1">` (only for `dot+label` mode) | hand-rolled flex/gap |
| Dot mode        | `Dot variant="primary">`           | `::before` colored circle          |
| Count mode      | `Badge variant="primary">`         | raw styled `<span>` with counter   |
| Optional label  | `Text size="caption" color="secondary">` | raw `<span>` with typography CSS |
| Cap suffix (`99+`) | rendered as `Text` content inside `Badge` | inline `Intl.NumberFormat` math |

## API contract
```ts
type UnreadIndicatorVariant = "dot" | "count";

interface UnreadIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: UnreadIndicatorVariant;   // default "dot"
  count?: number;                     // required when variant="count"
  max?: number;                       // default 99 → renders "99+" when exceeded
  showZero?: boolean;                 // default false → hides when count===0
  label?: ReactNode;                  // optional text rendered after the indicator
  "aria-label"?: string;              // overrides default "{n} unread"
}
```
Component uses `forwardRef<HTMLSpanElement, UnreadIndicatorProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| dot      | Renders a single `Dot`                                                |
| count    | Renders `Badge` with `count` (capped by `max`)                        |
| zero     | Returns null unless `showZero`                                        |
| capped   | `count > max` → renders `${max}+` inside `Badge`                      |
| with-label | Renders the indicator followed by `Text`                            |

## Accessibility
- Default `aria-label`: `"${count} unread"` for count, `"Unread"` for dot.
- When `count===0` and `showZero` is true, `aria-label` becomes `"No unread"`.
- The visual count and the SR label always agree — capping does not change the announced number, which uses the actual `count`.

## Tokens
- Inherits all coloring from `Dot` and `Badge` (no new tokens)
- Gap inherited from `Box`: `--space-1`

## Do / Don't
```tsx
// DO
<UnreadIndicator variant="dot" />
<UnreadIndicator variant="count" count={inboxCount} />
<UnreadIndicator variant="count" count={142} max={99} />   // shows "99+"

// DO — with label
<UnreadIndicator variant="count" count={3} label="new" />

// DON'T — hand-rolled
<span className="red-dot"/>
<span className="counter">{n > 99 ? "99+" : n}</span>

// DON'T — formatting in caller
<UnreadIndicator count={Number(n.toLocaleString())} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` (cap formatting is plain string concat)
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `variant="dot"` renders a `Dot`
- `variant="count"` renders a `Badge` with the count
- `count=0` hides the indicator unless `showZero`
- `count > max` renders `${max}+`
- `aria-label` reflects the true count (not the capped string)
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Dot"]` or `[data-component="Badge"]` resolves
- axe-core passes in each variant
