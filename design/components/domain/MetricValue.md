---
name: MetricValue
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# MetricValue

> A formatted numeric value with optional unit, used wherever a metric is shown.

## Purpose
MetricValue is the canonical large-number renderer — the value slot inside `MetricCard`, table totals, and report headers. It owns formatting (grouping, precision, compact notation), unit suffix typography, and the em-dash fallback so every numeric KPI in the product reads the same way.

## When to use
- The primary value of a `MetricCard` or report header
- Any standalone large number where formatting consistency matters
- Table totals and subtotals

## When NOT to use
- A monetary value → use **Currency**
- A percentage → use **Percentage**
- A byte count → use **FileSize**
- A duration → use **Duration**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled inline CSS  |
| Numeric value   | `Text size="inherit" weight="inherit">`          | raw styled `<span>`            |
| Unit suffix     | `Text size="inherit" color="secondary">`         | raw styled `<span>`            |
| Null            | `Text>—</Text>`                                  | empty render                   |

## API contract
```ts
interface MetricValueProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null;
  unit?: string;
  precision?: number;
  notation?: "standard" | "compact";   // compact → "1.2K"
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  locale?: string;
}
```

## Required states
| State     | Behavior                                                          |
|-----------|-------------------------------------------------------------------|
| default   | Grouped digits with optional unit suffix                          |
| compact   | Shortened form (`1.2K`, `3.4M`) with unabbreviated `aria-label`   |
| null      | Renders em-dash `—`                                               |
| zero      | Renders `0` with `precision` decimals                             |
| negative  | Sign rendered as part of the textual value                        |

## Accessibility
- `notation="compact"` exposes the unabbreviated value via root `aria-label`
- Direction (sign) part of value text, never color alone
- Inline-flex preserves baseline with adjacent labels

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--metric-value-unit-gap`

## Do / Don't
```tsx
// DO
<MetricValue value={1240} />
<MetricValue value={1_240_000} notation="compact" unit="users" />
<MetricValue value={null} />

// DON'T — inline formatter
<span>{value.toLocaleString()}</span>

// DON'T — concatenate unit
<span>{value} users</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Standard and compact notation render correctly
- `unit` rendered as a secondary suffix with the configured gap
- `value === null` renders `—`
- `signDisplay` modes behave per spec
- Forwards ref; spreads remaining props onto root
- axe-core passes; compact form exposes full value via `aria-label`
