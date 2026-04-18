---
name: Timestamp
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Tooltip]
replaces-raw: ["<time>"]
---

# Timestamp

> A date/time rendered in relative or absolute form, with the alternate form on hover.

## Purpose
Timestamp renders "5 min ago" / "Apr 18, 2026, 10:32" consistently across the product. It owns the relative-vs-absolute toggle, the tooltip-on-hover that shows the alternate form, and the underlying `<time datetime>` element. It is the only component permitted to render a `<time>` tag.

## When to use
- "Last seen", "created at", "updated at" in lists and detail views
- Audit log timestamps
- Any single point in time displayed to a user

## When NOT to use
- A two-date span → use **DateRange**
- A duration without an anchor → use **Duration**
- An editable date input → use **FormField** with a date input

## Composition (required)
| Concern          | Use                                            | Never                          |
|------------------|------------------------------------------------|--------------------------------|
| Internal layout  | `Box display="inline-flex" align="baseline">`  | hand-rolled inline CSS         |
| Visible value    | `Text size="inherit">` inside a `<time>` element | raw styled `<span>`         |
| Hover alternate  | `Tooltip>` showing the opposite form           | hand-rolled tooltip            |
| Null             | `Text>—</Text>`                                | empty render                   |

## API contract
```ts
interface TimestampProps extends HTMLAttributes<HTMLTimeElement> {
  value: Date | string | number | null;
  display?: "relative" | "absolute";   // default "relative"
  format?: "short" | "medium" | "long";
  locale?: string;
  showTooltip?: boolean;               // default true
  tickSeconds?: number;                // refresh interval for relative; default 60
}
```

## Required states
| State        | Behavior                                                         |
|--------------|------------------------------------------------------------------|
| relative     | "5 min ago" / "in 2 hours"; updates on `tickSeconds`             |
| absolute     | "Apr 18, 2026, 10:32" per locale and `format`                    |
| null         | Renders em-dash `—`                                              |
| hover        | Tooltip shows opposite form                                      |
| just now     | Less than 30s ago → "just now"                                   |

## Accessibility
- Renders an `<time datetime={iso}>` element so assistive tech reads ISO form
- Tooltip is opt-out via `showTooltip={false}`; tooltip content is announced on focus
- Live updates do not move focus or announce on every tick

## Tokens
- Inherits typography tokens from `Text`
- Adds: `--timestamp-gap`

## Do / Don't
```tsx
// DO
<Timestamp value={createdAt} />
<Timestamp value={due} display="absolute" format="long" />

// DON'T — manual relative formatting
<span>{Math.floor((Date.now() - t) / 60000)}m ago</span>

// DON'T — raw <time> element elsewhere
<time dateTime={iso}>{label}</time>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Raw `<time>` outside this component
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Relative mode shows "just now", "5 min ago", "in 2 hours" at the right boundaries
- Absolute mode honors `locale` and `format`
- `value === null` renders `—`
- `showTooltip` toggles the tooltip
- `<time datetime>` carries ISO 8601 form
- Forwards ref; spreads remaining props onto root
- axe-core passes
