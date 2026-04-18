---
name: InlineEditLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-entry]
uses: [Box, DataTable, FormField]
---

# InlineEditLayout

> A data-table frame whose cells become editable on click, with per-cell validation and save state.

## Purpose
InlineEditLayout owns the spreadsheet-style edit pattern: click a cell, type a value, tab to commit, escape to cancel. It binds a `DataTable` to a `FormField`-based cell editor and centralizes the save lifecycle so every editable column behaves identically. Without it, each editable column reinvents focus management, validation, and dirty tracking — all of which are accessibility traps.

## When to use
- Tables where any cell may be edited in place
- Light "spreadsheet" surfaces inside a product
- Data grids where bulk edit is overkill but per-row drawers are too heavy

## When NOT to use
- Editing the same field across many rows → use **BulkEditLayout**
- Editing a full record → use **FullPageFormLayout** or **Modal**
- Read-only data grids → use **DataTable** alone

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">`                          | hand-rolled `display: grid`/`flex` |
| Table grid      | `DataTable` with `editableColumns`                 | reimplementing table markup        |
| Cell editor     | `FormField` containing the column's input          | raw `<input>` inside a cell        |
| Cell error      | `FormField`'s `error` prop                         | inline error JSX                   |

## API contract
```ts
interface InlineEditLayoutProps<T> extends HTMLAttributes<HTMLDivElement> {
  rows: T[];
  columns: DataTableColumn<T>[];
  editableColumns: InlineEditColumn<T>[];
  onCellCommit: (rowId: string, columnId: string, value: unknown) => Promise<void>;
  validate?: (rowId: string, columnId: string, value: unknown) => string | null;
  pendingCellIds?: string[];                   // composite "rowId:columnId"
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                   |
|----------|----------------------------------------------------------------------------|
| default  | Table renders read-only; clicking an editable cell mounts the editor       |
| editing  | Cell renders `FormField` + control; Escape cancels, Enter/Tab commits      |
| invalid  | `validate` returns a string → `FormField` shows `error`; commit is blocked |
| saving   | Pending cells show `aria-busy="true"`; editor keeps focus until resolved   |
| readonly | Non-editable columns never mount an editor                                 |

## Accessibility
- Root is a `<region>` landmark with an accessible name from the table caption
- Editable cells expose `aria-label` describing column + row when entering edit mode
- Cell errors are announced via the `FormField`'s `role="alert"` surface
- Keyboard: Enter starts edit, Escape cancels, Tab commits and moves to the next editable cell

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `FormField`
- Adds (component tier): `--inline-edit-cell-padding`, `--inline-edit-saving-tint`

## Do / Don't
```tsx
// DO
<InlineEditLayout
  rows={rows}
  columns={cols}
  editableColumns={[{ id: "name", control: "text" }]}
  onCellCommit={save}
  validate={validateCell}
/>

// DON'T — own the cell editor
<td onClick={() => setEdit(id)}>{edit ? <input /> : value}</td>

// DON'T — bypass FormField for the input
<input value={draft} onChange={…} />
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
- Clicking an editable cell mounts the `FormField` editor
- Enter and Tab commit; Escape cancels and restores the previous value
- `validate` returning a message blocks commit and renders `FormField` error
- Pending cell renders `aria-busy="true"`
- Non-editable columns never mount an editor
- Forwards ref; spreads remaining props onto root
- Composition probe: `DataTable`, `FormField` render inside output
- axe-core passes in default, editing, invalid, saving
