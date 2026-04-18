---
name: LiveIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [real-time-data]
uses: [Box, Dot]
replaces-raw: []
---

# LiveIndicator

> A pulsing dot signaling that a surface is receiving real-time data.

## Purpose
LiveIndicator is the smallest possible affordance for "this is live." It owns the pulse animation, the live/idle/reconnecting visual states, and the prefers-reduced-motion fallback. Every component in the system that needs to signal real-time streaming composes LiveIndicator rather than re-implementing a pulsing dot.

## When to use
- Inside `ConnectionStatus`, `SyncStatus`, or any chrome that conveys streaming state
- Next to a metric or chart that ticks on a websocket
- As a tiny prefix on a card title to indicate the card is "live"

## When NOT to use
- A static health enum (green/yellow/red, no motion) → use **HealthIndicator**
- A status mapping with text → use **StatusBadge**
- A standalone freshness timestamp → use **StalenessBadge**

## Composition (required)
| Concern          | Use                                                   | Never                                |
|------------------|-------------------------------------------------------|--------------------------------------|
| Internal layout  | `Box direction="row" align="center">` (when paired)   | hand-rolled flex/gap in CSS          |
| Core dot         | `Dot variant="success" pulse>` (live state)           | `::before` pseudo with animation     |
| Reconnecting dot | `Dot variant="warning" pulse>`                        | bespoke spinner                      |
| Idle dot         | `Dot variant="neutral">` (no animation)               | hand-rolled grey circle              |

## API contract
```ts
type LiveState = "live" | "reconnecting" | "idle";

interface LiveIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  state?: LiveState;          // default "live"
  size?: "sm" | "md";          // default "sm"
}
```
Forwarded ref targets the root `<span>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                            |
|--------------|---------------------------------------------------------------------|
| live         | Pulsing success `Dot`; animation honors `prefers-reduced-motion`    |
| reconnecting | Pulsing warning `Dot` at a slower cadence                           |
| idle         | Static neutral `Dot`; no animation                                  |
| reduced motion | Pulse replaced with a steady opacity that still distinguishes state |

## Accessibility
- Root `<span>` has `role="status"` and `aria-label` matching the state ("Live", "Reconnecting", "Idle").
- `aria-live="polite"` so state changes are announced once, not on every pulse.
- Animation respects `@media (prefers-reduced-motion: reduce)` — no infinite scaling for users who opt out.
- State is conveyed by both color and label; color alone is never the signal.

## Tokens
- Inherits all tokens from `Dot`
- Adds (component tier): `--live-indicator-pulse-duration`, `--live-indicator-pulse-scale`

## Do / Don't
```tsx
// DO
<LiveIndicator state="live" />
<Box direction="row" align="center" gap="1">
  <LiveIndicator state="reconnecting" />
  <Text size="caption">Reconnecting…</Text>
</Box>

// DON'T — bespoke pulse
<div className="pulse-dot" />

// DON'T — using a Spinner for "live"
<Spinner size="xs" />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `state` renders the correct dot variant
- `prefers-reduced-motion` disables the pulse animation
- `aria-label` matches the state
- `aria-live="polite"` is set
- Composition probe: `Dot` resolves in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every state
