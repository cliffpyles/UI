---
name: ScheduledDeliveryLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [forms]
uses: [Box, FormField, Select, Input, Button]
replaces-raw: []
---

# ScheduledDeliveryLayout

> A grouped form for configuring frequency, time, recipients, and format of a recurring delivery.

## Purpose
Scheduled exports, digests, and report deliveries all collect the same handful of inputs: cadence, time-of-day, recipients, and output format. ScheduledDeliveryLayout owns the grouping, ordering, and validation seams so every "schedule this" surface presents the same field set in the same order with the same submit/cancel ergonomics.

## When to use
- Scheduling a recurring report email or webhook delivery
- Configuring a digest (daily summary, weekly rollup) for any data surface
- Setting up automated exports that fire on a schedule

## When NOT to use
- A one-time, ad-hoc download → use **ExportConfigurationLayout**
- A list of existing scheduled jobs → use **DataTable** with custom row renderers
- Just sharing a link, no schedule → use **SharedLinkLayout**

## Composition (required)
| Concern             | Use                                                  | Never                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Frame layout        | `Box direction="column" gap>`                        | hand-rolled flex CSS                   |
| Frequency / format  | `FormField` wrapping `Select`                        | raw `<select>`                         |
| Time-of-day         | `FormField` wrapping `Select` (or scheduled `Input`) | raw `<input type="time">`              |
| Recipient list      | `FormField` wrapping `Input` (multi-entry)           | raw `<input>`                          |
| Action row          | `Box direction="row" justify="end" gap>`             | hand-rolled flex CSS                   |
| Save / cancel       | `Button` (primary + ghost)                           | raw `<button>`                         |

## API contract
```ts
type Frequency = "daily" | "weekly" | "monthly" | "quarterly";
type DeliveryFormat = "csv" | "xlsx" | "pdf" | "json";

interface ScheduledDeliveryValue {
  frequency: Frequency;
  timeOfDay: string;                  // "HH:mm" 24-hour
  timezone: string;                   // IANA tz id
  recipients: string[];
  format: DeliveryFormat;
  enabled: boolean;
}

interface ScheduledDeliveryLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit" | "children"> {
  defaultValue?: Partial<ScheduledDeliveryValue>;
  frequencies?: Frequency[];
  formats: DeliveryFormat[];
  timezones?: string[];
  onSubmit: (value: ScheduledDeliveryValue) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State       | Behavior                                                              |
|-------------|-----------------------------------------------------------------------|
| default     | All fields rendered with `defaultValue` applied                       |
| validation  | FormField errors surface inline; submit disabled until resolved       |
| submitting  | Save `Button` shows `loading`; all fields disabled                    |
| disabled    | When `enabled === false`, schedule fields dim but remain visible      |

## Accessibility
- Each input wrapped in `FormField` for programmatic label and error association
- Recipient list announces additions/removals via the `FormField` description slot
- Submit button reflects `aria-busy` while `submitting`
- Frequency/timezone selects are keyboard-navigable via `Select`

## Tokens
- Inherits all tokens from `Box`, `FormField`, `Select`, `Input`, `Button`
- Adds (component tier): `--scheduled-delivery-section-gap`

## Do / Don't
```tsx
// DO
<ScheduledDeliveryLayout
  frequencies={["daily", "weekly", "monthly"]}
  formats={["csv", "xlsx"]}
  onSubmit={save}
  onCancel={close}
/>

// DON'T — raw selects for cadence
<select><option>Daily</option></select>

// DON'T — bespoke recipient input
<input placeholder="emails, comma separated"/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ScheduledDeliveryLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders all required FormFields with default values applied
- `onSubmit` receives the merged value
- `submitting` disables fields and marks the save button busy
- Cancel button invokes `onCancel`
- Composition probes: `Box`, `FormField`, `Select`, `Input`, `Button` resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes in default and submitting states
