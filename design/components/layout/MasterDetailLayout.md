---
name: MasterDetailLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, ResizablePanel]
replaces-raw: []
---

# MasterDetailLayout

> A two-pane page frame with a list/table on the left and a resizable detail panel on the right.

## Purpose
MasterDetailLayout owns the chrome for the canonical "list of things, detail of one thing" page. It centralizes the responsive split, the resize handle, the persisted pane width, the responsive collapse to a stack at narrow widths, and the contract that the detail pane reflects the master pane's selection. Callers supply the master and detail content; the layout owns the frame.

## When to use
- A list/table that should be browsed alongside its detail without leaving the page
- Inboxes, ticket queues, asset libraries with rich per-item detail
- Any side-by-side workflow where horizontal space is the dominant constraint

## When NOT to use
- A side panel that overlays the page non-destructively — use **ContextualDrawerLayout**
- A hierarchical tree on the left — use **HierarchicalTreeLayout**
- A full-page detail with its own URL — use **EntityDetailLayout**

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Grid` with named tracks `master detail`           | raw CSS Grid in stylesheet                  |
| Resizer              | `ResizablePanel` between master and detail         | hand-rolled drag handle                     |
| Master container     | `Box as="section" display="flex" direction="column">` | raw `<section>` with flex CSS            |
| Detail container     | `Box as="section" display="flex" direction="column">` | raw `<section>` with flex CSS            |

At narrow widths the layout switches to a single-column stack via tokens; the master and detail still render through the same `Box as="section"` containers.

## API contract
```ts
interface MasterDetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  master: ReactNode;
  detail: ReactNode;
  defaultMasterWidth?: number;        // px; persisted by ResizablePanel
  minMasterWidth?: number;
  maxMasterWidth?: number;
  emptyDetail?: ReactNode;            // shown when no item is selected
  hasSelection: boolean;              // master tells the layout whether to show empty state
  responsive?: "stack" | "always-split"; // default "stack"
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Master and detail render side-by-side; resizer between them               |
| no-selection | `hasSelection === false` → detail renders the `emptyDetail` slot          |
| narrow       | At a token-defined breakpoint, layout stacks master above detail          |
| resizing     | While dragging, root carries `data-resizing="true"`                       |
| keyboard     | Resizer is keyboard-operable (delegated to `ResizablePanel`)              |

## Accessibility
- Root carries `role="group"` with `aria-label="Master detail"` so it is announced as a coherent region.
- Master pane is `<section aria-label="List">`; detail pane is `<section aria-label="Detail">`.
- Resize handle exposes `role="separator"` with `aria-orientation="vertical"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (delegated to `ResizablePanel`).
- Selection changes update the detail pane and are announced via the detail's `aria-live` slot when supplied by the caller.

## Tokens
- Pane widths: `--master-detail-master-width-default`, `--master-detail-master-width-min`, `--master-detail-master-width-max`
- Stack breakpoint: `--breakpoint-md`
- Surface inherited from `Box` / `Grid`
- Resizer color: inherited from `ResizablePanel`

## Do / Don't
```tsx
// DO
<MasterDetailLayout
  master={<TicketList/>}
  detail={<TicketDetail id={sel}/>}
  hasSelection={!!sel}
  emptyDetail={<EmptyState title="Pick a ticket"/>}
/>

// DON'T — hand-rolled grid + drag handle
<div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
  …<div onMouseDown={startDrag}/>…
</div>

// DON'T — render the detail when there is no selection
<MasterDetailLayout master={…} detail={<DetailFor id={undefined}/>} hasSelection={false}/>
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
- Renders master and detail in the named-track positions
- `hasSelection={false}` renders the `emptyDetail` slot in the detail pane
- Resizer handle is reachable via Tab and movable via ArrowLeft/Right
- At a viewport below the stack breakpoint, layout switches to single-column
- Composition probe: `Grid` and `ResizablePanel` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes in default and no-selection states
