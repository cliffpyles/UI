---
name: NumberRange
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# NumberRange

> A min–max numeric pair rendered with a consistent separator.

## Purpose
NumberRange renders "10–24", "$5–$50", "1.2K–4.7K" wherever the product shows a numeric span — price filters, score ranges, capacity bands. It owns separator choice, redundant-unit collapsing, and open-ended handling.

## When to use
- A min–max numeric filter or facet
- A capacity / score / quota band
- A price band (paired with `Currency` slots)

## When NOT to use
- A two-date span → use **DateRange**
- A part-of-whole bar → use **RatioBar**
- A single value → use **MetricValue**

## Composition (required)
| Concern         | Use                                            | Never                            |
|-----------------|------------------------------------------------|----------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="xs">` | hand-rolled inline CSS    |
| Each endpoint   | `Text size="inherit">` (or slot)               | raw styled `<span>`              |
| Separator       | `Text color="secondary" aria-hidden="true">`   | raw character with CSS           |
| Null endpoint   | `Text>—</Text>`                                | blank render                     |

## API contract
```ts
interface NumberRangeProps extends HTMLAttributes<HTMLSpanElement> {
  min: number | null;
  max: number | null;
  unit?: string;
  precision?: number;
  notation?: "standard" | "compact";
  separator?: "en-dash" | "to";
  collapseUnit?: boolean;            // default true
  locale?: string;
}
```

## Required states
| State          | Behavior                                                           |
|----------------|--------------------------------------------------------------------|
| default        | `min` separator `max` with shared unit suffix at the end           |
| open min       | `min === null` → `— – max`                                         |
| open max       | `max === null` → `min – —`                                         |
| both null      | Renders single em-dash `—`                                         |
| equal          | When `min === max`, renders single value (no separator)            |

## Accessibility
- Separator marked `aria-hidden`; root `aria-label` reads "10 to 24"
- Endpoints in document order regardless of locale
- Sign and unit are part of textual value

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--number-range-separator-gap`

## Do / Don't
```tsx
// DO
<NumberRange min={10} max={24} unit="seats" />
<NumberRange min={null} max={50} unit="MB" />

// DON'T — manual concatenation
<span>{min}-{max}</span>

// DON'T — two MetricValues glued together
<><MetricValue value={min}/> – <MetricValue value={max}/></>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders both endpoints with separator and shared unit
- Open min / open max render em-dash on missing side
- `min === max` collapses to single value
- Compact notation applied to both endpoints
- Forwards ref; spreads remaining props onto root
- axe-core passes; root `aria-label` reads spelled-out range
