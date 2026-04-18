---
name: SmartDateRange
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search]
uses: [Box, Input, Button, Popover]
replaces-raw: []
---

# SmartDateRange

> A date-range picker with domain presets (Today, Last 7 days, Last 30 days, This quarter, Custom).

## Purpose
SmartDateRange is the canonical "pick a time window" control for analytics and data tools. It owns the preset list ("Today", "Yesterday", "Last 7 days", "Last 30 days", "This month", "Last month", "This quarter", "Year to date", "Custom"), the trigger that displays the current selection in human terms, the popover that contains the presets and a custom-range picker, and the conversion between presets and concrete `{ from, to }` date ranges. Calendar rendering (the actual day grid) is delegated to a `Calendar` primitive composed inside the popover; this spec stipulates that `SmartDateRange` does not draw days itself.

## When to use
- Time-window selectors above charts and dashboards
- "Created between" / "Updated between" filters in data tables
- Report scoping controls where preset windows dominate over manual ranges

## When NOT to use
- Picking a single date — use a `DatePicker` (or `Input type="date"` for low-stakes fields)
- A free-form duration ("Every 2 hours") — use a dedicated interval picker
- A scheduling control with timezones, recurrences, etc. — out of scope

## Composition (required)
| Concern             | Use                                                              | Never                                              |
|---------------------|------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" gap="3"` (presets column + custom column)    | hand-rolled `display: flex` in `.css`              |
| Trigger             | `Button variant="ghost"` with leading icon                        | raw `<button>` with manual aria-expanded wiring    |
| Floating layer      | `Popover` (portal, positioning, dismissal)                        | hand-rolled portal / position math                 |
| Custom range fields | `Input type="date"` (start, end)                                  | raw `<input type="date">`                          |
| Preset items        | `Button variant="ghost"` per preset                               | raw `<button>` or `<li onClick>`                   |

## API contract
```ts
type Preset =
  | "today" | "yesterday"
  | "last_7_days" | "last_14_days" | "last_30_days"
  | "this_month" | "last_month"
  | "this_quarter" | "last_quarter"
  | "ytd" | "custom";

interface DateRange {
  from: string;          // ISO date (yyyy-mm-dd)
  to: string;            // ISO date (yyyy-mm-dd), inclusive
  preset?: Preset;       // when set, the range was selected via a preset
}

interface SmartDateRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Preset[];                   // override default catalog
  min?: string;                          // earliest selectable ISO date
  max?: string;                          // latest selectable ISO date
  align?: "start" | "end";              // popover alignment, default "start"
  disabled?: boolean;
}
```
The component forwards its ref to the trigger element and spreads remaining props onto the root wrapper.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | Trigger shows the active range in human form ("Last 30 days" or "Mar 1 – Mar 31") |
| open             | Popover with preset list on the left and custom range fields on the right |
| custom           | Selecting "Custom" focuses the start date input                           |
| invalid range    | When start > end, range is flagged and `onChange` is not called           |
| out of bounds    | Dates outside `[min, max]` are non-selectable                             |
| disabled         | Trigger is non-interactive                                                |

## Accessibility
- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Popover content has `role="dialog"` with `aria-label="Select date range"`
- Preset buttons expose the resulting range via `aria-description` or visible secondary text
- Custom-range inputs are labeled "Start date" / "End date" via underlying `Input` labels
- Escape closes and restores focus to the trigger

## Tokens
- Inherits all chrome tokens from `Popover`, `Input`, and `Button`
- Adds: `--smart-date-range-gap`, `--smart-date-range-preset-min-width`
- No component-specific colors

## Do / Don't
```tsx
// DO
<SmartDateRange value={range} onChange={setRange}/>

// DO — custom preset catalog
<SmartDateRange value={range} onChange={setRange} presets={["today","last_7_days","custom"]}/>

// DON'T — hand-rolled date inputs and presets
<input type="date"/> – <input type="date"/>
<button onClick={...}>Last 7 days</button>

// DON'T — using SmartDateRange for a single date
<SmartDateRange value={{ from: d, to: d }} .../>   // use a DatePicker
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString` (date formatting must go through the design system's `formatDate`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` (use `Icon`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger label reflects `value` (preset label vs explicit range)
- Selecting a preset emits the resolved `{ from, to, preset }`
- Custom range fields emit `{ from, to, preset: "custom" }`
- Invalid range (start > end) does not invoke `onChange`
- `min`/`max` constrain selectable dates
- Escape closes the popover and restores focus
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Popover`, `Input`, `Button` all render
- axe-core passes in closed, open, and disabled
