---
name: MetricCard
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, states]
uses: [Box, Card, Text, MetricValue, TrendIndicator, Sparkline, Skeleton]
replaces-raw: []
---

# MetricCard

> A surface tile that summarizes one metric: value, label, optional trend and sparkline.

## Purpose
MetricCard is the canonical KPI tile on dashboards — "Revenue · $1.2M · ▲ 12% · ⤶ sparkline". It owns the slot anatomy (label, value, trend, sparkline, footnote), the loading/error/empty states, and the consistent rhythm so a row of MetricCards reads as a single scannable unit.

## When to use
- A primary KPI on a dashboard or report header
- Any single-metric tile in a grid of summary numbers
- Side-by-side comparison of related metrics

## When NOT to use
- A multi-row tabular comparison → use **Table**
- A standalone value inline in copy → use **MetricValue**
- A non-metric content panel → use **Card**

## Composition (required)
| Concern          | Use                                              | Never                          |
|------------------|--------------------------------------------------|--------------------------------|
| Internal layout  | `Box display="flex" direction="column" gap="sm">` (inside `Card.Body`) | hand-rolled flex CSS |
| Surface          | `Card`                                           | raw `<div>` with surface CSS   |
| Label            | `Text size="sm" color="secondary">`              | raw styled `<span>`            |
| Value            | `MetricValue`                                    | inline `Intl.NumberFormat`     |
| Trend            | `TrendIndicator`                                 | inline trend glyph             |
| Sparkline        | `Sparkline`                                      | inline `<svg>`                 |
| Loading          | `Skeleton` for value and sparkline slots         | hand-rolled shimmer            |

## API contract
```ts
interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | null;
  unit?: string;
  precision?: number;
  trend?: { direction: "up" | "down" | "flat"; delta: number; polarity?: "positive-good" | "negative-good" | "neutral" };
  sparkline?: number[];
  footnote?: ReactNode;
  loading?: boolean;
  error?: Error | null;
}
```

## Required states
| State    | Behavior                                                           |
|----------|--------------------------------------------------------------------|
| default  | Label, value, optional trend and sparkline rendered                |
| loading  | Value and sparkline slots replaced with `Skeleton`; label visible  |
| error    | Value slot replaced with concise error text via `Text color="danger"` |
| empty    | `value === null` → renders em-dash via `MetricValue`               |

## Accessibility
- Root: `role="group"` with `aria-labelledby` pointing to the label id
- Trend conveyed by icon + text in `TrendIndicator`, not color alone
- `Sparkline` supplies a textual summary via its own `aria-label`

## Tokens
- Inherits surface tokens from `Card`
- Adds: `--metric-card-value-gap`, `--metric-card-trend-gap`

## Do / Don't
```tsx
// DO
<MetricCard label="Revenue" value={1_240_000} unit="USD"
  trend={{ direction: "up", delta: 0.12 }}
  sparkline={[1,2,3,4,5,7]} />

// DON'T — bypass MetricValue
<Card><Card.Body>{value.toLocaleString()}</Card.Body></Card>

// DON'T — caller composes internals
<Card><MetricValue value={v}/><TrendIndicator …/><Sparkline …/></Card>

// DON'T — hand-rolled trend
<Card><span className="up">▲ 12%</span></Card>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Default renders label, `MetricValue`, optional `TrendIndicator`, optional `Sparkline`
- `loading` swaps value and sparkline for `Skeleton`
- `error` renders an inline error and suppresses trend/sparkline
- `value === null` renders em-dash
- Forwards ref; spreads remaining props onto root
- Composition probe: `MetricValue`, `TrendIndicator`, `Sparkline` resolve in DOM
- axe-core passes in default, loading, error
