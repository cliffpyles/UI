---
name: SyncStatus
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [real-time-data, states]
uses: [Box, Icon, Text, Button, Timestamp]
replaces-raw: []
---

# SyncStatus

> Sync state, last-synced timestamp, and a retry action — combined into a single chrome element.

## Purpose
SyncStatus is the canonical affordance for "this surface synchronizes with a backend." It owns the sync state mapping (idle / syncing / synced / error), the last-synced timestamp slot, and the retry control — so that every integration page, settings panel, and offline-capable surface speaks about sync the same way.

## When to use
- Header of an integration detail page
- Settings panel for any external system that pushes/pulls
- Toolbar of an offline-capable editor

## When NOT to use
- A passive "this is live" indicator with no manual retry → use **ConnectionStatus**
- A long-running progress operation → use **ProgressPill**
- A bare freshness stamp → use **StalenessBadge**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2">`          | hand-rolled flex/gap in CSS          |
| State icon      | `Icon name={"refresh"|"check"|"alert"}>`               | inline `<svg>`                       |
| State copy      | `Text size="caption" color={stateColor}>`              | raw styled `<span>`                  |
| Last-synced     | `Timestamp value={lastSyncedAt} relative>`             | inline `Date#toLocaleString`         |
| Retry control   | `Button variant="ghost" size="sm" iconLeading={Icon}>` | raw `<button>` with `<svg>`          |

## API contract
```ts
type SyncState = "idle" | "syncing" | "synced" | "error";

interface SyncStatusProps extends HTMLAttributes<HTMLDivElement> {
  state: SyncState;
  lastSyncedAt?: Date | string | number | null;
  onRetry?: () => void;          // when present and state==="error", retry button shown
  retryLabel?: string;           // default "Retry"
  errorMessage?: string;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| idle     | Neutral icon + "Not synced"; timestamp omitted                            |
| syncing  | Spinning refresh icon + "Syncing…"; retry hidden                          |
| synced   | Check icon (success) + "Synced" + relative `Timestamp` of `lastSyncedAt`  |
| error    | Alert icon (error) + `errorMessage` + `Button` retry when `onRetry` set   |

## Accessibility
- Root has `role="status"` and `aria-live="polite"` so state changes are announced once.
- Retry `Button` carries its own focus, `aria-label`, and disabled semantics.
- The spinning icon respects `prefers-reduced-motion` (steady icon when reduced).
- State conveyed by icon + text — never color alone.

## Tokens
- Inherits all tokens from `Icon`, `Text`, `Button`, `Timestamp`
- Adds (component tier): `--sync-status-gap`

## Do / Don't
```tsx
// DO
<SyncStatus state="synced" lastSyncedAt={syncedAt} />
<SyncStatus state="error" errorMessage="Auth expired" onRetry={resync} />

// DON'T — bespoke retry button
<button onClick={resync}>↻ Retry</button>

// DON'T — inline timestamp
<span>{new Date(syncedAt).toLocaleString()}</span>
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
- Each `state` renders the correct icon and copy
- `state="error"` with `onRetry` shows the retry button; click invokes `onRetry`
- `state="error"` without `onRetry` hides the retry button
- `lastSyncedAt` renders via `Timestamp` only when state==="synced"
- Composition probe: `Icon`, `Timestamp`, and `Button` resolve in the appropriate states
- Forwards ref; spreads remaining props onto root
- axe-core passes for every state
