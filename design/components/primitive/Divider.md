---
name: Divider
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["<hr>", "ad-hoc bordered <div> used as a separator"]
---

# Divider

> A horizontal or vertical separator line with token-driven margin.

## Purpose
Visually separates groups of content using the system's border color and spacing tokens. Replaces hand-rolled `<hr>` and bordered divs so theming and density propagate correctly.

## When to use
- Between groups of items in a list, menu, or toolbar
- Separating sections inside a card or form
- Vertical separators between inline action clusters

## When NOT to use
- As a decorative line under a heading → use spacing instead
- For grid track gutters → use Grid `gap`
- When the separation should be conveyed by surface color → use `Box` `background`

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<div role="separator">`  | raw `<hr>`                         |
| Spacing        | Token-keyed `spacing` prop         | inline margin                      |

## API contract
```ts
type SpacingToken =
  | "0" | "px" | "0.5" | "1" | "1.5" | "2" | "2.5"
  | "3" | "3.5" | "4" | "5" | "6" | "7" | "8"
  | "10" | "12" | "14" | "16" | "20" | "24" | "32";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"; // default "horizontal"
  spacing?: SpacingToken;                   // default "4"
}
```

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| horizontal   | 1px top border, 100% width, vertical margin via `spacing`         |
| vertical     | 1px left border, stretches to parent height, horizontal margin    |

## Accessibility
- Renders `role="separator"` and `aria-orientation` matching `orientation`.
- Decorative dividers may set `aria-hidden="true"` via spread props.

## Tokens
- `--color-border-default`
- Spacing: `--spacing-{0|px|0-5|1|1-5|2|2-5|3|3-5|4|5|6|7|8|10|12|14|16|20|24|32}`

## Do / Don't
```tsx
// DO
<Divider spacing="2" />
<Divider orientation="vertical" spacing="3" />

// DON'T — bypasses theming
<hr style={{ borderColor: "#ccc" }} />
```

## Forbidden patterns (enforced)
- Hardcoded color, spacing, radius, shadow
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `role="separator"` with correct `aria-orientation`
- Spacing prop emits the correct margin custom property
- Forwards ref; spreads remaining props
- axe-core passes for both orientations
