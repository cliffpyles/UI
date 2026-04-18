---
name: LogExplorerLayout
tier: layout
level: 6
status: stable
since: 0.7.0
uses: [Box, SearchInput, Table, FilterChip]
---

# LogExplorerLayout

> A search-driven frame for streaming logs with a query bar, active-filter chips, and an expandable row table.

## Purpose
LogExplorerLayout owns the log triage page: a `SearchInput` at the top, `FilterChip`s for active facets (service, level, time range), and a virtualized `Table` of log lines with field extraction on row expand. It standardizes the layout so every observability surface in the product searches and filters identically — keyboard, focus, and screen reader behavior included.

## When to use
- Searching application or audit logs
- Filtering structured events by faceted attributes
- Any "stream + search + filter chips + table" surface

## When NOT to use
- Chronological alert review → use **AlertFeedLayout**
- One incident's signal panels → use **IncidentDetailLayout**
- Aggregate metric exploration → use **OperationsCenterLayout**

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for query/chips/table    | hand-rolled `display: grid`/`flex` |
| Query bar       | `SearchInput`                                      | raw `<input type="search">`        |
| Active filters  | `FilterChip` per applied filter                    | inline pill markup                 |
| Log rows        | `Table` (with row-expand for field detail)         | reimplementing tabular markup      |

## API contract
```ts
interface LogExplorerLayoutProps extends HTMLAttributes<HTMLDivElement> {
  query: string;
  onQueryChange: (next: string) => void;
  filters: AppliedFilter[];
  onRemoveFilter: (id: string) => void;
  onClearFilters?: () => void;
  rows: LogRow[];
  columns: LogColumn[];
  loading?: boolean;
  onRowExpand?: (rowId: string) => ReactNode;
  onLoadMore?: () => void;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | Query bar + filter chips + table of log rows                              |
| filtered | Each applied filter renders as `FilterChip` with remove affordance        |
| loading  | Table shows skeleton rows; root has `aria-busy="true"`                    |
| empty    | Table renders an empty state row when no logs match                       |
| expanded | Row expansion renders the `onRowExpand` slot below the row                |

## Accessibility
- Root is a `<main>` landmark with `aria-label="Logs"`
- Query bar exposes `role="searchbox"` (delegated to `SearchInput`)
- Active filter chips form a labeled group: `role="group" aria-label="Active filters"`
- Loading sets `aria-busy`; new pages announce row count via `aria-live="polite"`

## Tokens
- Inherits all tokens from `Box`, `SearchInput`, `Table`, `FilterChip`
- Adds (component tier): `--log-explorer-toolbar-gap`, `--log-explorer-row-line-height`

## Do / Don't
```tsx
// DO
<LogExplorerLayout
  query={q}
  onQueryChange={setQ}
  filters={applied}
  onRemoveFilter={remove}
  rows={logs}
  columns={cols}
  onLoadMore={fetchMore}
/>

// DON'T — raw search input
<input type="search" value={q} onChange={…} />

// DON'T — inline filter pill
<span className="chip">level:error <button>×</button></span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hand-rolled `display: grid` / `display: flex` in this component's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Typing in `SearchInput` calls `onQueryChange`
- Each applied filter renders as `FilterChip`; removing one calls `onRemoveFilter`
- Loading sets `aria-busy` and shows skeleton rows
- Row expand mounts the `onRowExpand` content
- `onLoadMore` fires when triggered
- Forwards ref; spreads remaining props onto root
- Composition probe: `SearchInput`, `FilterChip`, `Table` render inside output
- axe-core passes in default, filtered, loading, expanded
