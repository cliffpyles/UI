---
name: ContextualDrawerLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Modal]
replaces-raw: []
---

# ContextualDrawerLayout

> A right-sliding panel that overlays the page with detail content for the current selection — without taking the user away from their list.

## Purpose
ContextualDrawerLayout owns the chrome of a non-blocking detail panel: the right-edge slide-in surface, the header with title and close, the optional footer for primary actions, focus trapping inside the panel, and the keyboard model (Esc to close). It builds on `Modal`'s focus-trap and portal infrastructure but presents as a side panel rather than a centered dialog. Callers supply title, body, and footer content; the layout owns the frame.

## When to use
- A row in a list whose detail can be reviewed without losing the list context
- Quick edits or inspections where the surrounding page should remain visible
- A workflow that needs a focus-trapped surface but is not a "must complete" dialog

## When NOT to use
- A blocking task that demands a decision before continuing — use **Modal**
- Drilling between sibling records with their own URL — use **MasterDetailLayout**
- Hover-revealed quick info — use **PopoverPeekLayout**

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Modal` (provides portal, focus trap, scrim, Escape) | raw `<dialog>`                            |
| Drawer surface       | `Box display="flex" direction="column">`           | raw `<div>` with flex CSS                   |
| Header layout        | `Box display="flex" justify="between" align="center">` | hand-rolled flex CSS                    |
| Body region          | `Box as="section">`                                | raw `<section>` with padding CSS            |
| Footer layout        | `Box display="flex" justify="end" gap>`            | hand-rolled flex CSS                        |

The drawer reuses `Modal`'s underlying focus-trap, scroll-lock, and portal mounting; the layout passes a `placement="right"` flag that `Modal` honors via tokens (no new dialog primitive required).

## API contract
```ts
interface ContextualDrawerLayoutProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";        // width tokens
  closeOnOverlayClick?: boolean;    // default true
  closeOnEscape?: boolean;          // default true
  children: ReactNode;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| closed       | `open === false` → returns null; no DOM; body scroll restored             |
| opening      | Drawer slides in from the right; focus moves to first focusable inside    |
| open         | Body scroll locked; focus trapped; Escape and overlay click close per props |
| closing      | Drawer slides out; focus restores to the element that triggered the open  |
| no-title     | Caller must still label the drawer (`aria-label` or `VisuallyHidden` title) |

## Accessibility
- Root is `role="dialog"` with `aria-modal="true"` (delegated to `Modal`).
- The drawer is anchored to the viewport's right edge; focus order starts inside the drawer.
- Close affordance lives in the header and is a real `Button` + `Icon` rendered by the caller's title slot or by the underlying `Modal` close prop.
- Escape closes (when `closeOnEscape`); overlay click closes (when `closeOnOverlayClick`).

## Tokens
- Width: `--drawer-width-{sm|md|lg}`
- Surface inherited from `Modal`: `--color-surface-overlay`, `--shadow-overlay`, `--z-modal`
- Slide duration: `--duration-normal`
- Header / footer padding: `--drawer-header-padding-{x|y}`, `--drawer-footer-padding-{x|y}`
- Scrim: `--color-overlay-scrim`

## Do / Don't
```tsx
// DO
<ContextualDrawerLayout
  open={open}
  onClose={() => setOpen(false)}
  title="Order #1042"
  footer={<Button onClick={save}>Save</Button>}
>
  <OrderDetailBody/>
</ContextualDrawerLayout>

// DON'T — hand-rolled side panel
<div className="drawer" style={{ position: "fixed", right: 0, top: 0 }}>{…}</div>

// DON'T — re-implement focus trap
useEffect(() => trapFocusManually(ref), []);
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owner components
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>`
- Hand-rolled `display: grid` or `display: flex` in this layout's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders nothing when `open={false}`
- Focus moves into the drawer on open and returns to the trigger on close
- Tab cycles within the drawer (focus trap delegated to `Modal`)
- Escape closes when `closeOnEscape`; overlay click closes when `closeOnOverlayClick`
- Body scroll is locked while open and restored on close
- Composition probe: `Modal` and the column `Box` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with title, body, and footer
