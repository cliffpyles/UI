---
name: AttachmentList
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, FileAttachment, Button]
replaces-raw: []
---

# AttachmentList

> A list of attached files with add, remove, and reorder affordances.

## Purpose
AttachmentList is the canonical container for collections of attachments — the kind that hangs off comments, tasks, tickets, or messages. It composes one `FileAttachment` per item and owns the "add file" trigger and empty state, so every attachment surface in the product shares the same shape.

## When to use
- A record (task, comment, message) has zero or more attached files
- A form section needs to show pending uploads alongside existing attachments
- A read-only display of attachments on a detail panel

## When NOT to use
- A drag-and-drop upload surface → use **FileUploader** (which can render this for selected files)
- A single file with no list semantics → use **FileAttachment** directly
- An inline preview of an image/PDF body → use **FilePreview**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="column" gap="2">`  | hand-rolled flex/gap               |
| Each row        | `FileAttachment>`                  | raw `<li>` with custom file chrome |
| Add trigger     | `Button variant="ghost" size="sm">`| raw `<button>`                     |
| Empty placeholder | rendered as `Box` content (or via `EmptyState` if richer) | raw styled `<div>` |

## API contract
```ts
interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType?: string;
  url?: string;
}

interface AttachmentListProps extends HTMLAttributes<HTMLDivElement> {
  items: Attachment[];
  onAdd?: () => void;                 // shows Add trigger when set
  onRemove?: (id: string) => void;    // renders remove on each row when set
  onPreview?: (id: string) => void;
  emptyLabel?: ReactNode;             // default "No attachments"
  readOnly?: boolean;                 // suppresses Add and Remove regardless of handlers
}
```
Component uses `forwardRef<HTMLDivElement, AttachmentListProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| empty    | No items → renders `emptyLabel`; trigger still visible if `onAdd`     |
| populated | Renders one `FileAttachment` per item                                |
| read-only | No `Add`/`Remove` controls; rows render in display mode               |

## Accessibility
- Root: `role="list"`; each row is `role="listitem"` (provided by `FileAttachment`).
- Add `Button` has `aria-label="Add attachment"`.
- Empty state is announced via the rendered text — no aria tricks needed.

## Tokens
- Gap inherited from `Box`: `--space-2`
- No new tokens (composition only)

## Do / Don't
```tsx
// DO
<AttachmentList items={files} onAdd={pickFile} onRemove={remove} onPreview={open} />

// DON'T — render rows with custom chrome
<ul>{files.map(f => <li className="attach">…</li>)}</ul>

// DON'T — embed an upload zone here
<AttachmentList><FileUploader/></AttachmentList>   // use FileUploader as the parent
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString` (file sizes formatted inside `FileAttachment`)
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Empty list renders `emptyLabel`
- Each item renders a `FileAttachment` with correct props
- `onAdd` shows trigger; click fires handler
- `onRemove` is forwarded; remove on a row fires with the item id
- `readOnly` suppresses add/remove controls even when handlers are provided
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="FileAttachment"]` resolves for each item
- axe-core passes in empty, populated, and read-only states
