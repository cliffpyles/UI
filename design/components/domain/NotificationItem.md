---
name: NotificationItem
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Avatar, Text, Timestamp, Button]
replaces-raw: []
---

# NotificationItem

> A single entry inside a notification feed — actor avatar, summary text, relative time, and optional action.

## Purpose
NotificationItem is the canonical row for any notification surface (dropdown bell, side panel, inbox). It standardizes the actor + body + timestamp shape so every notification, regardless of source, reads the same and has consistent unread, read, and action affordances.

## When to use
- A row inside a notifications dropdown or inbox
- A single mention/comment/assignment alert
- An in-product activity feed entry

## When NOT to use
- A page-level announcement → use **BannerAlert**
- A transient pop-in confirmation → use **Toast**
- A list of files → use **AttachmentList**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="start" gap="3" padding="3">` | hand-rolled flex/padding |
| Actor avatar    | `Avatar size="sm">`                | raw `<img>` with circle CSS        |
| Title text      | `Text size="sm" weight="medium">`  | raw `<span>` / `<strong>`          |
| Body text       | `Text size="sm" color="secondary">`| raw `<p>` with typography CSS      |
| Relative time   | `Timestamp variant="relative">`    | inline `toLocaleString()` / `Intl.DateTimeFormat` |
| Inline action   | `Button variant="ghost" size="sm">`| raw `<button>` / raw styled `<a>`  |

## API contract
```ts
interface NotificationItemProps extends HTMLAttributes<HTMLDivElement> {
  actor?: { name: string; avatarUrl?: string };
  title: ReactNode;
  body?: ReactNode;
  timestamp: Date | string;
  unread?: boolean;                   // default false
  action?: { label: string; onAction: () => void };
  onSelect?: () => void;              // row click
}
```
Component uses `forwardRef<HTMLDivElement, NotificationItemProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| read     | Default background; no unread indicator                               |
| unread   | Tinted background + leading unread `Dot`                              |
| with action | Trailing `Button` rendered                                         |
| selectable | When `onSelect` set, root behaves as a `Button` (semantics, not styling) and is keyboard activatable |

## Accessibility
- Root: `role="listitem"` (parent feed supplies `role="list"`).
- When `onSelect` is set, the entire row composes a `Button` for activation (Enter/Space, focus ring); not a clickable `<div>`.
- `unread` state is announced via VisuallyHidden text or `aria-label` prefix — never color alone.
- `Timestamp` provides the machine-readable `<time datetime>` attribute.

## Tokens
- Surface: `--notification-item-surface-default`, `--notification-item-surface-unread`
- Hover surface: `--notification-item-surface-hover`
- Padding/gap inherited from `Box`: `--space-3`
- Unread indicator color: inherited from `Dot` variant tokens

## Do / Don't
```tsx
// DO
<NotificationItem
  actor={{ name: "Ada Lovelace", avatarUrl }} unread
  title={<>Ada mentioned you in <b>Q3 plan</b></>}
  timestamp={ts} onSelect={open}
  action={{ label: "View", onAction: open }} />

// DON'T — inline timestamp
<NotificationItem timestamp={d.toLocaleString()} … />

// DON'T — clickable div
<div onClick={open} className="notification-row">…</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>` — use `Button` for the row
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `Intl.DateTimeFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `unread` renders unread surface and a leading indicator
- `action` renders a `Button`; click fires `onAction` without firing `onSelect`
- `onSelect` makes the row keyboard-activatable (Enter/Space)
- `Timestamp` is rendered with the supplied date
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Avatar"]`, `[data-component="Timestamp"]` resolve
- axe-core passes in read and unread states
