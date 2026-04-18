---
name: ComponentName
tier: primitive | base | composite | domain | layout
level: 2 | 3 | 4 | 5 | 6
status: draft | stable | deprecated
since: 0.3.0
patterns: [data-display, states]              # zero or more from design/patterns/
uses: [Card, Text, Icon]                      # internal dependencies — MUST be used
replaces-raw: ["<button>", "<dialog>"]        # raw tags this component owns
---

# ComponentName

> One sentence. What it is, in product terms.

## Purpose
2-4 sentences. The user/product problem this exists to solve. No implementation detail.

## When to use
- Concrete situation 1
- Concrete situation 2

## When NOT to use
- Situation → use **OtherComponent** instead
- Situation → this is a **layout** concern, use **SomeLayout**

## Composition (required)
The implementation MUST build from these components. Reimplementing any row is a violation.

| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Surface        | `Card`                             | raw `<div>` with border CSS        |
| Label text     | `Text as="label"`                  | raw `<label>` with styling         |
| Numeric value  | `MetricValue`                      | inline `Intl.NumberFormat`         |
| Loading state  | `Skeleton`                         | hand-rolled shimmer                |
| Error state    | `ErrorState`                       | inline error JSX                   |

## API contract
```ts
interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number | null;          // null → renders em-dash
  trend?: { direction: "up" | "down" | "flat"; delta: number };
  loading?: boolean;
  error?: Error | null;
}
```
This block is the source of truth. Adding, removing, or renaming a prop in `.tsx` without first updating this block MUST fail the build.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders value via `MetricValue`                                       |
| loading  | Replaces value slot with `<Skeleton width="6ch"/>`; label still shown |
| error    | Replaces value slot with `<ErrorState variant="inline"/>`             |
| empty    | `value === null` → renders `—` (em-dash, U+2014)                      |

## Accessibility
- Root: `role="group"` with `aria-labelledby` pointing to the label id
- Value updates: `aria-live="polite"` only when `live` prop is true
- Direction must not rely on color alone — `TrendIndicator` provides icon + text

## Tokens
Permitted token references in this component's CSS. Inherits its tier's allowed set. Any `var(--…)` not listed here or in the inherited set MUST fail the build. Adding a token requires updating this block first.

- Inherits all surface tokens from `Card`
- Adds (component tier): `--metric-card-value-gap`

## Do / Don't
```tsx
// DO
<MetricCard label="Revenue" value={1240} trend={{ direction: "up", delta: 0.12 }} />

// DON'T — reimplements Card surface
<div className="metric-card"><span>{value}</span></div>

// DON'T — bypasses TrendIndicator
<MetricCard label="Revenue" value={1240} />
<span className="arrow-up">▲ 12%</span>

// DON'T — caller composes internals; that's this component's job
<Card><MetricValue value={1240}/><Sparkline data={...}/></Card>
```

## Forbidden patterns (enforced)
Any of these appearing in `ComponentName.tsx` or `ComponentName.css` MUST fail the build.

- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `MetricValue` or `formatNumber`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator`)
- Inline `<svg>` for trends (use `Sparkline`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each required state renders correctly
- `value === null` renders `—`
- axe-core passes in default, loading, error
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="MetricValue"]` resolves inside the rendered output (proves composition, not reimplementation)
