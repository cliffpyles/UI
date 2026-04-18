---
name: AlertFeedLayout
tier: layout
level: 6
status: stable
since: 0.7.0
uses: [Box, ActivityFeed, BannerAlert, Button]
---

# AlertFeedLayout

> A page frame for a chronological alert stream with severity grouping, sticky banner for critical events, and inline acknowledge actions.

## Purpose
AlertFeedLayout owns the on-call console view: the most recent unresolved alerts in chronological order, a `BannerAlert` pinned at the top when something is firing now, and per-row acknowledge / resolve `Button`s. It composes `ActivityFeed` for the stream so day-grouping and pagination behave identically to other feeds, and adds the alert-specific affordances on top.

## When to use
- Operations / on-call dashboards
- Alert inbox or notification center for monitoring
- Any stream where individual events can be acknowledged or resolved

## When NOT to use
- Generic activity (non-actionable) → use **ActivityFeed** directly
- Single critical incident detail → use **IncidentDetailLayout**
- Real-time log lines → use **LogExplorerLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for banner + feed        | hand-rolled `display: grid`/`flex` |
| Critical banner | `BannerAlert`                                      | inline colored `<div>`             |
| Stream          | `ActivityFeed` of alert events                     | reimplementing day-grouped lists   |
| Row actions     | `Button` (acknowledge, resolve, snooze)            | raw `<button>`                     |

## API contract
```ts
interface AlertFeedLayoutProps extends HTMLAttributes<HTMLDivElement> {
  alerts: AlertEvent[];
  criticalBanner?: { title: ReactNode; description?: ReactNode; onDismiss?: () => void };
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onSnooze?: (alertId: string, durationMs: number) => void;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | `ActivityFeed` renders alert events with action `Button`s per row         |
| critical | `BannerAlert` pins to the top; visible above the feed                     |
| loading  | Feed shows skeletons; root has `aria-busy="true"`                         |
| empty    | Feed renders its own `EmptyState` ("No active alerts")                    |
| paginated| Feed renders `Pagination` from `ActivityFeed`                             |

## Accessibility
- Root is a `<main>` landmark with `aria-label="Alerts"`
- Critical banner uses `role="alert"` (delegated to `BannerAlert`)
- Action `Button`s are keyboard-reachable in the row's tab order
- Acknowledge announces the new state via `aria-live="polite"`

## Tokens
- Inherits all tokens from `Box`, `ActivityFeed`, `BannerAlert`, `Button`
- Adds (component tier): `--alert-feed-banner-gap`, `--alert-feed-row-action-gap`

## Do / Don't
```tsx
// DO
<AlertFeedLayout
  alerts={alerts}
  criticalBanner={firing ? { title: "DB latency exceeded SLO", description: "p99 = 1.2s" } : undefined}
  onAcknowledge={ack}
  onResolve={resolve}
/>

// DON'T — inline banner markup
<div className="critical">DB latency …</div>

// DON'T — raw row buttons
<button onClick={() => ack(id)}>Ack</button>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hand-rolled `display: grid` / `display: flex` in this component's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Critical banner renders only when `criticalBanner` is provided
- Acknowledge / resolve / snooze invoke their callbacks with the alert id
- Loading sets `aria-busy` and shows skeletons (delegated to `ActivityFeed`)
- Empty alerts list renders `EmptyState` (delegated)
- Forwards ref; spreads remaining props onto root
- Composition probe: `ActivityFeed`, `BannerAlert` (when active), `Button` render inside output
- axe-core passes in default, critical, loading, empty
