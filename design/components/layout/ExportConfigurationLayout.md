---
name: ExportConfigurationLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [forms]
uses: [Box, Modal, FormField, Select, ColumnPicker, Button]
replaces-raw: []
---

# ExportConfigurationLayout

> The standard surface for choosing format, columns, date range, and encoding before triggering an export.

## Purpose
Every export in the product asks the same set of questions: what format, which columns, what range, what encoding. ExportConfigurationLayout owns that flow inside a focused `Modal` so callers only supply the data source and the submit handler. Centralizing the layout means every export dialog has identical groupings, validation hooks, and confirm/cancel ergonomics.

## When to use
- A "Download" or "Export" action that needs more than a one-click trigger
- Any data surface (DataTable, ReportViewerLayout, AuditLogLayout) that supports user-configurable exports
- Bulk download flows that need column or range scoping

## When NOT to use
- A one-click export with no options → render a `Button` directly
- A scheduled, recurring delivery → use **ScheduledDeliveryLayout**
- A shareable URL surface → use **SharedLinkLayout**

## Composition (required)
| Concern              | Use                                                  | Never                                       |
|----------------------|------------------------------------------------------|---------------------------------------------|
| Frame layout         | `Modal`                                              | raw `<dialog>` or hand-rolled overlay       |
| Field group stack    | `Box direction="column" gap>`                        | hand-rolled flex/gap CSS                    |
| Format / encoding    | `FormField` wrapping `Select`                        | raw `<select>`                              |
| Date range fields    | `FormField` wrapping `Select` (or range presets)     | raw `<input type="date">`                   |
| Column selection     | `ColumnPicker`                                       | bespoke checkbox lists                      |
| Footer action row    | `Box direction="row" justify="end" gap>`             | hand-rolled flex CSS                        |
| Confirm / cancel     | `Button` (primary + ghost)                           | raw `<button>`                              |

## API contract
```ts
type ExportFormat = "csv" | "tsv" | "xlsx" | "json" | "pdf";
type ExportEncoding = "utf-8" | "utf-16" | "windows-1252";

interface ExportColumn {
  id: string;
  label: string;
  defaultVisible?: boolean;
}

interface ExportConfigurationValue {
  format: ExportFormat;
  columns: string[];
  range?: { start: string; end: string } | null;
  encoding: ExportEncoding;
}

interface ExportConfigurationLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit" | "children"> {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: ExportConfigurationValue) => void | Promise<void>;
  title?: ReactNode;                  // default "Export"
  formats: ExportFormat[];
  encodings?: ExportEncoding[];
  columns: ExportColumn[];
  rangePresets?: Array<{ id: string; label: string }>;
  defaultValue?: Partial<ExportConfigurationValue>;
  submitting?: boolean;
}
```
Forwarded ref targets the `Modal` root. Remaining props are spread onto the root.

## Required states
| State       | Behavior                                                                      |
|-------------|-------------------------------------------------------------------------------|
| default     | All fields rendered with `defaultValue` applied                               |
| no-columns  | When `columns.length === 0`, ColumnPicker hidden; format/range/encoding remain|
| no-range    | When `rangePresets` omitted, range FormField hidden                           |
| submitting  | Confirm `Button` shows `loading`; all fields disabled                          |
| validation  | FormField errors surfaced inline; submit disabled until resolved              |

## Accessibility
- Dialog labelling, focus trap, Escape, and overlay click are inherited from `Modal`
- Each control is wrapped in `FormField` so labels and error messages are programmatically associated
- `ColumnPicker` exposes its list with `role="group"` and `aria-label="Columns"`
- Submit button reflects `aria-busy` while `submitting`

## Tokens
- Inherits all tokens from `Modal`, `FormField`, `Select`, `ColumnPicker`, `Button`, `Box`
- Adds (component tier): `--export-config-section-gap`

## Do / Don't
```tsx
// DO
<ExportConfigurationLayout
  open={open}
  onClose={() => setOpen(false)}
  formats={["csv", "xlsx", "json"]}
  columns={cols}
  rangePresets={presets}
  onSubmit={runExport}
/>

// DON'T — hand-roll the dialog frame
<div className="overlay"><div className="dialog">…</div></div>

// DON'T — bypass FormField for labels
<label>Format</label><Select .../>

// DON'T — bespoke column checkboxes
{cols.map(c => <input type="checkbox" key={c.id}/>)}
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ExportConfigurationLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders only when `open === true`
- `onSubmit` receives the merged value (format, columns, range, encoding)
- `submitting` disables fields and marks the confirm button busy
- Cancel button invokes `onClose`
- Composition probes: `Modal`, `FormField`, `Select`, `ColumnPicker`, `Button` resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes in default and submitting states
