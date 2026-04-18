---
name: HealthIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, real-time-data]
uses: [Box, Dot, Text, Icon]
replaces-raw: []
---

# HealthIndicator

> A green/yellow/red dot with text describing the health of a system, service, or check.

## Purpose
HealthIndicator owns the canonical mapping from health enum (healthy / degraded / unhealthy / unknown) to a colored dot, an accessible icon, and a label. It exists so monitoring surfaces — service maps, status pages, dependency lists — present health uniformly and never communicate severity through color alone.

## When to use
- Service or dependency rows in an operations dashboard
- Status page entries
- Inline health summaries inside a `Card` or table cell

## When NOT to use
- A pulsing "data is streaming" indicator → use **LiveIndicator**
- A status enum unrelated to system health (active, archived, draft) → use **StatusBadge**
- A long progress bar for a health check in progress → use **ProgressPill**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2"`           | hand-rolled flex/gap in CSS          |
| Color dot       | `Dot variant={healthVariant}>`                         | `::before` pseudo with bg color      |
| Severity icon   | `Icon name={"check"|"alert"|"x"|"help"}>`              | inline `<svg>`                       |
| Label text      | `Text size="body" color="default">`                    | raw styled `<span>`                  |

## API contract
```ts
type Health = "healthy" | "degraded" | "unhealthy" | "unknown";

interface HealthIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  health: Health;
  label?: string;             // override default label
  showIcon?: boolean;         // default true; pair with dot for non-color signal
  size?: "sm" | "md";
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State      | Behavior                                                                  |
|------------|---------------------------------------------------------------------------|
| healthy    | Green `Dot` + `Icon name="check"` + "Healthy"                             |
| degraded   | Yellow `Dot` + `Icon name="alert"` + "Degraded"                           |
| unhealthy  | Red `Dot` + `Icon name="x"` + "Unhealthy"                                 |
| unknown    | Neutral `Dot` + `Icon name="help"` + "Unknown"                            |

## Accessibility
- Root has `role="status"` so assistive tech can read the current health.
- Health is communicated by `Dot` + `Icon` + `Text`; color is never the only signal.
- `aria-label` on the root summarizes the state ("Healthy", "Degraded — billing-api").
- Color tokens map to color-blind-safe primaries from semantic tier.

## Tokens
- Inherits all tokens from `Dot`, `Icon`, `Text`
- Adds (component tier): `--health-indicator-gap`

## Do / Don't
```tsx
// DO
<HealthIndicator health="healthy" />
<HealthIndicator health="degraded" label="Degraded — billing-api" />

// DON'T — color-only signal
<span style={{color: "red"}}>Down</span>

// DON'T — bespoke colored dot
<div className="dot dot-red" />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `health` value renders the correct dot variant, icon, and label
- `showIcon={false}` omits the icon (dot still present for non-color signal)
- `label` prop overrides default copy
- `aria-label` includes the health value
- Composition probe: `Dot` and `Icon` resolve in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every health value
