---
name: DueDateIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Text, Icon, Tooltip]
replaces-raw: []
---

# DueDateIndicator

> A date display whose color and icon shift based on overdue / due-soon / on-time status.

## Purpose
DueDateIndicator owns the "is this late?" visual rule for any date in the product. It maps a target date and a status (or current time) to the right token color and icon, and exposes the absolute date in a tooltip. Centralizing this prevents every list/table/card from inventing its own "red if overdue" logic.

## When to use
- Task / ticket / invoice rows that need a due-date column
- Card surfaces that show a deadline
- Any place where the relationship between a date and "now" matters

## When NOT to use
- A neutral date display with no urgency semantics → use **Timestamp**
- A date range → use **DateRange** (existing domain component)
- A static deadline label inside header copy → render plain `Text`

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="1">` | hand-rolled flex/gap     |
| Status icon     | `Icon size="sm">`                  | inline `<svg>`                     |
| Date text       | `Text size="sm">` (display string from formatter util) | raw styled `<span>` with formatting CSS |
| Tooltip         | `Tooltip>` wrapping the row, showing the absolute date | raw `title=""` attribute |

## API contract
```ts
type DueStatus = "ontime" | "due-soon" | "overdue" | "complete";

interface DueDateIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  date: Date | string;
  status?: DueStatus;                 // when omitted, derived from date vs. now
  format?: "relative" | "short" | "medium";    // default "short"
  completed?: boolean;                // when true, shows complete state
}
```
Component uses `forwardRef<HTMLSpanElement, DueDateIndicatorProps>`. Date display uses the shared `formatDate`/`formatRelative` util — never inline `Intl.*`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| ontime       | Neutral icon + neutral text token                                 |
| due-soon     | Warning icon + warning text token                                 |
| overdue      | Error icon + error text token                                     |
| complete     | Check icon + muted/strikethrough-token text                       |
| no-date      | `date == null` → renders em-dash and tooltip "No due date"        |

## Accessibility
- Status is conveyed by both icon and text token — never color alone.
- The `Tooltip` exposes the absolute date so users can see the unambiguous value.
- The date string is wrapped in a `<time datetime="…">` (semantic HTML, no component owner) inside the `Text`.

## Tokens
- Text color: `--due-date-text-{ontime|due-soon|overdue|complete}`
- Icon color: `--due-date-icon-{ontime|due-soon|overdue|complete}`
- Gap inherited from `Box`: `--space-1`

## Do / Don't
```tsx
// DO
<DueDateIndicator date={task.dueAt} format="relative" />
<DueDateIndicator date={task.dueAt} status="overdue" />

// DON'T — inline date math
<span>{Math.floor((Date.now() - +d)/86400000)} days ago</span>

// DON'T — toLocaleString
<DueDateIndicator date={d.toLocaleString()} />     // pre-format upstream is fine; inline call here is forbidden
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `Intl.DateTimeFormat` / `toLocaleString` (use formatter utils)
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Status derivation: today/yesterday/tomorrow → correct status when `status` omitted
- Each `status` renders the correct icon + token color
- `completed` overrides status visuals
- `format` controls the rendered string via the formatter
- Tooltip shows the absolute date
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Icon"]` and `[data-component="Tooltip"]` resolve
- axe-core passes for each state
