---
name: GraphLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Button]
replaces-raw: []
---

# GraphLayout

> A pannable, zoomable canvas for force-directed or hierarchical graphs, with consistent zoom controls and overlay slots.

## Purpose
GraphLayout is the standard frame for any graph-style surface — service maps, lineage diagrams, dependency trees, network topologies. It owns the pan/zoom transform plumbing, the placement of zoom controls, and the overlay slots for legends, mini-maps, and selection details, so every graph surface in the product behaves identically and graph rendering libraries can drop into the canvas slot without rebuilding chrome.

## When to use
- Force-directed or hierarchical visualizations of relationships
- Service / dependency / lineage maps
- Topology and architecture diagrams

## When NOT to use
- Geographic data → use **MapLayout**
- A 2D matrix of values → use **PivotLayout** or **HeatmapGrid**
- Tabular relationship data → use **DataGridLayout**

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Box position="relative">`                   | hand-rolled flex/grid CSS              |
| Canvas slot wrapper  | `Box>` (transform target)                    | raw `<div>` with sizing/transform CSS  |
| Overlay slots        | `Box position="absolute">`                   | raw `<div>` with positioning CSS       |
| Zoom controls        | `Button variant="ghost">`                    | raw `<button>` for +/- /fit            |

## API contract
```ts
interface GraphLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;             // graph renderer; receives current transform via context
  label: string;                   // accessible name for the canvas
  legend?: ReactNode;
  miniMap?: ReactNode;
  selectionPanel?: ReactNode;
  initialZoom?: number;            // default 1
  minZoom?: number;                // default 0.25
  maxZoom?: number;                // default 4
  onZoomChange?: (zoom: number) => void;
  showZoomControls?: boolean;      // default true
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Canvas at `initialZoom`; zoom controls and provided overlays render   |
| zooming        | Pinch / wheel updates transform within `[minZoom, maxZoom]`           |
| panning        | Pointer drag translates the transform                                 |
| selection-open | `selectionPanel` slot mounts (typically right-side floating panel)    |
| no-controls    | Zoom controls hidden when `showZoomControls === false`                |

## Accessibility
- Root carries `role="region"` with `aria-label` from `label`
- Zoom controls are real `Button`s with explicit labels ("Zoom in", "Zoom out", "Fit")
- Keyboard zoom: `+`/`-` on the focused canvas; `0` resets
- Keyboard pan: arrow keys translate the transform by a token-defined step
- Graph nodes inside the canvas own their own focus and roles

## Tokens
- Inherits all tokens from `Box` and `Button`
- Adds (component tier): `--graph-layout-overlay-inset`, `--graph-layout-zoom-step`, `--graph-layout-pan-step`
- Z-index: `--z-canvas-overlay`

## Do / Don't
```tsx
// DO
<GraphLayout
  label="Service map"
  legend={<GraphLegend .../>}
  miniMap={<MiniMap/>}
  selectionPanel={selected ? <NodeDetails .../> : null}
>
  <ForceGraph .../>
</GraphLayout>

// DON'T — build zoom controls with raw buttons + svg
<button onClick={zoomIn}><svg>…</svg></button>

// DON'T — wrap a map in here
<GraphLayout><LeafletMap/></GraphLayout>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `GraphLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders the canvas region with the supplied `aria-label`
- Zoom controls invoke `onZoomChange` and respect min/max
- Keyboard `+`/`-`/`0` adjust and reset zoom
- Each provided overlay slot renders only when supplied
- Composition probes: `Box` at root; `Button` for each zoom control
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without overlays
