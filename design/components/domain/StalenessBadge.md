---
name: StalenessBadge
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [real-time-data, data-display]
uses: [Box, Text, Icon, Tooltip]
replaces-raw: []
---

# StalenessBadge

> A subtle badge that reads "Data from X minutes ago" and warns when the data has gone stale.

## Purpose
StalenessBadge tells the user how old the data on screen is and escalates its appearance once a freshness threshold is crossed. It owns the threshold-to-variant mapping (fresh / stale / very-stale) and the tooltip that exposes the absolute timestamp on hover so users can verify the relative age.

## When to use
- Above or below a chart, table, or metric panel that doesn't auto-refresh
- Footer of a `Card` showing a snapshot value
- Anywhere the user might mistake stale numbers for current numbers

## When NOT to use
- A live-streaming surface → use **ConnectionStatus** or **LiveIndicator**
- A long-running sync workflow → use **SyncStatus**
- A bare timestamp with no staleness logic → use **Timestamp**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1">`          | hand-rolled flex/gap in CSS          |
| Warning glyph   | `Icon name="clock"` (or `"alert"` when very stale)     | inline `<svg>`                       |
| Relative text   | `Text size="caption" color={staleVariant}>` rendered via `Timestamp` for the relative value | inline date math |
| Hover detail    | `Tooltip content={absoluteTimestamp}>` wrapping root   | `title` attribute                    |

## API contract
```ts
interface StalenessBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  timestamp: Date | string | number;
  freshThresholdMs?: number;        // default 60_000 (1 min)
  staleThresholdMs?: number;        // default 300_000 (5 min)
  prefix?: string;                  // default "Data from"
}
```
Forwarded ref targets the root `<span>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                                |
|--------------|-------------------------------------------------------------------------|
| fresh        | Muted text, clock icon, e.g., "Data from 12 seconds ago"                |
| stale        | Warning-tinted text, clock icon                                         |
| very-stale   | Error-tinted text, alert icon                                           |
| no timestamp | `timestamp` invalid → render em-dash, no tooltip                        |

## Accessibility
- Root `<span>` exposes both relative (visible) and absolute (via `Tooltip` and `aria-describedby`) timestamps.
- Tooltip is keyboard-focusable so the absolute timestamp is reachable without hover.
- Color tier reflects severity but the icon swap (clock → alert) carries the meaning visually for color-blind users.
- `aria-live="polite"` so the relative text update is announced when the threshold flips.

## Tokens
- Inherits all tokens from `Icon`, `Text`, `Tooltip`
- Adds (component tier): `--staleness-badge-gap`

## Do / Don't
```tsx
// DO
<StalenessBadge timestamp={lastFetchedAt} />
<StalenessBadge timestamp={lastFetchedAt} staleThresholdMs={120_000} />

// DON'T — inline date math
<span>{`Data from ${Math.round((Date.now() - ts) / 60000)} min ago`}</span>

// DON'T — `title` attr instead of Tooltip
<span title={absoluteTs}>Data from 5 min ago</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `Timestamp`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Threshold transitions flip variant from fresh → stale → very-stale
- Invalid timestamp renders em-dash without crashing
- `prefix` prop overrides the default copy
- `Tooltip` renders the absolute timestamp
- Composition probe: `Icon` and `Tooltip` resolve in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every state
