---
name: ConnectionStatus
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [real-time-data]
uses: [Box, LiveIndicator, Text, Icon]
replaces-raw: []
---

# ConnectionStatus

> A compact indicator pairing a live/offline signal with a "last updated" timestamp.

## Purpose
ConnectionStatus tells the user whether the surface they're looking at is currently receiving live data and, if not, when it was last refreshed. It owns the mapping from connection state ("live" | "reconnecting" | "offline") to the visual signal and the accompanying copy so every dashboard chrome speaks the same language about freshness.

## When to use
- Header chrome of a dashboard or analytics view that streams data
- Any data surface where the user must distinguish live, stale, and offline states
- Status rail next to a chart that auto-updates

## When NOT to use
- A pure "data freshness" stamp with no live channel — use **StalenessBadge**
- A long-running sync flow with retry — use **SyncStatus**
- A bare pulsing dot with no context — use **LiveIndicator**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2"`           | hand-rolled flex/gap in CSS          |
| Live signal     | `LiveIndicator state={connectionState}`                | bespoke pulsing dot                  |
| Offline glyph   | `Icon name="wifi-off"` (or equivalent)                 | inline `<svg>`                       |
| Status text     | `Text size="caption" color="muted">`                   | raw styled `<span>`                  |
| Timestamp       | `Text size="caption" color="subtle">` rendered via `Timestamp` for the relative value | inline `Date#toLocaleString` |

## API contract
```ts
type ConnectionState = "live" | "reconnecting" | "offline";

interface ConnectionStatusProps extends HTMLAttributes<HTMLDivElement> {
  state: ConnectionState;
  lastUpdated?: Date | string | number | null;
  label?: string;                   // override the default state copy
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                                |
|----------------|-------------------------------------------------------------------------|
| live           | `LiveIndicator` pulses; copy "Live"; timestamp hidden or de-emphasized  |
| reconnecting   | `LiveIndicator` in transitional state; copy "Reconnecting…"             |
| offline        | `Icon name="wifi-off"` replaces the dot; copy "Offline"; timestamp shown |
| no timestamp   | `lastUpdated == null` → only the state signal renders                   |

## Accessibility
- Root has `role="status"` and `aria-live="polite"` so changes are announced once.
- State is conveyed by icon + text, never color alone.
- `LiveIndicator` carries the pulse semantics; do not override its aria.
- The timestamp is read as relative ("2 minutes ago") and exposed as absolute via `<Timestamp title>`.

## Tokens
- Inherits all tokens from `LiveIndicator`, `Icon`, `Text`
- Adds (component tier): `--connection-status-gap`

## Do / Don't
```tsx
// DO
<ConnectionStatus state="live" lastUpdated={lastTick} />
<ConnectionStatus state="offline" lastUpdated={lastTick} />

// DON'T — bespoke pulsing dot
<div className="pulse" />

// DON'T — inline date formatting
<span>{new Date(lastUpdated).toLocaleString()}</span>
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
- Each `state` renders the correct signal and copy
- `lastUpdated == null` omits the timestamp
- `aria-live="polite"` is set on the root
- Composition probe: `LiveIndicator` resolves in the rendered output for live/reconnecting
- Composition probe: `Icon` resolves for offline
- Forwards ref; spreads remaining props onto root
- axe-core passes for live, reconnecting, offline
