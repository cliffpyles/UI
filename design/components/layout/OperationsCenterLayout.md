---
name: OperationsCenterLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, MetricCard, Sparkline, HealthIndicator]
---

# OperationsCenterLayout

> A high-density wall-display frame for live operational metrics, auto-scaling tile sizes to viewport.

## Purpose
OperationsCenterLayout owns the NOC / wall-display page: a `Grid` of `MetricCard`s with embedded `Sparkline`s and `HealthIndicator`s, sized to fill any viewport so the same configuration looks right on a laptop or a 65-inch screen. It owns the auto-scaling rules so individual tiles don't need responsive logic, and it owns the live-region semantics so screen readers don't drown in updates.

## When to use
- Always-on operations / NOC displays
- Executive overview dashboards with live metrics
- Conference-room status walls

## When NOT to use
- Per-system health drill-down → use **StatusPageLayout**
- Searching events → use **LogExplorerLayout**
- Triaging fired alerts → use **AlertFeedLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Grid` with auto-fitting tile tracks               | hand-rolled `display: grid`        |
| Tile stack      | `Box direction="column" gap>` inside a tile        | hand-rolled flex                   |
| Metric tile     | `MetricCard`                                       | inline number JSX                  |
| Trend visual    | `Sparkline`                                        | inline `<svg>` paths               |
| Status dot      | `HealthIndicator`                                  | colored `<span>`                   |

## API contract
```ts
interface OperationsCenterLayoutProps extends HTMLAttributes<HTMLDivElement> {
  tiles: OpsTile[];                          // each tile defines metric, sparkline, health
  density?: "compact" | "comfortable" | "wall";
  refreshIntervalMs?: number;
  liveAnnounce?: boolean;                    // when true, root is aria-live="polite"
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | Tiles laid out via `Grid`'s auto-fit tracks                               |
| loading  | Tiles render their own skeleton via `MetricCard`; root `aria-busy="true"` |
| empty    | When `tiles.length === 0`, an `EmptyState`-styled centered message renders|
| wall     | `density="wall"` increases tile minimums for long-distance reading        |

## Accessibility
- Root is a `<main>` landmark with `aria-label="Operations center"`
- Each tile is a `region` (delegated to `MetricCard`)
- `liveAnnounce` toggles `aria-live="polite"` only — never `assertive` (would spam)
- Color cannot be the only signal: `HealthIndicator` includes shape + label

## Tokens
- Inherits all tokens from `Grid`, `Box`, `MetricCard`, `Sparkline`, `HealthIndicator`
- Adds (component tier): `--ops-center-tile-min`, `--ops-center-tile-gap`, `--ops-center-wall-tile-min`

## Do / Don't
```tsx
// DO
<OperationsCenterLayout
  tiles={[
    { id: "rps", metric: { label: "RPS", value: 12_400 }, sparkline: rpsSeries, health: "ok" },
    { id: "p99", metric: { label: "p99", value: 312, unit: "ms" }, sparkline: p99Series, health: "warn" },
  ]}
  density="wall"
  liveAnnounce
/>

// DON'T — own the grid CSS
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, 320px)" }}>…</div>

// DON'T — inline svg trends
<svg viewBox="…"><path d="…"/></svg>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Sparkline` / `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `MetricValue` via `MetricCard`)
- Inline trend glyphs (▲▼↑↓)
- Hand-rolled `display: grid` / `display: flex` in this component's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section
- `aria-live="assertive"` (always polite for operational telemetry)

## Tests (required coverage)
- Tiles render as `MetricCard`s with `Sparkline` + `HealthIndicator` inside
- `density="wall"` applies the wall-tile-min token
- `liveAnnounce` toggles `aria-live="polite"` on the root
- Empty `tiles` renders the empty centered message
- Forwards ref; spreads remaining props onto root
- Composition probe: `Grid`, `MetricCard`, `Sparkline`, `HealthIndicator` render inside output
- axe-core passes in default, loading, empty, wall
