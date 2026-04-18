---
name: ActivityItem
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, UserChip, Text, Timestamp, Button]
---

# ActivityItem

> A single feed entry rendering an actor, action verb, target, relative timestamp, and optional inline actions.

## Purpose
ActivityItem is the atomic row inside an activity stream. It standardizes the actor → action → target → time layout that appears across notifications, audit drawers, and project timelines, and it composes the right primitives so the actor link, target link, and timestamp behavior are consistent everywhere. ActivityFeed groups these; consumers can also render a single one inline.

## When to use
- One row inside an `ActivityFeed`
- A standalone "last activity" line on a card or detail header
- Notification entries in a popover

## When NOT to use
- A whole audit log row with IP / user agent → use **AuditEntry**
- A threaded comment with reactions → use **CommentThread**
- A pure key/value detail row → use a list / definition component

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="start" gap` for actor + body; `Box direction="column"` for body lines | hand-rolled flex / padding in CSS |
| Actor           | `UserChip` (peer domain component)   | inline avatar + name JSX             |
| Action / target text | `Text`                          | raw styled `<span>`                  |
| Timestamp       | `Timestamp` (peer domain component)  | inline `new Date().toLocaleString()` |
| Inline actions  | `Button variant="ghost" size="sm"`   | raw `<button>`                       |

## API contract
```ts
interface ActivityItemProps extends HTMLAttributes<HTMLElement> {
  actor: { id: string; name: string; avatarUrl?: string };
  action: ReactNode;                    // verb phrase, e.g. "updated"
  target?: ReactNode;                   // target name or link
  occurredAt: Date | string;
  actions?: { label: string; onSelect: () => void }[];
}
```
Renders as `<article>` (forwards ref to it). Spreads remaining props onto the root.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| default  | Actor + "<action> <target>" + relative `Timestamp`                        |
| no-target| Same row without the target slot                                          |
| with-actions | Action buttons appear at the row trailing edge                       |
| compact  | Density-aware: `[data-density="compact"]` reduces gaps and avatar size    |

## Accessibility
- Root is `<article>` with an `aria-label` that includes actor, action, and target as plain text
- `Timestamp` provides both a visible relative form and a `<time datetime>` machine value
- Inline `Button`s have explicit `aria-label`s when their visible text is icon-only

## Tokens
- Inherits all tokens from `UserChip`, `Text`, `Timestamp`, `Button`
- Adds (component tier): `--activity-item-row-gap`, `--activity-item-body-gap`

## Do / Don't
```tsx
// DO
<ActivityItem actor={user} action="commented on" target={<a href="…">Issue #42</a>} occurredAt={t} />

// DON'T — render the avatar inline
<img src={user.avatarUrl} className="avatar"/>{user.name} did X

// DON'T — bake in a date formatter
<span>{new Date(t).toLocaleString()}</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `Timestamp`)
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders actor via `UserChip`, action / target as `Text`, time as `Timestamp`
- Omitting `target` collapses the slot cleanly
- `actions` render as `Button`s and call `onSelect` when clicked
- `[data-density="compact"]` reduces visual density
- Forwards ref; spreads remaining props onto root `<article>`
- Composition probe: `UserChip`, `Timestamp`, `Text` all render inside output
- axe-core passes in default, no-target, with-actions
