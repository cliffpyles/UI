---
name: Duration
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# Duration

> A human-readable time span ("3h 22m", "2 days") from a numeric duration.

## Purpose
Duration converts millisecond/second counts into the product's standard short or long form for elapsed time — request latency, job runtime, time-on-task. It owns unit selection, precision, and the singular/plural handling so durations read consistently everywhere.

## When to use
- Job runtime, request latency, queue wait, session length
- "Last seen 5 min ago" style relatives (paired with `Timestamp`)
- Any non-anchored "how long" value

## When NOT to use
- Anchored start/end span → use **DateRange**
- A wall-clock instant → use **Timestamp**
- A schedule cadence ("every 5 minutes") → product copy, not a component

## Composition (required)
| Concern         | Use                                          | Never                          |
|-----------------|----------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="2xs">` | hand-rolled inline CSS |
| Each unit chunk | `Text size="inherit">`                       | raw styled `<span>`            |
| Unit suffix     | `Text size="inherit" color="secondary">`     | raw styled `<span>`            |
| Null            | `Text>—</Text>`                              | empty render                   |

## API contract
```ts
interface DurationProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | null;             // milliseconds
  format?: "short" | "long";        // "3h 22m" vs "3 hours 22 minutes"
  precision?: 1 | 2 | 3;            // number of unit chunks
  smallest?: "ms" | "s" | "m" | "h" | "d";
  largest?: "s" | "m" | "h" | "d";
  locale?: string;
}
```

## Required states
| State     | Behavior                                                          |
|-----------|-------------------------------------------------------------------|
| default   | Renders down to `precision` unit chunks                            |
| sub-unit  | Value smaller than `smallest` → renders `< 1 {smallest}`          |
| null      | Renders em-dash `—`                                               |
| zero      | Renders `0 {smallest}`                                            |
| long-form | Singular/plural form via locale-aware formatter                   |

## Accessibility
- Long-form text always available via `aria-label` even when visual form is short
- No icons; readable as plain text by screen readers
- Inline-flex preserves baseline with surrounding numbers

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--duration-chunk-gap`

## Do / Don't
```tsx
// DO
<Duration value={12_320_000} />              // "3h 25m"
<Duration value={45_000} format="long" />    // "45 seconds"

// DON'T — manual math
<span>{Math.floor(ms / 60000)}m {Math.floor((ms % 60000) / 1000)}s</span>

// DON'T — toLocaleString on a Date diff
<span>{new Date(ms).toLocaleTimeString()}</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Sub-second, sub-minute, multi-hour, multi-day each render expected chunks
- `precision` truncates to N chunks
- `smallest`/`largest` clamp the unit range
- `format="long"` renders pluralized words
- `value === null` renders `—`
- Forwards ref; spreads remaining props onto root
- axe-core passes; long-form `aria-label` present in short mode
