---
name: FullViewportCanvas
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box]
replaces-raw: []
---

# FullViewportCanvas

> A chromeless full-bleed surface that hosts an immersive canvas (map, graph, video) with floating overlays.

## Purpose
FullViewportCanvas removes all surrounding chrome and gives a single child component the entire viewport, while still providing slotted overlays (top, bottom, leading, trailing) that float above the canvas without affecting its layout. It exists so immersive surfaces — maps, network graphs, fullscreen video, large visualizations — never have to fight the AppShell or reinvent overlay positioning.

## When to use
- Map, graph, or visualization surfaces that need every available pixel
- A focused viewer (image, document, media) with floating controls
- A presentation or demo mode that intentionally hides app chrome

## When NOT to use
- Content that needs persistent global navigation → use **AppShell**
- A map with a sibling data panel → use **MapLayout**
- An IDE-style multi-pane workspace → use **MultiPanelWorkspace**

## Composition (required)
| Concern              | Use                          | Never                              |
|----------------------|------------------------------|------------------------------------|
| Frame layout         | `Box position="relative">`   | hand-rolled flex/grid CSS          |
| Canvas slot wrapper  | `Box>` (fills viewport)      | raw `<div>` with sizing CSS        |
| Overlay slot wrappers| `Box position="absolute">`   | raw `<div>` with positioning CSS   |

## API contract
```ts
interface FullViewportCanvasProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;             // the canvas content
  topOverlay?: ReactNode;
  bottomOverlay?: ReactNode;
  leadingOverlay?: ReactNode;
  trailingOverlay?: ReactNode;
  label: string;                   // accessible name for the canvas region
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                       |
|----------------|----------------------------------------------------------------|
| default        | Canvas fills the viewport; provided overlays float above it    |
| no-overlays    | Only the canvas renders; no overlay wrappers in the DOM        |
| all-overlays   | All four overlay slots present and non-overlapping by default  |

## Accessibility
- Root carries `role="region"` with `aria-label` from the `label` prop
- Overlays must remain reachable by keyboard; their interactive children own their own roles
- Overlay surfaces never trap focus — the canvas remains keyboard-reachable
- The canvas region is the first focusable target when its child supports focus

## Tokens
- Inherits all surface tokens from `Box`
- Adds (component tier): `--full-viewport-canvas-overlay-inset`, `--full-viewport-canvas-overlay-gap`
- Z-index: `--z-canvas-overlay`

## Do / Don't
```tsx
// DO
<FullViewportCanvas
  label="Network graph"
  topOverlay={<GraphToolbar/>}
  bottomOverlay={<GraphLegend/>}
>
  <NetworkGraph data={graph}/>
</FullViewportCanvas>

// DON'T — position overlays inline
<div style={{ position: "absolute", top: 12, left: 12 }}>…</div>

// DON'T — wrap in AppShell when chromeless was the point
<AppShell header={<TopBar/>}><FullViewportCanvas .../></AppShell>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `FullViewportCanvas.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders the canvas region with the supplied `aria-label`
- Each overlay slot renders only when provided
- Overlays do not displace canvas content (canvas fills the frame)
- Keyboard focus reaches both canvas content and overlay controls
- Composition probe: `Box` resolves at the root and around each overlay slot
- Forwards ref; spreads remaining props onto root
- axe-core passes with no overlays and with all four overlays
