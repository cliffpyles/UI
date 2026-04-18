---
name: ImportMappingLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-entry]
uses: [Box, FileUploader, Table, Select]
---

# ImportMappingLayout

> A guided frame for uploading a file, mapping its columns to a target schema, and previewing validation before import.

## Purpose
ImportMappingLayout owns the CSV / spreadsheet ingest workflow that every data tool eventually needs: drop a file, see detected columns, map each to the target schema via `Select`, and review a validation preview that highlights row-level errors. It chains `FileUploader`, a column-map `Table`, and a sample-rows `Table` so the user can confirm the import without leaving the page.

## When to use
- Importing rows from CSV / Excel into a typed schema
- Migrating data from another system with column re-mapping
- Any upload that requires human-confirmed schema mapping before commit

## When NOT to use
- Single-file uploads with no mapping → use **FileUploader** alone
- Streaming or programmatic ingest → no UI layout needed
- Replacing one record's attachments → use **FileUploader** in a form

## Composition (required)
| Concern         | Use                                                | Never                              |
|-----------------|----------------------------------------------------|------------------------------------|
| Frame layout    | `Box direction="column">` for stages               | hand-rolled `display: grid`/`flex` |
| Upload step     | `FileUploader`                                     | raw `<input type="file">`          |
| Mapping grid    | `Table` (source column → target field rows)        | reimplementing tabular markup      |
| Field picker    | `Select` per row                                   | raw `<select>`                     |
| Validation rows | `Table` with row-level error styling               | inline list of issues              |

## API contract
```ts
interface ImportMappingLayoutProps extends HTMLAttributes<HTMLDivElement> {
  step: "upload" | "map" | "preview";
  onStepChange: (step: "upload" | "map" | "preview") => void;
  onFileAccepted: (file: File) => void;
  detectedColumns?: string[];
  targetFields: { id: string; label: string; required?: boolean }[];
  mapping: Record<string, string | null>;            // sourceColumn -> targetFieldId
  onMappingChange: (next: Record<string, string | null>) => void;
  previewRows?: PreviewRow[];                        // includes per-cell validation
  onCommit?: () => void;
}
```
Forwards ref to the root `<div>`.

## Required states
| State     | Behavior                                                                  |
|-----------|---------------------------------------------------------------------------|
| upload    | `FileUploader` is active; mapping/preview hidden                          |
| map       | Mapping `Table` renders with a `Select` per detected column               |
| preview   | Sample-rows `Table` renders with cell-level error highlights              |
| invalid   | Required target fields unmapped → commit disabled, message announced      |
| committing| Commit is `aria-busy="true"`                                              |

## Accessibility
- Root is a `<main>` landmark with `aria-label="Import data"`
- Step transitions update `aria-current="step"` on the active stage indicator
- Validation errors in the preview `Table` are exposed via `aria-describedby` on the cell
- File drop zone retains keyboard upload (delegated to `FileUploader`)

## Tokens
- Inherits all tokens from `Box`, `FileUploader`, `Table`, `Select`
- Adds (component tier): `--import-mapping-step-gap`, `--import-mapping-preview-max-height`

## Do / Don't
```tsx
// DO
<ImportMappingLayout
  step={step}
  onStepChange={setStep}
  onFileAccepted={parse}
  detectedColumns={cols}
  targetFields={schemaFields}
  mapping={mapping}
  onMappingChange={setMapping}
  previewRows={preview}
  onCommit={commit}
/>

// DON'T — raw file input
<input type="file" onChange={…} />

// DON'T — own the mapping table markup
<table>{cols.map(c => <tr><td>{c}</td><td><select>…</select></td></tr>)}</table>
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
- File acceptance moves step from `upload` to `map`
- Each detected column gets a `Select` of target fields
- Required target fields unmapped disables commit
- Preview rows render error cells with `aria-describedby`
- Forwards ref; spreads remaining props onto root
- Composition probe: `FileUploader`, `Table`, `Select` all render inside output
- axe-core passes in upload, map, preview, invalid
