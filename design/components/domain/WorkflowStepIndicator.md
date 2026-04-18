---
name: WorkflowStepIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Text, Icon]
replaces-raw: []
---

# WorkflowStepIndicator

> A linear progress indicator for multi-step processes — completed, current, pending.

## Purpose
WorkflowStepIndicator is the canonical horizontal stepper for wizards, onboarding flows, checkout/setup processes, and any UI that walks the user through a known sequence. It owns the dot-or-number, connector line, and current/completed/pending styling so every multi-step surface in the product looks the same.

## When to use
- A multi-step form or wizard ("Account → Plan → Payment")
- An onboarding checklist with sequential ordering
- A status display for a known-length pipeline

## When NOT to use
- Open-ended workflow status → use **WorkflowStatePicker**
- A loading bar or determinate task progress → use **ProgressBar** primitive
- A side-rail navigation / TOC → use a navigation component, not a stepper

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">` for the row of steps | hand-rolled flex/gap |
| Per-step layout | `Box direction="column" align="center" gap="1">` (marker + label) | hand-rolled flex/gap |
| Step marker (number/dot) | rendered with `Text size="caption" weight="medium">` inside a token-styled marker (the marker's circle uses a `Box` with token border/background — no raw `<div>` with chrome CSS) | raw styled `<span>` markers |
| Completed glyph | `Icon name="check" size="sm">`     | inline `<svg>` / `✓` text          |
| Step label      | `Text size="caption" color="secondary">` | raw styled `<span>`          |
| Connector line  | `Box>` styled via tokens (border) between markers | raw `<hr>` / styled `<div>` |

## API contract
```ts
type StepStatus = "complete" | "current" | "pending";

interface WorkflowStep {
  id: string;
  label: ReactNode;
  status: StepStatus;
}

interface WorkflowStepIndicatorProps extends HTMLAttributes<HTMLOListElement> {
  steps: WorkflowStep[];
  ariaLabel?: string;                 // default "Progress"
}
```
Component uses `forwardRef<HTMLOListElement, WorkflowStepIndicatorProps>`. Root renders as semantic `<ol>` (no component wrapper exists; native list semantics are required and the only allowed raw element here).

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| complete     | Marker shows check `Icon`; connector to next step rendered as completed token |
| current      | Marker shows step number with primary token; label emphasized     |
| pending      | Marker dim; label muted; connector after it rendered as pending token |
| first / last | First step has no leading connector; last step has no trailing connector |

## Accessibility
- Root is `<ol>` with `aria-label` (default "Progress").
- Each step is `<li>` with `aria-current="step"` when `status === "current"`.
- Status is conveyed by both icon/number and text — never color alone.
- Decorative connectors are `aria-hidden`.

## Tokens
- Marker surface: `--step-marker-surface-{complete|current|pending}`
- Marker text: `--step-marker-text-{complete|current|pending}`
- Marker border: `--step-marker-border-{complete|current|pending}`
- Connector: `--step-connector-{complete|pending}`
- Label color: `--step-label-{current|other}`
- Gap inherited from `Box`: `--space-1`, `--space-2`

## Do / Don't
```tsx
// DO
<WorkflowStepIndicator steps={[
  { id: "a", label: "Account", status: "complete" },
  { id: "b", label: "Plan", status: "current" },
  { id: "c", label: "Payment", status: "pending" },
]} />

// DON'T — color-only
<div className="dot blue"/><div className="dot gray"/>

// DON'T — check glyph as text
<span>✓ Done</span>     // use Icon name="check"
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`) — use `Icon` for the check
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each step renders correct marker per `status` (number vs. check)
- Current step has `aria-current="step"`
- First step omits leading connector; last step omits trailing connector
- `ariaLabel` is applied to the root `<ol>`
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Icon"]` resolves for completed steps; `[data-component="Text"]` for labels
- axe-core passes with mixed step statuses
