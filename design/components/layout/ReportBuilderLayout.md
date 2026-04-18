---
name: ReportBuilderLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Card, Button]
replaces-raw: []
---

# ReportBuilderLayout

> A three-pane workspace — source palette, drop canvas, and inspector — for assembling custom reports.

## Purpose
Custom-report tooling has the same structural needs across every product: a list of available fields/widgets, a working canvas that accepts drops and reorders, and a per-selection inspector. ReportBuilderLayout owns that frame so callers supply only the source list, the canvas content, and the inspector content — the named tracks, scroll containment, and toolbar slot are guaranteed to be consistent.

## When to use
- A drag-and-drop report or dashboard builder
- Any author-time surface where a palette feeds into a working canvas with a side inspector
- Template or layout editors that need a stable three-pane frame

## When NOT to use
- Read-only consumption of a finished report → use **ReportViewerLayout**
- A simple form-based report config → use **ExportConfigurationLayout**
- A wizard with sequential steps → use a wizard pattern

## Composition (required)
| Concern             | Use                                                            | Never                                  |
|---------------------|----------------------------------------------------------------|----------------------------------------|
| Frame layout        | `Grid` with named tracks `palette`/`canvas`/`inspector`        | hand-rolled `display: grid` in CSS     |
| Toolbar row         | `Box direction="row" align="center" justify="between" gap>`    | hand-rolled flex CSS                   |
| Palette stack       | `Box direction="column" gap>`                                  | hand-rolled flex CSS                   |
| Palette item card   | `Card`                                                         | raw `<div>` with border CSS            |
| Canvas region       | `Box>` (scroll container)                                      | raw `<div>` with overflow CSS          |
| Inspector stack     | `Box direction="column" gap>`                                  | hand-rolled flex CSS                   |
| Save / preview      | `Button`                                                       | raw `<button>`                         |

## API contract
```ts
interface ReportBuilderLayoutProps extends HTMLAttributes<HTMLDivElement> {
  toolbar?: ReactNode;
  palette: ReactNode;
  canvas: ReactNode;
  inspector?: ReactNode;
  inspectorOpen?: boolean;
  defaultInspectorOpen?: boolean;
  onInspectorOpenChange?: (open: boolean) => void;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State            | Behavior                                                                |
|------------------|-------------------------------------------------------------------------|
| default          | Palette, canvas, and inspector all visible in named tracks              |
| inspector-closed | Inspector track collapses; canvas expands to fill the freed space       |
| no-toolbar       | When `toolbar` omitted, toolbar row removed                             |
| narrow viewport  | Palette and inspector hide behind disclosure triggers in the toolbar    |

## Accessibility
- Each pane is a landmark region: palette `role="region" aria-label="Sources"`, canvas `role="region" aria-label="Canvas"`, inspector `role="region" aria-label="Inspector"`
- Drag-and-drop inside the canvas must provide a keyboard alternative (caller supplies)
- Inspector toggle exposes `aria-expanded` and `aria-controls` referencing the inspector id
- The canvas is the primary scroll container; palette and inspector scroll independently

## Tokens
- Inherits all surface tokens from `Box`, `Grid`, `Card`, `Button`
- Adds (component tier): `--report-builder-palette-width`, `--report-builder-inspector-width`, `--report-builder-toolbar-height`

## Do / Don't
```tsx
// DO
<ReportBuilderLayout
  toolbar={<BuilderToolbar/>}
  palette={<FieldPalette/>}
  canvas={<ReportCanvas/>}
  inspector={<FieldInspector/>}
/>

// DON'T — hand-roll the three-track grid
<div className="builder-grid">…</div>

// DON'T — bespoke palette item surface
<div className="palette-item border">…</div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ReportBuilderLayout.css` (use `Grid` and `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline ▲, ▼, ↑, ↓ glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders palette, canvas, and inspector regions with correct landmarks
- Inspector toggle reflects `aria-expanded` and emits `onInspectorOpenChange`
- Canvas is the primary scroll container
- Composition probes: `Grid` at root; `Box` in each pane; `Card` in palette items
- Forwards ref; spreads remaining props onto root
- axe-core passes with inspector open and closed
