---
name: DateRange
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text]
replaces-raw: []
---

# DateRange

> A two-date span rendered with a consistent separator and locale-aware formatting.

## Purpose
DateRange renders "Apr 1 – Apr 18, 2026" everywhere the product needs to show a span — report periods, filter chips, billing cycles, audit windows. It owns separator choice, redundant-part collapsing (same year/month), and null/open-ended handling.

## When to use
- A reporting period, billing cycle, or filter window
- A start–end pair on an event, subscription, or campaign
- Anywhere two `Timestamp`s would otherwise be glued together by the caller

## When NOT to use
- A single date or moment in time → use **Timestamp**
- A duration without anchored endpoints ("3 days") → use **Duration**
- An interactive date-range picker → use **FormField** with a date-range input

## Composition (required)
| Concern         | Use                                            | Never                            |
|-----------------|------------------------------------------------|----------------------------------|
| Internal layout | `Box display="inline-flex" align="baseline" gap="xs">` | hand-rolled flex/inline CSS |
| Each endpoint   | `Text size="inherit">`                         | raw styled `<span>`              |
| Separator       | `Text color="secondary" aria-hidden="true">`   | raw character with CSS           |
| Open-ended end  | `Text>—</Text>` for missing endpoint           | blank render                     |

## API contract
```ts
interface DateRangeProps extends HTMLAttributes<HTMLSpanElement> {
  start: Date | string | null;
  end: Date | string | null;
  locale?: string;
  format?: "short" | "medium" | "long";
  collapse?: boolean;        // default true → "Apr 1 – 18, 2026"
  separator?: "en-dash" | "to";   // default "en-dash"
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Both endpoints rendered with separator                                |
| same year       | When `collapse`, shared year rendered once at the end                 |
| same month      | When `collapse`, shared month rendered once at the start              |
| open start      | `start === null` → `— – end`                                          |
| open end        | `end === null` → `start – —` (or "Present" via copy slot)             |
| both null       | Renders single em-dash `—`                                            |

## Accessibility
- Visible separator marked `aria-hidden`; an `aria-label` on the root carries the spelled-out form ("April 1 to April 18, 2026")
- Endpoints rendered in document order regardless of locale presentation
- Honors locale via `Intl.DateTimeFormat` — no manual month names

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--date-range-separator-gap`

## Do / Don't
```tsx
// DO
<DateRange start={periodStart} end={periodEnd} />
<DateRange start={subscribedAt} end={null} />   // open-ended

// DON'T — manual concatenation
<span>{format(start)} - {format(end)}</span>

// DON'T — two Timestamps glued together
<><Timestamp value={start}/> – <Timestamp value={end}/></>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` outside the central formatter utility
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders both endpoints with the configured separator
- `collapse` collapses redundant year/month
- Open-ended start or end renders em-dash on the missing side
- Both null renders single em-dash
- Forwards ref; spreads remaining props onto root
- axe-core passes; root carries spelled-out `aria-label`
