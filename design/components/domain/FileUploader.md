---
name: FileUploader
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Icon, ProgressBar, Text, Button]
replaces-raw: []
---

# FileUploader

> A drop zone for uploading one or more files, with progress and type/size restrictions.

## Purpose
FileUploader owns the upload interaction — drag/drop, browse, per-file progress, validation, retry, and cancel. Centralizing this behavior means every upload surface in the product enforces the same allowed types, size limits, and accessibility behavior, and surfaces errors the same way.

## When to use
- The user needs to add one or more files to a record or message
- A profile/avatar upload (single file mode)
- A bulk import or attachment area (multi-file mode)

## When NOT to use
- A read-only list of attachments → use **AttachmentList**
- A single existing file row → use **FileAttachment**
- An inline preview of an image/PDF → use **FilePreview**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="column" align="center" gap="3" padding="4">` | hand-rolled flex/padding |
| Drop zone glyph | `Icon size="lg">`                  | inline `<svg>`                     |
| Instruction text | `Text size="sm" color="secondary">` | raw `<p>` with typography CSS     |
| Browse trigger  | `Button variant="secondary" size="sm">` | raw `<button>` / raw `<label for>` styled |
| Per-file progress | `ProgressBar>`                   | hand-rolled `<progress>` styled    |
| Status / error text | `Text size="caption">`         | raw `<span>`                       |

> The component renders a hidden file `<input type="file">` for keyboard/browse support; this is acceptable as the owner of file-input semantics and is the only allowed `<input>` in this implementation.

## API contract
```ts
interface FileUploaderProps extends HTMLAttributes<HTMLDivElement> {
  multi?: boolean;                    // default false
  accept?: string;                    // mime list, e.g. "image/*,application/pdf"
  maxSize?: number;                   // bytes per file
  onUpload: (files: File[]) => Promise<void> | void;
  onError?: (error: { file?: File; reason: "size" | "type" | "upload"; message: string }) => void;
  disabled?: boolean;
}
```
Component uses `forwardRef<HTMLDivElement, FileUploaderProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| idle         | Drop zone visible with `Icon`, instruction `Text`, browse `Button` |
| dragging     | Active surface token; instruction copy switches to "Drop to upload" |
| uploading    | Replaces zone with per-file `ProgressBar` rows                    |
| success      | Brief success state; returns to idle                              |
| error        | Error `Text` + retry option; `onError` fired                      |
| disabled     | Zone non-interactive; visually muted                              |

## Accessibility
- Root has `role="region"` and `aria-label="File upload"` (overridable).
- The drop zone is keyboard activatable via the browse `Button`; drag/drop is supplementary.
- Errors are announced via `aria-live="polite"` text.
- File-type and size restrictions are surfaced in the instruction text, not only enforced silently.

## Tokens
- Surface: `--file-uploader-surface-default`, `--file-uploader-surface-active`
- Border: `--file-uploader-border-default`, `--file-uploader-border-active`
- Padding/gap inherited from `Box`: `--space-3`, `--space-4`
- Radius: `--radius-md`
- Duration: `--duration-fast`

## Do / Don't
```tsx
// DO
<FileUploader multi accept="image/*" maxSize={5_000_000}
  onUpload={upload} onError={notify} />

// DON'T — bare input
<input type="file" multiple onChange={…} />

// DON'T — hand-rolled progress
<div className="bar" style={{ width: `${pct}%` }} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<select>`, `<textarea>`, `<dialog>`
- Raw `<input>` outside the single hidden file input owned by this component
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` (size hint formatted via util)
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Browse `Button` triggers the file picker
- Drag enter / leave toggles the active surface token
- Files exceeding `maxSize` fire `onError({ reason: "size" })` and are not uploaded
- Files outside `accept` fire `onError({ reason: "type" })` and are not uploaded
- During upload, a `ProgressBar` is rendered per file
- `disabled` prevents browse and drop
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="ProgressBar"]`, `[data-component="Button"]` resolve
- axe-core passes in idle, dragging, uploading, error states
