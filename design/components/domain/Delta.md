---
name: Delta
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Icon]
replaces-raw: []
---

# Delta

> Absolute or percentage change between two values, with directional icon and semantic color.

## Purpose
Delta renders "+12 (+3.4%)" style change indicators wherever the product compares a current value to a prior one. It owns the math (or accepts a precomputed delta), the directional icon, the semantic color (positive/negative/neutral), and the absolute-vs-percent display mode. It is the granular building block underneath `TrendIndicator` when caller needs the raw delta surface.

## When to use
- Comparing current vs. previous in a table cell, list row, or detail view
- The change column of a report period-over-period
- Inside a `MetricCard` when both absolute and percent change are needed

## When NOT to use
- Just a directional arrow with percent → use **TrendIndicator**
- A single formatted value → use **MetricValue**
- A part-of-whole bar → use **RatioBar**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="2xs">` | hand-rolled flex CSS            |
| Direction icon  | `Icon name="arrow-up" \| "arrow-down" \| "minus">` | inline `<svg>` or glyph           |
| Absolute value  | `Text size="inherit">`                             | raw styled `<span>`                |
| Percent value   | `Text size="inherit" color="secondary">`           | raw styled `<span>`                |
| Polarity color  | `Text color="success" \| "danger" \| "secondary">` | hardcoded color                    |

## API contract
```ts
interface DeltaProps extends HTMLAttributes<HTMLSpanElement> {
  current?: number | null;
  previous?: number | null;
  delta?: number | null;             // alternative to current/previous
  percent?: number | null;           // alternative; if omitted, derived
  display?: "absolute" | "percent" | "both";   // default "both"
  polarity?: "positive-good" | "negative-good" | "neutral";   // default "positive-good"
  precision?: number;
}
```

## Required states
| State    | Behavior                                                           |
|----------|--------------------------------------------------------------------|
| up       | Up icon, semantic color per `polarity`, signed value               |
| down     | Down icon, semantic color per `polarity`, signed value             |
| flat     | Minus icon, secondary color, value renders as `0`                  |
| null     | Renders em-dash `—` when delta cannot be computed                  |
| both     | Absolute and `(percent%)` both rendered                            |

## Accessibility
- Direction conveyed by both icon and signed value — never color alone
- Icon marked `aria-hidden`; root carries `aria-label` with full sentence ("Increased by 12, 3.4 percent")
- `polarity` only changes color mapping; semantics stay the same

## Tokens
- Inherits typography tokens from `Text`, sizing from `Icon`
- Adds: `--delta-gap`

## Do / Don't
```tsx
// DO
<Delta current={1240} previous={1108} />
<Delta delta={-12} percent={-0.05} polarity="negative-good" />

// DON'T — inline arrow glyph
<span>▲ +12 (3.4%)</span>

// DON'T — color the only signal
<span style={{ color: "red" }}>-12</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Up / down / flat each render correct icon + color
- `polarity="negative-good"` inverts color mapping but not icon
- Both `current/previous` and explicit `delta/percent` paths produce the same output
- `null` inputs render em-dash
- Forwards ref; spreads remaining props onto root
- axe-core passes; `aria-label` describes change
