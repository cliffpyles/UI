---
name: Currency
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# Currency

> A locale- and currency-aware monetary value with consistent symbol, grouping, and decimal handling.

## Purpose
Currency renders monetary amounts so every "$1,234.56" in the product looks and announces the same way. It owns ISO currency code → symbol resolution, locale-aware formatting (grouping, decimal separator), and the visual treatment of the symbol relative to the digits. Callers pass a number and a currency code; Currency picks the right format.

## When to use
- Displaying a price, balance, total, or any monetary value
- Inline within a sentence or table cell where consistent currency formatting matters
- As the value slot of a `MetricCard` reporting revenue, cost, or ARR

## When NOT to use
- A raw count without monetary meaning → use **MetricValue**
- A percentage of revenue → use **Percentage**
- An editable currency input → use **FormField** with a currency-aware **Input**

## Composition (required)
| Concern         | Use                                              | Never                                  |
|-----------------|--------------------------------------------------|----------------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled flex/inline CSS    |
| Symbol          | `Text size="inherit" color="secondary">`         | raw styled `<span>`                    |
| Integer + fraction | `Text size="inherit" weight="inherit">`       | raw styled `<span>`                    |
| Null / unknown  | `Text>—</Text>` (em-dash)                        | empty render                           |

## API contract
```ts
interface CurrencyProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null;
  currency: string;                          // ISO 4217, e.g. "USD"
  locale?: string;                           // defaults to document locale
  precision?: number;                        // default: currency-defined minor units
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  notation?: "standard" | "compact";         // compact → "$1.2K"
}
```

## Required states
| State          | Behavior                                                        |
|----------------|-----------------------------------------------------------------|
| default        | Renders symbol + grouped digits + decimals per locale/currency  |
| null           | Renders em-dash `—`                                             |
| negative       | Renders locale-correct sign placement                           |
| compact        | Renders shortened form (`$1.2K`, `€3.4M`)                       |
| zero           | Renders `$0.00` unless `signDisplay="exceptZero"`               |

## Accessibility
- Root carries `aria-label` with the unabbreviated value when `notation="compact"`
- No reliance on color to convey sign — sign is part of the textual value
- Inline-flex layout preserves baseline alignment with surrounding text

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--currency-symbol-gap`

## Do / Don't
```tsx
// DO
<Currency value={1240.5} currency="USD" />
<Currency value={null} currency="USD" />
<Currency value={1_240_000} currency="EUR" notation="compact" />

// DON'T — inline formatter
<span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)}</span>

// DON'T — string concatenation
<span>${value.toFixed(2)}</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` outside the central formatter utility
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders USD, EUR, JPY with correct symbol placement and decimals
- `value === null` renders `—`
- Negative values render with locale-correct sign
- `notation="compact"` renders short form and exposes full value via `aria-label`
- Forwards ref; spreads remaining props onto root
- axe-core passes
