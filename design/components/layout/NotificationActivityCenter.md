---
name: NotificationActivityCenter
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy, states]
uses: [Box, Popover, Tabs, NotificationItem, Button]
replaces-raw: []
---

# NotificationActivityCenter

> A header-anchored panel that lists notifications grouped by tab (All / Unread / Mentions) with bulk actions.

## Purpose
NotificationActivityCenter is the single surface for in-app notification triage — opened from a bell button in the header, it presents a `Popover` with `Tabs` that segment the feed and a list of `NotificationItem`s. By centralizing the tabbing model, the empty/loading/error sub-states, and the "Mark all as read" footer, every notification source the product adds plugs into a consistent reading experience without per-feature UI work.

## When to use
- The top-of-app notification entry point opened from a bell or activity icon
- Any persistent notification stream that benefits from tabbed segmentation
- Surfaces that need bulk "mark all read" or "clear" affordances

## When NOT to use
- A transient feedback message → use **Toast**
- A page-level activity log → use a regular page with a `Table` or feed
- A blocking, single-notification dialog → use **Modal**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Popover` (anchored to the trigger button)   | raw fixed-position `<div>`                    |
| Inner stack           | `Box direction="column">`                    | hand-rolled flex CSS                          |
| Segmenting tabs       | `Tabs` (All / Unread / Mentions)             | hand-rolled tabstrip                          |
| Notification row      | `NotificationItem` per entry                 | raw `<div>` rendering icon + text             |
| Footer actions        | `Button variant="ghost" size="sm">` row      | raw `<button>` row                            |
| Empty / error subview | `EmptyState` / `ErrorState` (caller-supplied via slot or default) | hand-rolled empty copy        |

## API contract
```ts
type NotificationTab = "all" | "unread" | "mentions";

interface NotificationActivityCenterProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;             // expected to be a <Button> with bell Icon
  tab?: NotificationTab;          // controlled
  defaultTab?: NotificationTab;
  onTabChange?: (tab: NotificationTab) => void;
  notifications: ReactNode;       // pre-rendered list of <NotificationItem>
  unreadCount?: number;
  loading?: boolean;
  error?: Error | null;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  open?: boolean;                 // controlled
  onOpenChange?: (next: boolean) => void;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| closed          | Renders trigger only; bell may show a `Dot` if `unreadCount > 0`      |
| open-default    | Popover open on "All" tab; list rendered                              |
| empty-tab       | Empty state shown when the tab's list is empty                        |
| loading         | Skeleton rows replace the list                                        |
| error           | ErrorState replaces the list with a retry affordance                  |
| with-bulk       | Footer renders "Mark all read" / "Clear" when handlers provided       |

## Accessibility
- Trigger exposes `aria-haspopup="dialog"` and `aria-expanded`
- Popover content carries `role="dialog"` with `aria-label="Notifications"`
- Tabs inherit `tablist`/`tab`/`tabpanel` wiring from `Tabs`
- Unread badge on the trigger is announced via `aria-label` (e.g. "3 unread notifications")
- Esc closes; focus returns to the trigger

## Tokens
- Inherits Popover, Tabs, NotificationItem tokens
- Adds (component tier): `--notification-center-width`, `--notification-center-list-max-height`, `--notification-center-footer-padding`

## Do / Don't
```tsx
// DO
<NotificationActivityCenter
  trigger={<Button variant="ghost"><Icon name="bell"/></Button>}
  defaultTab="unread"
  notifications={items.map(n => <NotificationItem key={n.id} {...n}/>)}
  unreadCount={3}
  onMarkAllRead={markAll}
/>

// DON'T — render notifications as bare divs
<Popover>{items.map(n => <div>{n.title}</div>)}</Popover>

// DON'T — replicate tabs by hand
<div role="tablist"><button role="tab">All</button>…</div>

// DON'T — bell icon outside a Button
<span onClick={open}><Icon name="bell"/></span>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `NotificationActivityCenter.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger toggles the popover; `onOpenChange` fires
- Tab switching updates `tab` and emits `onTabChange`
- `loading`, `error`, and empty-tab states each render their replacement view
- "Mark all read" / "Clear" buttons fire their handlers
- Composition probes: `Popover` is the frame; `Tabs` segments the list; `NotificationItem` is each row; `Button` is in the footer
- Forwards ref; spreads remaining props onto root
- axe-core passes when open
