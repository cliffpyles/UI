---
name: AuditLogLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Box, DataTable, FilterBarLayout, AuditEntry]
replaces-raw: []
---

# AuditLogLayout

> A filterable, chronological surface for inspecting administrative and security events.

## Purpose
Audit logs across products share the same shape: a filter bar for actor/action/date scope, a chronological list of events with rich per-row context, and predictable pagination. AuditLogLayout owns the filter-bar slot and the list frame so every audit surface — security, billing, integrations — exposes the same controls and renders entries through the same `AuditEntry` domain component.

## When to use
- A security or compliance event log
- Any chronological list of administrative actions with actor/target context
- Surfaces where filtering and exporting the event stream is required

## When NOT to use
- A user-facing notification feed → use **ActivityFeed**
- A real-time tail/console output → use a dedicated streaming log component
- A general-purpose data table → use **DataTable** directly

## Composition (required)
| Concern             | Use                                                  | Never                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Frame layout        | `Box direction="column" gap>`                        | hand-rolled flex CSS                   |
| Filter bar          | `FilterBarLayout`                                    | bespoke filter row                     |
| Event table         | `DataTable` (with custom row renderer for `AuditEntry`) | bespoke table                       |
| Event row content   | `AuditEntry`                                         | inline actor/action/target JSX         |
| Header / actions    | `Box direction="row" align="center" justify="between" gap>` | hand-rolled flex CSS            |

## API contract
```ts
interface AuditEvent {
  id: string;
  occurredAt: string;
  actor: { id: string; label: string };
  action: string;
  target?: { id: string; label: string; kind?: string };
  metadata?: Record<string, unknown>;
}

interface AuditFilterValue {
  actorIds?: string[];
  actions?: string[];
  range?: { start: string; end: string } | null;
  query?: string;
}

interface AuditLogLayoutProps extends HTMLAttributes<HTMLDivElement> {
  events: AuditEvent[];
  loading?: boolean;
  error?: Error | null;
  filter: AuditFilterValue;
  onFilterChange: (filter: AuditFilterValue) => void;
  pagination?: {
    page: number; pageSize: number; total: number;
    onPageChange: (page: number) => void;
  };
  actions?: ReactNode;                // export, download, etc.
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Filter bar above; `DataTable` body renders `AuditEntry` per row       |
| loading  | Inherits `DataTable` skeleton state                                   |
| empty    | Inherits `DataTable` EmptyState                                       |
| error    | Inherits `DataTable` ErrorState                                       |
| filtered | Filter chips reflect `filter`; clearing emits an updated `onFilterChange` |

## Accessibility
- Filter bar inherits `FilterBarLayout` accessibility (labelled controls, chip semantics)
- Event table inherits `DataTable` semantics; each row exposes `aria-label` summarizing actor + action + target
- Date columns are sortable via `DataTable` and reflect `aria-sort`

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `FilterBarLayout`, `AuditEntry`
- Adds (component tier): `--audit-log-section-gap`

## Do / Don't
```tsx
// DO
<AuditLogLayout
  events={events}
  filter={filter}
  onFilterChange={setFilter}
  pagination={{ page, pageSize, total, onPageChange: setPage }}
  actions={<Button variant="ghost">Export</Button>}
/>

// DON'T — render audit rows inline
<tr><td>{actor}</td><td>{action}</td><td>{target}</td></tr>

// DON'T — bespoke filter row
<div className="filters"><select>…</select><input/></div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `AuditLogLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Filter changes invoke `onFilterChange` with the next value
- Pagination changes invoke `pagination.onPageChange`
- Each row renders an `AuditEntry`
- Composition probes: `FilterBarLayout`, `DataTable`, `AuditEntry` resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes for default, loading, empty, and error states
