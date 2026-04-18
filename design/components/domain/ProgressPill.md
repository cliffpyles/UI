---
name: ProgressPill
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, states]
uses: [Box, ProgressBar, Text]
replaces-raw: []
---

# ProgressPill

> A compact pill pairing a progress bar with a percentage label for long-running operations.

## Purpose
ProgressPill is the canonical inline progress affordance for tabular cells, list rows, and toolbars where a full-width bar is too heavy. It owns the layout that keeps the bar and the percentage label aligned, the indeterminate fallback, and the state-to-color mapping (running, paused, error, complete).

## When to use
- Status column in a job/task table
- Inline progress on a queue item
- Toolbar progress for an export, sync, or import that's not blocking the UI

## When NOT to use
- A modal full-bleed progress indicator → use raw **ProgressBar** inside the modal
- A determinate bar with no count or label → use **ProgressBar** directly
- Sync state with retry → use **SyncStatus**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">`          | hand-rolled flex/gap in CSS          |
| Bar             | `ProgressBar value={value} max={max} variant>`         | raw `<progress>` or styled div       |
| Percentage text | `Text size="caption" variant="tabular-nums">` formatted via `formatNumber`/`formatPercent` | inline `Intl.NumberFormat` |
| Status label    | `Text size="caption" color="muted">` (e.g., "Paused")  | raw styled `<span>`                  |

## API contract
```ts
type ProgressPillState = "running" | "paused" | "error" | "complete" | "indeterminate";

interface ProgressPillProps extends HTMLAttributes<HTMLDivElement> {
  value: number | null;        // 0–max; null when indeterminate
  max?: number;                // default 100
  state?: ProgressPillState;   // default "running"
  label?: string;              // optional status label (e.g., "Uploading")
  showPercent?: boolean;       // default true
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                            |
|----------------|---------------------------------------------------------------------|
| running        | Filled `ProgressBar`; percentage to the right                       |
| paused         | Bar tinted muted; "Paused" label                                    |
| error          | Bar in error variant; percentage replaced by "Failed"               |
| complete       | Bar at 100% in success variant; "Complete" label                    |
| indeterminate  | `ProgressBar` in indeterminate mode; percentage hidden              |

## Accessibility
- `ProgressBar` carries the `role="progressbar"` and `aria-valuenow/min/max` semantics.
- Status changes are announced via `aria-live="polite"` on the root.
- Error and complete states use both color and text — never color alone.
- Indeterminate state honors `prefers-reduced-motion` via the `ProgressBar` primitive.

## Tokens
- Inherits all tokens from `ProgressBar` and `Text`
- Adds (component tier): `--progress-pill-gap`, `--progress-pill-min-width`

## Do / Don't
```tsx
// DO
<ProgressPill value={42} state="running" label="Uploading" />
<ProgressPill value={null} state="indeterminate" label="Queued" />

// DON'T — inline percentage formatting
<span>{(value / max * 100).toFixed(0)}%</span>

// DON'T — bespoke colored bar
<div className="bar"><div style={{width: `${pct}%`}}/></div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatPercent`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `state` renders the correct bar variant and label
- `value === null` switches to indeterminate behavior
- `showPercent={false}` omits the percentage
- `ProgressBar` receives `value` and `max` correctly
- Composition probe: `ProgressBar` resolves in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every state
