---
name: CronInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Radio, Select, Text]
---

# CronInput

> A schedule input that toggles between a friendly preset builder and a raw cron expression for experts.

## Purpose
CronInput exists because cron is unforgiving and most users do not author cron strings — yet operators occasionally need the raw expression for non-standard schedules. The component offers a friendly mode (radio choices for "every hour", "daily at HH:mm", "weekly on …") and an expert mode that surfaces the raw expression with validation. Both modes commit a single canonical cron string upward, so consumers never see two value shapes.

## When to use
- Configuring scheduled jobs, reports, alerts, or syncs
- Any input whose underlying value must be a cron expression
- Fields where both technical and non-technical users must succeed

## When NOT to use
- One-shot scheduling at a specific datetime → use a date+time picker
- Recurrence rules with calendar-style exceptions (RRULE) → out of scope
- Pure interval inputs ("every N minutes") with no clock alignment → use **UnitInput**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for mode stack; `Box direction="row" gap` for inline rows | hand-rolled flex/padding in CSS |
| Mode toggle     | `Radio` group ("Friendly" / "Expert") | raw `<input type="radio">`          |
| Frequency / day pickers | `Select`                     | raw `<select>`                       |
| Raw cron entry  | `Input`                              | raw `<input>` with monospace CSS     |
| Preview / hint  | `Text`                               | raw styled `<span>`                  |

## API contract
```ts
type CronMode = "friendly" | "expert";

interface CronInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string;                        // canonical 5-field cron expression
  onChange: (cron: string) => void;
  mode?: CronMode;                      // default "friendly"
  onModeChange?: (mode: CronMode) => void;
  disabled?: boolean;
  invalid?: boolean;                    // surfaces error state on raw input
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                       |
|----------|--------------------------------------------------------------------------------|
| friendly | Radios + selects build the cron string; raw input hidden                        |
| expert   | `Input` shows the raw cron string; preset controls hidden                       |
| invalid  | In expert mode, `Input` shows error styling and a `Text` hint with the message  |
| preview  | A `Text` line summarizes the schedule in plain English ("Daily at 9:00 AM UTC") |
| disabled | All controls disabled                                                           |

## Accessibility
- Mode toggle is a `Radio` group with a `<legend>` (visually hidden if needed)
- Expert `Input` has `aria-invalid` reflecting `invalid`
- Plain-English preview is the visible accessible name of the schedule, complementing the cron string
- Selects expose human-readable labels ("Monday", not "1")

## Tokens
- Inherits all tokens from `Input`, `Radio`, `Select`
- Adds (component tier): `--cron-input-preview-color`

## Do / Don't
```tsx
// DO
<CronInput value={cron} onChange={setCron} />

// DON'T — render raw cron with no friendly mode
<Input value={cron} onChange={…} placeholder="* * * * *" />

// DON'T — emit non-cron value shape
onChange({ minute: "0", hour: "9" })   // must emit "0 9 * * *"
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Friendly mode: changing frequency / day / time emits the correct cron string
- Expert mode: editing the raw input emits the raw value; invalid input sets `aria-invalid`
- Switching modes preserves the canonical value
- Plain-English preview updates with the value
- Forwards ref; spreads remaining props onto root
- Composition probe: `Radio`, `Select`, `Input` all render inside output
- axe-core passes in friendly, expert, invalid, disabled
