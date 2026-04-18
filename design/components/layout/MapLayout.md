---
name: MapLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, ResizablePanel]
replaces-raw: []
---

# MapLayout

> A geographic map surface with a resizable data sidebar for filters, results, and selection details.

## Purpose
MapLayout is the standard frame for map-driven product surfaces — fleet tracking, store locators, coverage analysis, asset maps. It owns the split between the map canvas and the data sidebar, the sidebar's resize handle, and the sidebar collapse behavior, so every map-based surface in the product feels coherent regardless of which mapping library renders inside the canvas slot.

## When to use
- Geographic visualizations paired with a list of features/results
- Asset, fleet, or facility location surfaces
- Geo-aware filtering and exploration

## When NOT to use
- Non-geographic node-link diagrams → use **GraphLayout**
- Map-only with no data sidebar → use **FullViewportCanvas**
- A 2D matrix of geo-aggregates → use **HeatmapGrid** inside a regular page

## Composition (required)
| Concern              | Use                                          | Never                                  |
|----------------------|----------------------------------------------|----------------------------------------|
| Frame layout         | `Grid` with `sidebar`/`map` named tracks     | hand-rolled `display: grid`            |
| Sidebar split        | `ResizablePanel>` for the sidebar track       | hand-rolled drag handles               |
| Sidebar content      | `Box direction="column" gap>`                | hand-rolled flex CSS                   |
| Map canvas wrapper   | `Box position="relative">`                   | raw `<div>` with sizing CSS            |
| Map overlay slots    | `Box position="absolute">`                   | raw `<div>` with positioning CSS       |

## API contract
```ts
interface MapLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  children: ReactNode;             // map renderer
  sidebarSide?: "leading" | "trailing";  // default "leading"
  defaultSidebarSize?: number;     // 0..1 fraction; default 0.3
  sidebarCollapsible?: boolean;    // default true
  topOverlay?: ReactNode;
  bottomOverlay?: ReactNode;
  label: string;                   // accessible name for the map
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Sidebar at `defaultSidebarSize`; map fills remaining space             |
| resized        | User drag updates sidebar/map split via `ResizablePanel`              |
| collapsed      | Sidebar collapsed → map fills full width                              |
| narrow viewport| Sidebar drawer-style overlay above the map                            |

## Accessibility
- Map canvas wrapper carries `role="region"` with `aria-label` from `label`
- Sidebar carries `role="complementary"` with an explicit `aria-label`
- Resize handle exposes `role="separator"` with `aria-orientation="vertical"` and value attributes
- Map and overlay controls remain keyboard-reachable; sidebar collapse trigger has `aria-expanded` + `aria-controls`

## Tokens
- Inherits all tokens from `Grid`, `Box`, `ResizablePanel`
- Adds (component tier): `--map-layout-sidebar-min`, `--map-layout-sidebar-max`, `--map-layout-overlay-inset`
- Z-index: `--z-canvas-overlay`

## Do / Don't
```tsx
// DO
<MapLayout
  label="Coverage map"
  sidebar={<ResultsList .../>}
  topOverlay={<MapToolbar/>}
>
  <Mapbox .../>
</MapLayout>

// DON'T — hand-roll the resize handle
<div className="resizer" onMouseDown={beginDrag}/>

// DON'T — render with no accessible name
<MapLayout sidebar={<X/>}><Map/></MapLayout>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `MapLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders sidebar (complementary) and map (region) landmarks
- `sidebarSide` reorders the tracks
- Resize handle drag updates the split
- Sidebar collapse hides the sidebar and expands the map
- Top/bottom overlays render only when provided
- Composition probes: `Grid` at root; `ResizablePanel` for sidebar; `Box` for map wrapper
- Forwards ref; spreads remaining props onto root
- axe-core passes in expanded and collapsed states
