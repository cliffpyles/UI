---
name: DataTable
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, states]
uses: [Box, Table, Checkbox, Skeleton, EmptyState, ErrorState, Pagination]
replaces-raw: []
---

# DataTable

> A full-featured table with sorting, pagination, selection, column visibility, and the loading/empty/error states.

## Purpose
DataTable is the canonical "show me a list of records" surface for the entire product. It composes `Table` for semantics, `Checkbox` for selection, `Skeleton`/`EmptyState`/`ErrorState` for the three non-happy paths, and `Pagination` for paging — so product surfaces never re-implement any of those concerns and every table behaves the same.

## When to use
- Any list of homogeneous records with sorting, paging, or selection
- Inbox- or queue-style screens
- Admin tables where the user expects column controls and bulk actions

## When NOT to use
- A purely presentational table with no data states → use **Table** directly
- A two-dimensional matrix layout → use `Grid`
- A list of dissimilar items → use a list of `Card`s
- An infinitely-scrolling virtualized log → use a dedicated virtual list

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Internal layout      | `Box direction="column" gap="2">`                  | hand-rolled flex/gap in CSS                 |
| Table semantics      | `Table>` (and its sub-components)                  | div table                                   |
| Row selection        | `Checkbox>` in the leading column and header        | raw `<input type="checkbox">`               |
| Loading state        | `Skeleton>` rows replacing `Table.Body` content     | bespoke shimmer                             |
| Empty state          | `EmptyState>` rendered in place of the table body   | inline empty JSX                            |
| Error state          | `ErrorState>` rendered in place of the table body   | inline error JSX                            |
| Pagination footer    | `Pagination>`                                       | bespoke prev/next buttons                   |
| Cells (typed)        | `CellRenderer>` (peer domain component)             | inline formatters                           |

## API contract
```ts
interface ColumnDef<Row> {
  id: string;
  header: ReactNode;
  accessor: (row: Row) => unknown;
  type?: CellType;                  // forwarded to CellRenderer
  sortable?: boolean;
  numeric?: boolean;
  width?: string | number;
}

type SortState = { column: string; direction: "asc" | "desc" } | null;

interface DataTableProps<Row> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  loading?: boolean;
  error?: Error | null;
  emptyState?: ReactNode;            // overrides default EmptyState content
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  selection?: Set<string>;
  onSelectionChange?: (next: Set<string>) => void;
  pagination?: {
    page: number; pageSize: number; total: number;
    onPageChange: (page: number) => void;
  };
  visibleColumns?: string[];         // ordered ids; when absent, all columns visible
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Renders `Table` with `rows`; sortable headers reflect `sort`          |
| loading  | Body replaced with `Skeleton` rows (count matches `pageSize`)         |
| empty    | Body replaced with `EmptyState`; `emptyState` slot overrides copy     |
| error    | Body replaced with `ErrorState`; `error.message` surfaced             |
| selection| Leading column with `Checkbox`; header checkbox toggles all current page rows |
| paginated| `Pagination` rendered in footer; respects `total`/`pageSize`/`page`   |
| sorted   | `aria-sort` reflects `sort`; clicking header emits `onSortChange`     |

## Accessibility
- `Table` provides semantic `<thead>`/`<tbody>` and `aria-sort`.
- Selection header checkbox uses indeterminate when partial.
- Loading state announces `aria-busy="true"` on the table.
- Empty/error states are reachable by keyboard; primary action (if any) is focusable.
- Row selection state is reflected via `aria-selected` on `<tr>`.

## Tokens
- Inherits all tokens from `Table`, `Skeleton`, `EmptyState`, `ErrorState`, `Pagination`
- Adds (component tier): `--data-table-section-gap`

## Do / Don't
```tsx
// DO
<DataTable
  columns={cols}
  rows={rows}
  rowKey={(r) => r.id}
  loading={isLoading}
  error={err}
  sort={sort} onSortChange={setSort}
  pagination={{ page, pageSize, total, onPageChange: setPage }}
/>

// DON'T — hand-roll loading state
<DataTable rows={rows} />
{isLoading && <div className="spinner"/>}

// DON'T — raw checkbox for row selection
<td><input type="checkbox" /></td>

// DON'T — bespoke pagination
<button onClick={prev}>‹</button> Page 1 <button onClick={next}>›</button>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `CellRenderer`/`MetricValue`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs (use `TrendIndicator`/`Icon`)
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `loading` swaps body for `Skeleton` rows matching `pageSize`
- `error` renders `ErrorState`
- `rows.length === 0` renders `EmptyState`
- Sort header click invokes `onSortChange` with the next state
- Selecting a row emits `onSelectionChange` with the row key added
- Header checkbox toggles all current-page rows
- `pagination` change invokes `onPageChange`
- Composition probes: `Table`, `Skeleton`, `EmptyState`, `ErrorState`, `Pagination` resolve in their respective states
- Forwards ref; spreads remaining props onto root
- axe-core passes for default, loading, empty, error
