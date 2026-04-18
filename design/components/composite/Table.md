---
name: Table
tier: composite
level: 4
status: stable
since: 0.5.0
patterns: [data-display]
uses: [Box, Text, Icon, Checkbox]
replaces-raw: ["<table>", "<thead>", "<tbody>", "<tfoot>", "<tr>", "<th>", "<td>"]
---

# Table

> A semantic, accessible HTML table with sortable headers, selection, and density-aware spacing.

## Purpose
Table is the generic, presentation-only tabular surface. It owns the semantic `<table>`/`<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` markup, the `aria-sort` wiring on sortable column headers, the sticky-header behavior, the numeric-alignment column variant, the truncation cell variant, and selection checkboxes. Sort state, row data, pagination, loading, empty, and error states are caller concerns at this tier — `DataTable` (domain) layers those on top.

## When to use
- Any tabular data display where rows and columns are first-class
- A list of homogeneous records that benefits from column alignment and sorting
- The presentational base for a higher-level `DataTable`

## When NOT to use
- Layout grids (positioning content into cells) — use a CSS grid or `Grid`
- Form input matrices — use individual form controls within a layout
- Lists of dissimilar items — use a list of `Card`s
- Server-paged, sortable, filterable data with loading / empty / error stories — use **DataTable** (domain)

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Table tags           | Native `<table>`/`<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` (semantics required) | a `<div>` table |
| Outer scroll wrapper | `Box>` with overflow tokens                        | raw `<div>` with overflow CSS               |
| Cell text content    | `Text>` when the cell content carries typography (size, weight, color) | inline-styled `<span>` |
| Sort indicator glyph | `Icon name="sort-asc|sort-desc">`                  | inline `<svg>` or unicode arrows            |
| Selection checkbox   | `Checkbox>` (in a leading column)                  | raw `<input type="checkbox">`               |

The table tags themselves are exempt from the "no raw HTML" rule because their semantics are required and not wrapped by a primitive. Everything else inside cells follows the standard composition rules.

## API contract
```ts
type TableProps = HTMLAttributes<HTMLTableElement>;
type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
  onSort?: () => void;
  numeric?: boolean;
  sticky?: boolean;
  width?: string | number;
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
  truncate?: boolean;
}

// Compound: Table.Header, Table.Body, Table.Footer, Table.Row, Table.Head, Table.Cell
```

## Required states
| State              | Behavior                                                              |
|--------------------|-----------------------------------------------------------------------|
| default            | Renders semantic table; alternating row tint per density tokens       |
| sortable header    | `Table.Head` is keyboard-focusable; Enter/Space invoke `onSort`; chevron `Icon` rendered |
| sorted asc / desc  | `aria-sort` set; sort `Icon` reflects direction                       |
| numeric column     | `Table.Head numeric` and `Table.Cell numeric` right-align content     |
| sticky header      | `Table.Head sticky` keeps headers visible while body scrolls          |
| truncated cell     | `Table.Cell truncate` clips overflow with ellipsis                    |
| selected row       | Caller renders a `Checkbox` in the first cell and sets `aria-selected` on the row |
| loading / empty / error | Not handled here — wrap in a higher-level layout that swaps in `Skeleton` / `EmptyState` / `ErrorState` for the body |

## Accessibility
- Native `<table>` with `<thead>`/`<tbody>` produces correct row/column relationships.
- `<th scope="col">` is set automatically on `Table.Head`.
- Sortable header is keyboard-activatable (Enter/Space) and exposes `aria-sort`.
- Sticky headers do not break screen reader navigation (they stay in normal table flow).
- Selection checkboxes (when used) inherit accessibility from `Checkbox`.

## Tokens
- Border: `--color-border-default`, `--table-border-width`
- Row hover: `--color-surface-row-hover`
- Zebra: `--color-surface-row-alt`
- Cell padding: `--table-cell-padding-{x|y}` with `[data-density="compact"]` overrides
- Header background: `--color-surface-table-header`
- Sticky header z-index: `--z-sticky`

## Do / Don't
```tsx
// DO
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head sortable sorted={sort.col === "name" ? sort.dir : false} onSort={() => toggleSort("name")}>
        Name
      </Table.Head>
      <Table.Head numeric>Total</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {rows.map((r) => (
      <Table.Row key={r.id}>
        <Table.Cell truncate>{r.name}</Table.Cell>
        <Table.Cell numeric>{formatNumber(r.total)}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>

// DON'T — div table
<div className="row"><div className="cell">…</div></div>

// DON'T — inline svg sort indicator
<th onClick={…}>Name <svg>…</svg></th>

// DON'T — raw checkbox for selection
<td><input type="checkbox"/></td>
```

## Forbidden patterns (enforced)
- Inline `<svg>` (use `Icon`)
- Raw `<input type="checkbox">` (use `Checkbox`)
- Raw styled `<span>` for cell typography (use `Text` when typography is non-default)
- Hand-rolled overflow wrapper styles (use `Box`)
- Hardcoded color, spacing, font-size, z-index values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Sortable header is keyboard-activatable (Enter and Space)
- `aria-sort` reflects `sorted` prop ("ascending" | "descending" | none)
- `numeric` cells right-align
- `truncate` cells clip overflow
- Sticky header stays in place while body scrolls
- Composition probe: `Icon` renders the sort indicator
- Forwards ref on every sub-component; spreads remaining props
- axe-core passes for default, sortable, sorted, numeric, sticky variations
