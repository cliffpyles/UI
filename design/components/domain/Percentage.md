---
name: Percentage
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# Percentage

> A formatted percentage with consistent precision and sign handling.

## Purpose
Percentage renders "12%", "+3.4%", "<0.1%" so every percent in the product looks the same. It owns precision, sign-display, and the threshold below which values collapse to "<0.1%". Callers pass either a fraction (0–1) or a percent (0–100); the component normalizes.

## When to use
- Conversion rate, completion rate, share-of-X in a metric or table cell
- Percent change displayed on its own (without arrow → use `Delta` or `TrendIndicator` for that)
- Quota usage shown alongside `RatioBar`

## When NOT to use
- A percent change with directional icon → use **TrendIndicator** or **Delta**
- A part-of-whole bar → use **RatioBar**
- A monetary or non-percent number → use **Currency** or **MetricValue**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled inline CSS  |
| Numeric value   | `Text size="inherit">`                           | raw styled `<span>`            |
| Percent symbol  | `Text size="inherit" color="secondary">`         | raw styled `<span>`            |
| Null            | `Text>—</Text>`                                  | empty render                   |

## API contract
```ts
interface PercentageProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null;
  scale?: "fraction" | "percent";    // default "fraction" (0–1)
  precision?: number;                // default 1
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  threshold?: number;                // below which renders "< {threshold}%"
  locale?: string;
}
```

## Required states
| State     | Behavior                                                          |
|-----------|-------------------------------------------------------------------|
| default   | Renders `12.3%`                                                   |
| signed    | `signDisplay="always"` renders `+12.3%`                           |
| sub-threshold | Below `threshold`, renders `< {threshold}%`                   |
| null      | Renders em-dash `—`                                               |
| zero      | Renders `0%` (or `0.0%` per `precision`)                          |

## Accessibility
- Sign part of textual value, never color alone
- `aria-label` carries spelled-out form when sub-threshold collapse fires
- No standalone icons

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--percentage-symbol-gap`

## Do / Don't
```tsx
// DO
<Percentage value={0.123} />                  // "12.3%"
<Percentage value={3.4} scale="percent" signDisplay="exceptZero" />

// DON'T — manual math
<span>{(value * 100).toFixed(1)}%</span>

// DON'T — color the only sign signal
<span style={{ color: "green" }}>{value}%</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Both `scale` modes produce identical visible output for matching inputs
- `precision` controls decimals
- `signDisplay` modes behave per spec
- Sub-`threshold` renders `< 0.1%` with full value in `aria-label`
- `value === null` renders `—`
- Forwards ref; spreads remaining props onto root
- axe-core passes
