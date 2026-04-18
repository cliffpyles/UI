---
name: Dot
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["styled <span> used as a status indicator"]
---

# Dot

> A small filled circle for compact status indication.

## Purpose
A purely visual status marker for dense layouts where a full Badge would be too heavy. Used inline with text or as a leading/trailing affordance on rows and tabs.

## When to use
- "Online / busy / offline" indicators inline with names
- Unread / new markers on navigation items
- Compact status alongside table row identifiers

## When NOT to use
- Status with a textual label → use **Badge** or **StatusBadge**
- Loading indication → use **Spinner**
- Action affordance → use **Button** with an **Icon**

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<span>`                  | inline-styled `<i>` / `<div>`      |
| Color          | Status icon color tokens           | hardcoded hex                      |

## API contract
```ts
type DotColor = "success" | "warning" | "error" | "info" | "neutral";
type DotSize = "sm" | "md";

interface DotOwnProps {
  color?: DotColor; // default "neutral"
  size?: DotSize;   // default "sm"
  label?: string;   // when present, becomes accessible name
}

type DotProps = DotOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, "color">;
```

## Required states
| State            | Behavior                                                          |
|------------------|-------------------------------------------------------------------|
| default          | Renders a circle in the chosen color/size, `aria-hidden="true"`   |
| labelled         | When `label` is provided: `role="img"` + `aria-label={label}`     |

## Accessibility
- Decorative by default (`aria-hidden`). When the dot itself carries the only signal of meaning, callers MUST pass `label`.
- Color alone is not the signal in production UIs — pair with adjacent text where possible.

## Tokens
- `--radius-full`
- Sizing: `--spacing-1-5`, `--spacing-2`
- Colors: `--color-status-{success|warning|error|info}-icon`, `--color-text-tertiary`

## Do / Don't
```tsx
// DO — inline next to a name
<Dot color="success" /> Available

// DO — when the dot is the only signal
<Dot color="error" label="Build failing" />

// DON'T — handcrafted span
<span style={{ background: "green", borderRadius: 999 }} />
```

## Forbidden patterns (enforced)
- Hardcoded color, spacing, radius
- `var(--…)` references not declared in the Tokens section
- `onClick` handlers (non-interactive)

## Tests (required coverage)
- Each color / size renders the correct class
- `aria-hidden="true"` by default; `role="img"` + `aria-label` when `label` provided
- Forwards ref; spreads remaining props
- axe-core passes both with and without `label`
