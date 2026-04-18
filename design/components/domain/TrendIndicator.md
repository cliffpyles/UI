---
name: TrendIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Icon]
replaces-raw: []
---

# TrendIndicator

> A directional arrow plus percent change, semantically colored.

## Purpose
TrendIndicator is the canonical "▲ 12%" cue — the trend slot of `MetricCard`, the change column of summary tables. It owns the directional `Icon`, the semantic color mapping (positive vs. negative is product-defined, not direction-defined), and the percent formatting. It is the only place in the system that renders a directional trend glyph.

## When to use
- The trend slot of a `MetricCard`
- A compact change indicator next to a metric in a row
- Period-over-period comparison icons in summary cards

## When NOT to use
- Need both absolute and percent change → use **Delta**
- Just a percentage with no direction → use **Percentage**
- Trend over time as a curve → use **Sparkline**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="2xs">` | hand-rolled inline CSS  |
| Direction icon  | `Icon name="arrow-up" \| "arrow-down" \| "minus">` | inline `<svg>` or glyph     |
| Percent value   | `Text size="inherit" color="success" \| "danger" \| "secondary">` | raw styled `<span>` |
| Null            | `Text>—</Text>`                                  | empty render                   |

## API contract
```ts
interface TrendIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  direction: "up" | "down" | "flat";
  delta: number | null;                          // fraction (0.12 = 12%)
  polarity?: "positive-good" | "negative-good" | "neutral";   // default "positive-good"
  precision?: number;
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  locale?: string;
}
```

## Required states
| State    | Behavior                                                           |
|----------|--------------------------------------------------------------------|
| up       | Up icon + percent in semantic color per `polarity`                 |
| down     | Down icon + percent in semantic color per `polarity`               |
| flat     | Minus icon + `0%` in secondary tone                                |
| null     | Renders em-dash `—`                                                |
| neutral  | `polarity="neutral"` always renders in secondary tone              |

## Accessibility
- Direction conveyed by both icon and value text — never color alone
- Icon marked `aria-hidden`; root `aria-label` reads "Up 12 percent"
- Polarity affects color only; semantics independent of polarity

## Tokens
- Inherits typography tokens from `Text`, sizing from `Icon`
- Adds: `--trend-indicator-gap`

## Do / Don't
```tsx
// DO
<TrendIndicator direction="up" delta={0.12} />
<TrendIndicator direction="down" delta={-0.05} polarity="negative-good" />

// DON'T — inline glyph
<span>▲ 12%</span>

// DON'T — color the only signal
<span style={{ color: "green" }}>12%</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Up / down / flat each render the correct `Icon` and color
- `polarity="negative-good"` inverts color but not icon
- `delta === null` renders `—`
- `signDisplay` modes behave per spec
- Forwards ref; spreads remaining props onto root
- axe-core passes; root `aria-label` reads spelled-out direction + percent
