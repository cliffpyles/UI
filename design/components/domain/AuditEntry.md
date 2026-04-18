---
name: AuditEntry
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, UserChip, Timestamp]
---

# AuditEntry

> A single audit log row showing actor, action, source IP, user agent, and timestamp in a consistent dense layout.

## Purpose
AuditEntry is the row primitive for security and compliance audit views. It standardizes the fields that auditors expect — who, what, when, from where, with what client — so every audit surface looks the same and so consumers cannot accidentally omit fields. Unlike `ActivityItem`, it is denser, monospace-leaning for IP/UA, and explicit about every field.

## When to use
- Rows inside an audit log table or drawer
- Security review surfaces (admin login history, key usage, permission changes)
- Compliance exports rendered as an in-app preview

## When NOT to use
- Friendly product activity → use **ActivityItem**
- Field-level before/after diffs → use **ChangeLog**
- Threaded discussion → use **CommentThread**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap` for the header row; `Box direction="column"` for stacked metadata | hand-rolled flex / padding in CSS |
| Actor           | `UserChip`                           | inline avatar + name                 |
| Action label    | `Text weight="medium">`              | raw styled `<span>`                  |
| IP / user agent | `Text variant="mono" size="sm" color="secondary">` | raw `<code>` with CSS  |
| Timestamp       | `Timestamp`                          | inline date formatting               |

## API contract
```ts
interface AuditEntryProps extends HTMLAttributes<HTMLElement> {
  actor: { id: string; name: string; avatarUrl?: string };
  action: string;                       // e.g. "user.login", "permission.grant"
  occurredAt: Date | string;
  ip?: string;
  userAgent?: string;
  detail?: ReactNode;                   // optional secondary line (e.g. resource id)
}
```
Renders as `<article>`; forwards ref to it.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| default  | Actor, action, timestamp on the header row; IP/UA on metadata row         |
| no-ip    | IP slot omitted cleanly; layout does not collapse awkwardly              |
| no-ua    | Same as above for user agent                                              |
| with-detail | Detail text rendered below metadata row                               |

## Accessibility
- Root is `<article>` with an `aria-label` summarizing actor + action
- IP and UA strings are presented as text (not images); `Text variant="mono"` ensures consistent rendering
- `Timestamp` provides both relative + machine-readable forms

## Tokens
- Inherits all tokens from `UserChip`, `Text`, `Timestamp`
- Adds (component tier): `--audit-entry-row-gap`, `--audit-entry-meta-gap`

## Do / Don't
```tsx
// DO
<AuditEntry actor={u} action="user.login" occurredAt={t} ip="10.0.0.1" userAgent="Mozilla/5.0 …" />

// DON'T — bake in a date formatter or color the IP yourself
<span style={{ fontFamily: "monospace", color: "#888" }}>{ip}</span>

// DON'T — use ActivityItem for a security log (loses required fields)
<ActivityItem actor={u} action="logged in" occurredAt={t} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `Timestamp`)
- Inline trend glyphs (▲▼↑↓)
- Raw `<code>` styled with CSS for IP/UA
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders actor via `UserChip`, action via `Text`, time via `Timestamp`
- IP and user agent render via `Text variant="mono"`
- Omitting `ip` / `userAgent` does not break layout
- `detail` slot renders when provided
- Forwards ref; spreads remaining props onto root `<article>`
- Composition probe: `UserChip`, `Timestamp`, `Text` all render inside output
- axe-core passes in default, with-detail, no-ip, no-ua
