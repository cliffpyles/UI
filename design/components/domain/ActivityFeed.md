---
name: ActivityFeed
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, ActivityItem, Button, Pagination, EmptyState]
---

# ActivityFeed

> A chronologically grouped stream of `ActivityItem`s with paging, empty state, and load-more affordances.

## Purpose
ActivityFeed owns the stream-of-events container that almost every product builds: dashboards, project pages, audit drawers. It groups items by day (today, yesterday, then dated headings), renders each event via the `ActivityItem` peer, and handles empty + paginated states uniformly. Without it, every page invents its own grouping and pagination, breaking density and behavior parity.

## When to use
- Project, workspace, or entity activity timelines
- Notification centers with chronological events
- Anywhere an event stream needs day-grouped headings and pagination

## When NOT to use
- A single audit log row → use **AuditEntry** directly
- Threaded conversations → use **CommentThread**
- Tabular event listings with sortable columns → use **Table**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="column" gap` for groups; `Box` per group with heading + items | hand-rolled flex/padding in CSS |
| Single entry    | `ActivityItem` (peer domain component) | inline event JSX                  |
| Group heading   | `Text as="h3" size="sm" color="secondary">` (rendered through `Box`) | raw styled `<h3>` |
| Load-more / page nav | `Pagination` OR `Button variant="ghost">Load more</Button>` | raw `<button>` |
| No data         | `EmptyState`                         | inline empty JSX                     |

## API contract
```ts
interface ActivityEvent {
  id: string;
  occurredAt: Date | string;
  /** Forwarded as the props of `ActivityItem`. */
  [key: string]: unknown;
}

interface ActivityFeedProps extends HTMLAttributes<HTMLDivElement> {
  events: ActivityEvent[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  loadMore?: () => void;                // when set, renders a "Load more" button instead of Pagination
  emptyTitle?: string;
  emptyDescription?: string;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                 |
|----------|--------------------------------------------------------------------------|
| default  | Day-grouped lists of `ActivityItem`s                                     |
| loading  | Skeleton placeholders inside each group; `aria-busy="true"` on root      |
| empty    | `EmptyState` rendered in place of groups                                 |
| paginated| `Pagination` rendered at the bottom when `totalCount` and `pageSize` set |
| load-more| `Button` "Load more" rendered when `loadMore` is set                     |

## Accessibility
- Root has `role="feed"` (per WAI-ARIA feed pattern)
- Each item is a `role="article"` provided by `ActivityItem`
- Group headings are real headings (`Text as="h3">`) so screen readers can navigate by heading
- `aria-busy` reflects loading

## Tokens
- Inherits all tokens from `Box`, `ActivityItem`, `Button`, `Pagination`, `EmptyState`
- Adds (component tier): `--activity-feed-group-gap`, `--activity-feed-heading-gap`

## Do / Don't
```tsx
// DO
<ActivityFeed events={events} totalCount={n} page={p} pageSize={20} onPageChange={setP} />

// DON'T — render rows inline
{events.map(e => <div className="row">{e.actor} {e.action}</div>)}

// DON'T — bypass EmptyState
{events.length === 0 && <p>No activity</p>}
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Events are grouped by local day with the expected headings
- `loading` renders skeleton items and sets `aria-busy`
- Empty list renders `EmptyState`
- `onPageChange` fires from `Pagination` clicks
- `loadMore` is invoked when the load-more `Button` is clicked
- Forwards ref; spreads remaining props onto root
- Composition probe: `ActivityItem`, `EmptyState`, `Pagination` (or `Button`) render inside output
- axe-core passes in default, loading, empty, paginated
