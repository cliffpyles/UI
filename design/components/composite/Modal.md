---
name: Modal
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: []
uses: [Box, Button, Icon, Text, VisuallyHidden]
replaces-raw: ["<dialog>", "raw overlay <div>"]
---

# Modal

> A focus-trapped, portalled overlay surface for tasks that require user attention before they continue.

## Purpose
Modal owns the cross-cutting concerns every dialog needs: portal, scroll lock, focus trap, focus restoration to the trigger, Escape-to-close, overlay click handling, and `role="dialog"` wiring with `aria-labelledby`/`aria-describedby`. By centralizing these concerns, callers only think about content, not about how to build a correct dialog from scratch.

## When to use
- A task that must be completed or dismissed before the user resumes (form, confirmation, destructive action)
- A focused detail view that needs to overlay the current page
- A workflow that should preserve the page underneath

## When NOT to use
- Non-blocking notifications — use **Toast**
- Quick contextual content tied to a trigger — use **Popover**
- Long content or full workflows — use a route, not a dialog
- Validation errors on a field — use **FormField** error slot

## Composition (required)
| Concern             | Use                                          | Never                                            |
|---------------------|----------------------------------------------|--------------------------------------------------|
| Surface             | `Box` (radius, shadow, padding via tokens)   | raw `<div>` with surface CSS                     |
| Header layout       | `Box display="flex" justify="between">`      | hand-rolled flex CSS                             |
| Title text          | `Text as="h2" size="lg" weight="semibold">`  | raw `<h2>` with typography CSS                   |
| Description text    | `Text as="p" size="sm" color="secondary">`   | raw `<p>` with typography CSS                    |
| Close button        | `Button variant="ghost" size="sm"` + `Icon name="x"` | raw `<button>` with inline `<svg>`       |
| Footer layout       | `Box display="flex" justify="end" gap>`      | hand-rolled flex CSS                             |
| Body region         | `Box>`                                       | raw `<div>`                                      |
| Screen-reader-only labels (e.g. unnamed close) | `VisuallyHidden`                  | `display: none` or off-screen positioning        |

The native `<dialog>` element is acceptable as the root if used; otherwise the dialog surface composes `Box` with `role="dialog"`. Either way, no raw `<button>` or `<svg>` inside the implementation.

## API contract
```ts
type ModalSize = "sm" | "md" | "lg";

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;                 // default "md"
  closeOnOverlayClick?: boolean;    // default true
  closeOnEscape?: boolean;          // default true
  children: ReactNode;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| closed       | `open === false` → returns null; no DOM; body scroll restored             |
| opening      | Portal mounts; focus moves to first focusable element inside the dialog   |
| open         | Body scroll locked; focus trapped inside; Escape and overlay click close (per props) |
| closing      | Returns focus to the element that triggered the open                      |
| no-title     | When `title` is omitted, dialog must still be labelled (caller supplies `aria-label` or VisuallyHidden title) |

## Accessibility
- `role="dialog"` with `aria-modal="true"`; `aria-labelledby` set when `title` is provided.
- Focus moves into the dialog on open and is trapped via Tab/Shift-Tab.
- Focus restores to the previously-focused element on close.
- Escape closes (when `closeOnEscape`).
- Body scroll is locked while open.
- Close button always carries `aria-label="Close"` (icon-only).

## Tokens
- Surface inherited from `Box`: `--color-surface-overlay`, `--radius-lg`, `--shadow-overlay`
- Overlay: `--color-overlay-scrim`, `--z-modal`
- Spacing: `--modal-padding`, `--modal-gap`
- Size widths: `--modal-width-{sm|md|lg}`
- Duration: `--duration-normal`

## Do / Don't
```tsx
// DO
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project"
  description="This action cannot be undone."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete <b>{name}</b>?
</Modal>

// DON'T — hand-rolled close button
<Modal title="…">
  <button onClick={onClose}><svg>…</svg></button>
</Modal>

// DON'T — modal as a route shell
<Modal open><EntireFeaturePage/></Modal>   // use a route
```

## Forbidden patterns (enforced)
- Raw `<button>` or inline `<svg>` for close (use `Button` + `Icon`)
- Raw styled `<h2>`, `<p>` for title/description (use `Text`)
- Hand-rolled flex CSS for header/footer layout (use `Box`)
- Hardcoded color, spacing, radius, shadow, z-index values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders nothing when `open={false}`
- Focus moves into the dialog on open and returns to trigger on close
- Tab cycles within the dialog (focus trap)
- Escape closes when `closeOnEscape`; overlay click closes when `closeOnOverlayClick`
- Body scroll is locked while open and restored on close
- `aria-labelledby` resolves to the title node when `title` is provided
- Composition probe: `Button` renders the close control; `Text` renders the title
- axe-core passes in open state with title + description + footer
