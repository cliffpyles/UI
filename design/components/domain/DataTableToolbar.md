---
name: DataTableToolbar
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search, data-display]
uses: [Box, SearchInput, FilterChip, Button, Menu]
replaces-raw: []
---

# DataTableToolbar

> The toolbar above a `DataTable`: search, active filter chips, column settings, export, and bulk actions.

## Purpose
DataTableToolbar owns the layout and component composition of every chrome control that sits above a table. It standardizes where search lives, how active filters are surfaced as chips, where column settings and export actions go, and how bulk actions surface — so every list view in the product has the same toolbar geography.

## When to use
- Above any `DataTable` that supports search, filtering, column settings, or export
- Standalone list views where the user expects the same toolbar affordances

## When NOT to use
- A bare table with no filters/search → render the `DataTable` alone
- A bulk-action-only bar → use **BulkActionBar**
- A page header with breadcrumbs → use a layout-tier header

## Composition (required)
| Concern              | Use                                                    | Never                                |
|----------------------|--------------------------------------------------------|--------------------------------------|
| Internal layout      | `Box direction="row" align="center" gap="2" justify="between">` | hand-rolled flex/gap in CSS |
| Search input         | `SearchInput value={…} onChange={…}>`                  | raw `<input type="search">`          |
| Active filter chips  | `FilterChip>` (one per active filter)                  | raw styled `<span>` chip             |
| Filter menu          | `Menu>` triggered by `Button`                          | bespoke popover                      |
| Column settings      | `ColumnPicker>` (peer domain) or `Menu`                | raw `<button>` + checklist           |
| Export action        | `Button variant="ghost" iconLeading={Icon}>`           | raw `<button>`                       |
| Action overflow      | `Menu>` triggered by an icon `Button`                  | bespoke kebab popover                |

## API contract
```ts
interface DataTableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  search?: { value: string; onChange: (next: string) => void; placeholder?: string };
  filters?: ReactNode;                 // slot for one or more <FilterChip>
  primaryActions?: ReactNode;          // slot for primary <Button>s (e.g., New)
  secondaryActions?: ReactNode;        // slot for ghost <Button>s (Export, Columns)
  overflowActions?: ReactNode;         // slot for items rendered into a Menu
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State            | Behavior                                                              |
|------------------|-----------------------------------------------------------------------|
| default          | Renders search left, chips center, actions right                      |
| no search        | Search omitted; chips slide to the start                              |
| many chips       | Chip row wraps to a second line; actions stay aligned to the end      |
| no actions       | Action area collapses; toolbar height matches the search row          |
| overflow present | A trailing icon `Button` opens a `Menu` of `overflowActions`          |

## Accessibility
- Root has `role="toolbar"` with `aria-label="Table toolbar"`.
- Tab order: search → chips (each removable) → primary actions → secondary actions → overflow.
- `SearchInput` carries its own labeling; do not duplicate.
- Filter chips announce "Remove filter X" via the `FilterChip` primitive.

## Tokens
- Inherits all tokens from `Box`, `SearchInput`, `FilterChip`, `Button`, `Menu`
- Adds (component tier): `--data-table-toolbar-row-gap`, `--data-table-toolbar-min-height`

## Do / Don't
```tsx
// DO
<DataTableToolbar
  search={{ value: q, onChange: setQ, placeholder: "Search invoices" }}
  filters={activeFilters.map(f => <FilterChip key={f.id} {...f} />)}
  primaryActions={<Button variant="primary">New invoice</Button>}
  secondaryActions={<>
    <ColumnPicker {...colProps} />
    <Button variant="ghost" iconLeading={<Icon name="download" />}>Export</Button>
  </>}
/>

// DON'T — bespoke search input
<input type="search" />

// DON'T — raw chip
<span className="chip">region: us <button>×</button></span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `search` slot renders `SearchInput` and forwards value/onChange
- `filters` slot renders chips in order
- `primaryActions`, `secondaryActions` slots render in correct positions
- `overflowActions` triggers a `Menu` from a trailing icon `Button`
- Toolbar role is `toolbar` with the correct `aria-label`
- Composition probes: `SearchInput`, `FilterChip`, `Button`, `Menu` resolve when their slots are populated
- Forwards ref; spreads remaining props onto root
- axe-core passes
