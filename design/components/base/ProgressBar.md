---
name: ProgressBar
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [states]
uses: [Box, Text]
replaces-raw: ["<progress>"]
---

# ProgressBar

> A horizontal bar communicating completion of a long-running task.

## Purpose
ProgressBar is the canonical determinate / indeterminate progress affordance. It owns the variant-color mapping, optional label + numeric percent header, and the `role="progressbar"` semantics so every long-running task in the product reports progress identically.

## When to use
- A task with a known percent complete (file upload, batch job)
- A task whose duration is unknown but movement should be conveyed (`value={undefined}` → indeterminate)

## When NOT to use
- A short pending action (< 1s) → use **Spinner** primitive
- A multi-step wizard → use **Stepper** (composite)
- Progress on a circular gauge / dial → use **CircularProgress** (when added)

## Composition (required)
| Concern          | Use                                | Never                              |
|------------------|------------------------------------|------------------------------------|
| Header layout    | `Box justify="between">`           | bespoke flex CSS                   |
| Label text       | `Text size="label" weight="medium">` | raw styled `<span>`              |
| Numeric percent  | `Text size="caption" weight="medium" color="secondary" tabularNums>` | hand-rolled `Intl.NumberFormat` |
| Track + fill     | Token-styled `<div>`s (no content / semantics) | `<progress>` (inconsistent platform styling) |

## API contract
```ts
type ProgressBarVariant = "default" | "success" | "warning" | "error";
type ProgressBarSize = "sm" | "md";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;                    // 0..max; undefined → indeterminate
  max?: number;                      // default 100
  variant?: ProgressBarVariant;       // default "default"
  size?: ProgressBarSize;             // default "md"
  label?: string;
  showValue?: boolean;                // default false
}
```

## Required states
| State          | Behavior                                                          |
|----------------|-------------------------------------------------------------------|
| determinate    | Fill width = `value/max` clamped to 0..100; `aria-valuenow` set    |
| indeterminate  | `value === undefined`; fill animates left↔right; `aria-valuenow` omitted |
| with label     | Header renders `label` (left) and, if `showValue`, the percent (right) |
| variant        | Fill color swaps to `--progress-bar-fill-{variant}`                |

## Accessibility
- Track has `role="progressbar"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-label={label}`.
- Indeterminate omits `aria-valuenow`.
- Color is not the only signal — `label` carries the meaning of `success`/`error`.

## Tokens
- Track: `--progress-bar-track-background`
- Fill: `--progress-bar-fill-{default|success|warning|error}`
- Height: `--progress-bar-height-{sm|md}`
- Radius: `--radius-full`
- Duration: `--progress-bar-indeterminate-duration`
- Easing: `--easing-default`

## Do / Don't
```tsx
// DO
<ProgressBar value={42} label="Uploading" showValue />
<ProgressBar value={undefined} label="Processing"/>     // indeterminate

// DON'T — hand-rolled percent string
<ProgressBar value={42} label={`${42}%`} />             // use showValue

// DON'T — label as a styled span
<ProgressBar label={<span style={{ fontWeight: 700 }}>Up</span>}/>
```

## Forbidden patterns (enforced)
- Raw styled `<span>` in the header — use `Text`
- Bespoke flex CSS for the header — use `Box justify="between">`
- Inline `Intl.NumberFormat` / `toLocaleString` — `Text tabularNums>{Math.round(p)}%</Text>` is the pattern
- Native `<progress>` — chrome is inconsistent across browsers
- Hardcoded color, height, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Determinate sets `aria-valuenow` to the rounded percent
- Indeterminate omits `aria-valuenow` and adds the indeterminate class
- `showValue` renders the percent only when determinate
- Each `variant` and `size` renders the correct class
- `value` is clamped to `[0, max]`
- Forwards ref; spreads remaining props
- axe-core passes
