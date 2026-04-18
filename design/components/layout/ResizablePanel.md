---
name: ResizablePanel
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Icon]
replaces-raw: []
---

# ResizablePanel

> A pair of regions divided by a draggable handle that lets the user resize them, with size constraints and keyboard support.

## Purpose
ResizablePanel is the canonical split layout — two adjacent regions (horizontal or vertical) separated by a handle that the user can drag (or operate via keyboard) to resize. By owning the constraint clamping, the handle's hit target, the persisted size shape, and the ARIA `separator` semantics, every split surface in the product (sidebar/main, query/results, list/detail) behaves identically without each feature reinventing the math.

## When to use
- Two regions that should share a row or column with user-controlled proportions
- Persistent split workspaces (file tree + editor, query + results)
- Surfaces that benefit from collapsing one side to a minimum threshold

## When NOT to use
- A fixed-width sidebar inside a frame → use **AppShell** with its sidebar slot
- A modal/popover that should not affect surrounding layout → use **Modal** or **Popover**
- More than two regions → compose multiple `ResizablePanel`s recursively

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="row"` or `direction="column"`| hand-rolled flex CSS                          |
| First / second region | `Box>` (children slots)                      | raw `<div>` with overflow CSS                 |
| Drag handle visual    | `Icon name="grip-vertical">` or `name="grip-horizontal">` inside a `Box` | inline `<svg>` grip glyph |

## API contract
```ts
type Orientation = "horizontal" | "vertical";

interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;      // default "horizontal" (handle is vertical bar)
  primary: ReactNode;
  secondary: ReactNode;
  defaultSize?: number;           // size of `primary` (px or %)
  size?: number;                  // controlled
  onSizeChange?: (next: number) => void;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;          // primary collapses below `minSize`
  collapsedSize?: number;
  keyboardStep?: number;          // px per Arrow press; default 16
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Primary at `defaultSize`; handle visible between regions              |
| dragging        | Handle follows pointer; `cursor` reflects orientation                 |
| at-min / at-max | Drag clamps to constraints; handle visually flagged                   |
| collapsed       | Primary snaps to `collapsedSize`; handle still draggable to expand    |
| keyboard        | Handle focusable; Arrow keys adjust size by `keyboardStep`            |
| disabled        | When neither `onSizeChange` nor `defaultSize` is set, layout is static|

## Accessibility
- Handle has `role="separator"` with `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-controls` referencing the primary region
- Handle is in tab order (`tabIndex={0}`); Arrow keys resize, Home/End jump to min/max
- Drag operations honor `prefers-reduced-motion` (no spring animation)
- Pointer drag never strands keyboard users — the handle remains keyboard-operable mid-drag

## Tokens
- Inherits Box and Icon tokens
- Adds (component tier): `--resizable-panel-handle-thickness`, `--resizable-panel-handle-hit-target`, `--resizable-panel-handle-color`, `--resizable-panel-handle-color-hover`

## Do / Don't
```tsx
// DO
<ResizablePanel
  orientation="horizontal"
  primary={<FileTree/>}
  secondary={<Editor/>}
  defaultSize={280}
  minSize={200}
  maxSize={480}
  collapsible
/>

// DON'T — hand-roll the handle
<div className="split"><div/><div className="handle" onMouseDown={…}/><div/></div>

// DON'T — drop ARIA semantics
<div onMouseDown={drag}/>           // missing role="separator", aria-valuenow, etc.

// DON'T — use a unicode grip glyph
<span>⋮</span>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ResizablePanel.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>` (handle uses `role="separator"` with key/pointer handlers, not `onClick`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders primary and secondary regions with the handle between them
- Handle has `role="separator"` and the correct `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Pointer drag updates size and fires `onSizeChange`; clamps to `minSize` / `maxSize`
- Arrow key adjusts size by `keyboardStep`; Home/End snap to min/max
- `collapsible` snaps to `collapsedSize` below `minSize` and re-expands on drag out
- Composition probes: `Box` is the layout; `Icon` renders the grip
- Forwards ref; spreads remaining props onto root
- axe-core passes in horizontal and vertical orientations
