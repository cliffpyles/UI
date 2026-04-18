---
name: FileAttachment
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text, Button]
replaces-raw: []
---

# FileAttachment

> A single attached file row with type icon, name, size, and download/preview/remove controls.

## Purpose
FileAttachment is the canonical chip-or-row representation of a single file — used in comments, messages, task panels, and as the building block of `AttachmentList`. It owns the type-icon mapping and human-readable size formatting so every attachment in the product looks and behaves the same.

## When to use
- A single file shown inline in a comment, message, or detail panel
- A row inside `AttachmentList`
- A pending upload that needs preview/remove controls

## When NOT to use
- A list of files → use **AttachmentList**
- An inline image/PDF preview body → use **FilePreview**
- An upload drop zone → use **FileUploader**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="2" padding="2">` | hand-rolled flex/padding |
| Type icon       | `Icon>` (mapped from mimeType)     | inline `<svg>`                     |
| File name       | `Text size="sm" weight="medium" truncate>` | raw styled `<span>`        |
| File size       | `Text size="caption" color="secondary">` (size pre-formatted) | inline `Intl.NumberFormat` |
| Download / Preview / Remove controls | `Button variant="ghost" size="xs">` + `Icon` | raw `<button>` / raw `<a>` styled |

## API contract
```ts
interface FileAttachmentProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size: number;                       // bytes; component formats via formatFileSize util
  mimeType?: string;
  url?: string;                       // when set, Download is enabled
  onDownload?: () => void;
  onPreview?: () => void;
  onRemove?: () => void;
  status?: "ready" | "uploading" | "error";   // default "ready"
}
```
Component uses `forwardRef<HTMLDivElement, FileAttachmentProps>`. Size formatting goes through a shared `formatFileSize` utility — never inline.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| ready        | Default chrome; controls visible per provided handlers            |
| uploading    | Replaces size text with progress hint; remove cancels upload      |
| error        | Error icon variant + error text token                             |
| read-only    | No `onRemove` / `onDownload` → those controls hidden              |

## Accessibility
- Root: `role="listitem"` when used inside `AttachmentList`; otherwise none.
- Each control `Button` carries an `aria-label` of the form `"Download ${name}"`, `"Preview ${name}"`, `"Remove ${name}"`.
- Type icon is `aria-hidden`; name + size carry meaning.

## Tokens
- Surface: `--file-attachment-surface-default`
- Hover: `--file-attachment-surface-hover`
- Border: `--file-attachment-border`
- Error icon/text: `--file-attachment-error-{icon|text}`
- Padding/gap inherited from `Box`: `--space-2`
- Radius: `--radius-sm`

## Do / Don't
```tsx
// DO
<FileAttachment name="report.pdf" size={184320} mimeType="application/pdf"
  url={url} onDownload={dl} onPreview={open} onRemove={rm} />

// DON'T — inline size formatting
<FileAttachment name={f.name} size={f.size} /* formats via util */ />
// (caller must NOT do `${(f.size/1024).toFixed(1)} KB` inline)

// DON'T — raw anchor
<a href={url} download className="attach">…</a>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatFileSize`)
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Mime-to-icon mapping: pdf, image/*, text/*, application/zip, default
- Size renders via `formatFileSize` (test units across thresholds)
- `onDownload`, `onPreview`, `onRemove` each fire from their respective `Button`
- `status="uploading"` and `status="error"` render their state chrome
- Read-only mode hides controls when handlers absent
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Icon"]`, `[data-component="Text"]` resolve
- axe-core passes in each state
