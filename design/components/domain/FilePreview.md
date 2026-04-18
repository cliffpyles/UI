---
name: FilePreview
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Text]
replaces-raw: []
---

# FilePreview

> An inline preview surface for a file — image thumbnail, PDF page, or plain-text excerpt.

## Purpose
FilePreview owns the "show me what's in this file without downloading it" surface. It picks the right preview affordance from the file's mimeType (image, pdf, text, fallback icon) so callers don't branch on type per surface.

## When to use
- Show an image/PDF/text preview inline in a comment, message, or detail panel
- Render attachment thumbnails in a gallery
- Provide a fallback when a generic file is attached

## When NOT to use
- A row representation of a file → use **FileAttachment**
- A list of files → use **AttachmentList**
- A fullscreen viewer/modal → use **Modal** with this as the body

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="column" gap="2" padding="2">` | hand-rolled flex/padding   |
| Fallback icon   | `Icon size="lg">`                  | inline `<svg>`                     |
| Caption / file name | `Text size="caption" color="secondary" truncate>` | raw `<span>`           |
| Image / PDF / text content | rendered through `Box` (semantic native element acceptable: `<img>`, `<embed>`, `<pre>`) | raw styled `<div>` wrappers |

> Native `<img>`, `<iframe>`/`<embed>`, and `<pre>` are acceptable as the preview content because no existing component wraps them; they are rendered inside a `Box` that owns layout and surface tokens.

## API contract
```ts
interface FilePreviewProps extends HTMLAttributes<HTMLDivElement> {
  url: string;
  name?: string;
  mimeType: string;
  alt?: string;                       // image alt text
  maxHeight?: number;                 // px cap
  fallbackLabel?: ReactNode;          // when type can't be previewed
}
```
Component uses `forwardRef<HTMLDivElement, FilePreviewProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| image    | Renders `<img>` with `alt` (or `name`) inside a `Box` surface         |
| pdf      | Renders `<embed type="application/pdf">` inside a `Box`               |
| text     | Renders truncated text excerpt inside `<pre>` (limited height)        |
| fallback | Renders `Icon` + caption with the file name                           |
| error    | Replaces preview with fallback `Icon` and error caption (`Text`)      |

## Accessibility
- Image previews require `alt` (or use `name`); decorative previews must explicitly set `alt=""`.
- PDF/embed regions get `aria-label="${name} preview"`.
- Fallback `Icon` is decorative; the caption text carries meaning.

## Tokens
- Surface: `--file-preview-surface`
- Border: `--file-preview-border`
- Padding/gap inherited from `Box`: `--space-2`
- Radius: `--radius-md`
- Max height: `--file-preview-max-height`

## Do / Don't
```tsx
// DO
<FilePreview url={url} name="screenshot.png" mimeType="image/png" alt="Login screen" />
<FilePreview url={url} name="contract.pdf" mimeType="application/pdf" />

// DO — fallback
<FilePreview url={url} name="archive.zip" mimeType="application/zip" />

// DON'T — raw img with custom CSS
<img src={url} className="thumb" />

// DON'T — render a download control here
<FilePreview><Button>Download</Button></FilePreview>   // belongs in FileAttachment
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>` (for chrome — content is allowed if file is svg)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `image/*` renders `<img>` with alt
- `application/pdf` renders the pdf embed region with `aria-label`
- `text/*` renders truncated text excerpt
- Unrecognized mime renders fallback `Icon` + caption
- `maxHeight` is applied via the documented token
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Box"]` wraps content
- axe-core passes in image, pdf, text, and fallback states
