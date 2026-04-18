---
name: BulkEditLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-entry]
uses: [Box, DataTable, FormField, Button, BulkActionBar]
---

# BulkEditLayout

> A page frame for selecting rows in a data table and applying changes to a shared field across the selection.

## Purpose
BulkEditLayout owns the workflow most data-heavy products implement badly: pick N rows, choose a field, type a new value, preview the impact, commit. It pairs a `DataTable` (which owns selection) with a `BulkActionBar` (which surfaces the editor) and a stable footer for confirm/cancel. Without it, every team reinvents the selection-to-edit pipeline and breaks accessibility around row selection announcements.

## When to use
- Mass-updating a status, owner, tag, or category across many table rows
- Admin tools where operators reassign records in bulk
- Workflows where the same edit must be previewed before commit

## When NOT to use
- Editing one row at a time → use **InlineEditLayout**
- Editing fields that differ per row → use **InlineEditLayout** or per-row drawer
- Background batch jobs with no per-row preview → use a job-runner page, not a layout

## Composition (required)
| Concern              | Use                                                | Never                                |
|----------------------|----------------------------------------------------|--------------------------------------|
| Frame layout         | `Box direction="column">` for header/body/footer   | hand-rolled `display: grid`/`flex`   |
| Row table + selection| `DataTable` with `selectable`                      | reimplementing selection state       |
| Bulk action surface  | `BulkActionBar`                                    | inline floating div                  |
| Edit form            | `FormField` per editable attribute                 | raw `<label>`/`<input>`              |
| Confirm / cancel     | `Button` (primary + secondary)                     | raw `<button>`                       |

## API contract
```ts
interface BulkEditLayoutProps<T> extends HTMLAttributes<HTMLDivElement> {
  rows: T[];
  columns: DataTableColumn<T>[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  editableFields: BulkEditField[];
  onApply: (fieldId: string, value: unknown, ids: string[]) => Promise<void>;
  onCancel?: () => void;
  applying?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State        | Behavior                                                                      |
|--------------|-------------------------------------------------------------------------------|
| default      | Table renders; no `BulkActionBar`                                             |
| selecting    | When `selectedIds.length > 0`, `BulkActionBar` slides in with field picker    |
| editing      | Selected field renders a `FormField` for the new value; preview shows count   |
| applying     | Apply `Button` shows `loading`; surface is `aria-busy="true"`                 |
| empty        | Table renders its own `EmptyState`; bar stays hidden                          |

## Accessibility
- Root is a `<main>` landmark with an accessible name describing the table
- `BulkActionBar` is `role="region"` with `aria-label="Bulk edit"`
- Selection count is announced via `aria-live="polite"` on the bar
- Apply button is disabled until a field and value are chosen

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `FormField`, `Button`, `BulkActionBar`
- Adds (component tier): `--bulk-edit-frame-gap`, `--bulk-edit-footer-padding`

## Do / Don't
```tsx
// DO
<BulkEditLayout
  rows={users}
  columns={cols}
  selectedIds={ids}
  onSelectionChange={setIds}
  editableFields={[{ id: "role", label: "Role", control: "select", options: roles }]}
  onApply={applyChange}
/>

// DON'T — bypass BulkActionBar
{ids.length > 0 && <div className="floating">…</div>}

// DON'T — own the input markup
<input value={value} onChange={(e) => setValue(e.target.value)} />
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
- Selecting rows reveals `BulkActionBar` with the count
- Choosing a field renders the matching `FormField`
- `onApply` receives the field id, value, and current `selectedIds`
- Apply `Button` is disabled until a value is entered
- `applying` sets `aria-busy` and disables the apply button
- Forwards ref; spreads remaining props onto root
- Composition probe: `DataTable`, `BulkActionBar`, `FormField`, `Button` render inside output
- axe-core passes in default, selecting, editing, applying
