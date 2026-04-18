---
name: PermissionMatrixLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, Checkbox, Text, RoleBadge]
replaces-raw: []
---

# PermissionMatrixLayout

> A two-dimensional role × resource grid with sticky row and column headers for editing access at scale.

## Purpose
Editing permissions across many roles and many resources in a `DataTable` quickly becomes unreadable; the natural shape is a true 2D matrix with sticky headers so the user can always tell which cell they're editing. PermissionMatrixLayout owns that grid frame, the sticky-header behavior, and the per-cell `Checkbox` so callers only supply the role list, the resource list, and the value map.

## When to use
- A role-based access control (RBAC) admin surface
- Any "feature × tier" or "scope × subject" matrix where each cell is a boolean
- Surfaces where users need to compare permissions across roles side-by-side

## When NOT to use
- A linear list of permission rows for one role → use **PermissionRow** inside a `Box`
- A free-form policy editor (JSON, expressions) → use a dedicated editor
- A simple settings form with a handful of toggles → use **Toggle** in a `Box`

## Composition (required)
| Concern              | Use                                                  | Never                                       |
|----------------------|------------------------------------------------------|---------------------------------------------|
| Frame layout         | `Grid` with named tracks (matrix is the 2D grid)     | hand-rolled `display: grid` in CSS          |
| Column header (role) | `Box` containing `RoleBadge` + `Text`                | raw `<th>` with custom CSS                  |
| Row header (resource)| `Box` containing `Text` (semantic `as="th"` allowed via `Text`) | raw `<th>` with custom CSS       |
| Cell checkbox        | `Checkbox`                                           | raw `<input type="checkbox">`               |
| Section labels       | `Text`                                               | raw `<span>` with typography CSS            |

## API contract
```ts
interface MatrixRole {
  id: string;
  label: string;
  badge?: { variant: string; label: string };
}

interface MatrixResource {
  id: string;
  label: string;
  group?: string;
}

interface PermissionMatrixLayoutProps extends HTMLAttributes<HTMLDivElement> {
  roles: MatrixRole[];
  resources: MatrixResource[];
  value: Record<string, Record<string, boolean>>;     // value[resourceId][roleId]
  onChange: (resourceId: string, roleId: string, granted: boolean) => void;
  readOnly?: boolean;
  disabledCells?: Array<{ resourceId: string; roleId: string }>;
  emptyMessage?: ReactNode;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| default      | Full matrix rendered with sticky row/column headers                   |
| readOnly     | Cells render as `Checkbox` with `disabled`; no `onChange` invoked     |
| disabled-cell| Cells in `disabledCells` render `disabled`; remain visually present   |
| empty        | When `roles` or `resources` is empty, renders `emptyMessage`          |

## Accessibility
- The matrix root carries `role="grid"`; rows carry `role="row"`; cells carry `role="gridcell"`
- Each cell `Checkbox` exposes `aria-label` combining role label and resource label (e.g. "Grant Editor on Reports")
- Row headers (`role="rowheader"`) and column headers (`role="columnheader"`) are programmatically associated with their cells
- Keyboard navigation follows W3C grid pattern: arrow keys move between cells, Space toggles
- Sticky headers must not steal focus on scroll

## Tokens
- Inherits all tokens from `Box`, `Grid`, `Checkbox`, `Text`, `RoleBadge`
- Adds (component tier): `--permission-matrix-row-height`, `--permission-matrix-column-width`, `--permission-matrix-header-bg`

## Do / Don't
```tsx
// DO
<PermissionMatrixLayout
  roles={roles}
  resources={resources}
  value={matrix}
  onChange={(rid, roleId, on) => updateMatrix(rid, roleId, on)}
/>

// DON'T — render the matrix as a DataTable
<DataTable rows={resources} columns={roles.map(r => …)}/>

// DON'T — raw checkbox cells
<td><input type="checkbox" checked={…}/></td>

// DON'T — hand-rolled sticky headers in CSS
.matrix th { position: sticky; top: 0; }
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `PermissionMatrixLayout.css` (use `Grid` and `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders a header row of `RoleBadge`s and a header column of resource labels
- Toggling a cell `Checkbox` emits `onChange` with `(resourceId, roleId, granted)`
- `readOnly` disables every cell; `disabledCells` disables the listed cells
- `role="grid"` is set on the root and arrow-key navigation moves between cells
- Composition probes: `Grid` at root; `Checkbox` per cell; `RoleBadge` per column header
- Forwards ref; spreads remaining props onto root
- axe-core passes in default, readOnly, and empty states
