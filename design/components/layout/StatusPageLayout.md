---
name: StatusPageLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, HealthIndicator, Sparkline, ActivityFeed]
---

# StatusPageLayout

> A public or internal status page frame: per-system health grid, uptime sparklines, and an incident history feed.

## Purpose
StatusPageLayout owns the canonical status-page shape: a `Grid` of services each with a `HealthIndicator` and rolling `Sparkline`, followed by an incident-history `ActivityFeed`. It exists so every internal team and external status page reads the same way — health up top, history below — without each surface reinventing the layout or skipping accessibility for color-only health states.

## When to use
- Public-facing service status pages
- Internal "is X up?" overview pages
- Customer dashboards summarizing service health + recent incidents

## When NOT to use
- Live wall display of metrics → use **OperationsCenterLayout**
- Single incident drill-down → use **IncidentDetailLayout**
- Active alert triage → use **AlertFeedLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Grid` with named tracks `health` + `history`      | hand-rolled `display: grid`        |
| Service grid    | `Grid` of service tiles                            | hand-rolled `display: grid`        |
| Tile stack      | `Box direction="column" gap>` per tile             | hand-rolled flex                   |
| Health pip      | `HealthIndicator`                                  | colored `<span>` only              |
| Uptime trend    | `Sparkline`                                        | inline `<svg>`                     |
| Incident history| `ActivityFeed`                                     | reimplementing day-grouped lists   |

## API contract
```ts
interface StatusPageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  services: ServiceHealth[];                  // each: id, name, status, uptimeSeries
  incidents: ActivityEvent[];
  overallStatus: "ok" | "degraded" | "down";
  lastUpdated: Date | string;
  onIncidentSelect?: (incidentId: string) => void;
}
```
Forwards ref to the root `<div>`.

## Required states
| State     | Behavior                                                                  |
|-----------|---------------------------------------------------------------------------|
| default   | Overall `HealthIndicator` + service grid + incident `ActivityFeed`        |
| degraded  | Overall indicator reflects worst service status                           |
| empty     | No incidents → `ActivityFeed`'s `EmptyState` ("No recent incidents")      |
| loading   | Service tiles + feed render skeletons; root `aria-busy="true"`            |

## Accessibility
- Root is a `<main>` landmark with `aria-label="Service status"`
- Overall status is rendered as text alongside the indicator (color is not the only signal)
- Each service tile is a `region` with the service name as the accessible label
- Incident feed delegates `role="feed"` semantics to `ActivityFeed`

## Tokens
- Inherits all tokens from `Grid`, `Box`, `HealthIndicator`, `Sparkline`, `ActivityFeed`
- Adds (component tier): `--status-page-tile-min`, `--status-page-section-gap`

## Do / Don't
```tsx
// DO
<StatusPageLayout
  services={services}
  incidents={incidents}
  overallStatus={overall}
  lastUpdated={updatedAt}
/>

// DON'T — own the service grid CSS
<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>…</div>

// DON'T — color-only health
<span className={status==='ok'?'green':'red'} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Sparkline` / `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hand-rolled `display: grid` / `display: flex` in this component's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section
- Communicating status via color only (must include label / icon)

## Tests (required coverage)
- Each service renders a `HealthIndicator` and a `Sparkline`
- Overall indicator matches `overallStatus` and includes a textual label
- Incident `ActivityFeed` renders; empty incidents show its `EmptyState`
- `onIncidentSelect` fires when an incident row is activated
- Forwards ref; spreads remaining props onto root
- Composition probe: `Grid`, `HealthIndicator`, `Sparkline`, `ActivityFeed` render inside output
- axe-core passes in default, degraded, empty, loading
