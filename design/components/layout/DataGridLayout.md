---
name: DataGridLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Box, DataTable, DataTableToolbar, BulkActionBar]
replaces-raw: []
---

# DataGridLayout

> A full-page tabular workspace: persistent toolbar, sticky-header data table, and a bulk-action bar that appears when rows are selected.

## Purpose
DataGridLayout is the canonical "spreadsheet-like page" surface — inboxes, queues, record lists, admin tables. It composes `DataTableToolbar`, `DataTable`, and `BulkActionBar` into a single full-height layout that handles sticky headers, the appearance/disappearance of the bulk-action bar with selection, and consistent inner spacing. Product surfaces never have to wire those pieces together by hand.

## When to use
- A whole-page tabular workspace with sort, filter, paginate, select
- Inbox- or queue-style screens with bulk operations
- Admin grids where the table is the primary content

## When NOT to use
- A list of cards → use **CardListLayout**
- A small embedded table inside a dashboard widget → use **Card** + **DataTable** directly
- A pivot/matrix → use **PivotLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Box direction="column">` (full-height)      | hand-rolled flex CSS                   |
| Toolbar row          | `DataTableToolbar>`                           | bespoke filter/search row              |
| Table region         | `DataTable>`                                  | raw `<table>` or div table             |
| Bulk action bar      | `BulkActionBar>` (mounts when selection > 0) | inline action row                      |

## API contract
```ts
interface DataGridLayoutProps<Row> extends HTMLAttributes<HTMLDivElement> {
  toolbar: ReactNode;              // typically a configured DataTableToolbar
  table: ReactNode;                // a configured DataTable<Row>
  selectionCount?: number;         // drives BulkActionBar visibility
  bulkActions?: ReactNode;         // rendered inside BulkActionBar when count > 0
  onClearSelection?: () => void;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Toolbar pinned at top; table fills remaining height; header sticky     |
| selection > 0  | `BulkActionBar` slides in pinned to the bottom with the action set    |
| selection === 0| `BulkActionBar` is unmounted                                          |
| narrow viewport| Toolbar wraps; bulk-action bar full-width                             |

## Accessibility
- Root carries `role="region"` with `aria-label="Data grid"`
- The `DataTable`'s own semantics (`<table>`, sort, selection) are preserved
- `BulkActionBar` is a `role="region"` with an `aria-label` like "Bulk actions: 3 selected"
- Bulk-bar appearance/disappearance is announced via `aria-live="polite"`
- Sticky table header remains keyboard-navigable

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `DataTableToolbar`, `BulkActionBar`
- Adds (component tier): `--data-grid-layout-toolbar-gap`, `--data-grid-layout-bulk-bar-offset`

## Do / Don't
```tsx
// DO
<DataGridLayout
  toolbar={<DataTableToolbar .../>}
  table={<DataTable .../>}
  selectionCount={selected.size}
  onClearSelection={clear}
  bulkActions={<><Button>Archive</Button><Button variant="destructive">Delete</Button></>}
/>

// DON'T — render a raw selection row
{selected.size > 0 && <div className="bulk">…</div>}

// DON'T — wrap a raw <table> here
<DataGridLayout table={<table>…</table>} .../>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `DataGridLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders toolbar and table regions
- `BulkActionBar` mounts when `selectionCount > 0` and unmounts at 0
- Clear selection control invokes `onClearSelection`
- Sticky header remains visible while scrolling the table body
- Composition probes: `DataTableToolbar`, `DataTable`, `BulkActionBar` resolve as expected
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without an active selection
