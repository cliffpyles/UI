---
name: MultiPanelWorkspace
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, ResizablePanel]
replaces-raw: []
---

# MultiPanelWorkspace

> An IDE-style workspace of two or more resizable panels with persistable splits.

## Purpose
MultiPanelWorkspace is the canonical layout for power-user surfaces that need to display several views simultaneously and let the user rebalance the splits — query editors, log explorers, schema browsers, drill-down debuggers. It composes `ResizablePanel` for each split so resize handles, min/max constraints, keyboard nudges, and persisted sizes all behave identically across the product.

## When to use
- An IDE, query editor, or debugger surface with multiple co-equal views
- A primary/detail layout where the detail width must be user-controlled
- Any tool where the user needs to redistribute screen real estate per task

## When NOT to use
- A simple primary view + collapsible secondary nav → use **AppShell** or **SettingsFrame**
- A map with one persistent data panel → use **MapLayout**
- Comparing N peer entities side-by-side with synchronized scroll → use **ComparisonLayout**

## Composition (required)
| Concern              | Use                                  | Never                                  |
|----------------------|--------------------------------------|----------------------------------------|
| Frame layout         | `Box direction="row">` (or column)   | hand-rolled flex CSS                   |
| Split surfaces       | `ResizablePanel>`                    | hand-rolled drag handles               |
| Panel content wrapper| `Box>`                               | raw `<div>` with overflow CSS          |

## API contract
```ts
interface PanelSpec {
  id: string;
  defaultSize: number;             // 0..1 fraction
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  content: ReactNode;
}

interface MultiPanelWorkspaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";    // default "row"
  panels: PanelSpec[];             // 2 or more
  storageKey?: string;             // when provided, sizes persist
  onSizesChange?: (sizes: Record<string, number>) => void;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                       |
|----------------|----------------------------------------------------------------|
| default        | Panels render at `defaultSize`; resize handles between each    |
| dragging       | Pointer drag updates split sizes; respects min/max             |
| keyboard-resize| Arrow keys on a focused handle nudge by a token-defined step   |
| collapsed      | Panel marked `collapsible` and dragged to min collapses to 0   |
| persisted      | When `storageKey` set, sizes restore on mount                  |

## Accessibility
- Root carries `role="group"` with `aria-label="Workspace"`
- Each resize handle carries `role="separator"`, `aria-orientation`, and `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
- Handles are focusable; ArrowLeft/ArrowRight (or Up/Down) adjust split
- Each panel is a region with its own accessible name

## Tokens
- Inherits all surface tokens from `Box` and `ResizablePanel`
- Adds (component tier): `--multi-panel-workspace-handle-thickness`, `--multi-panel-workspace-keyboard-step`

## Do / Don't
```tsx
// DO
<MultiPanelWorkspace
  storageKey="logs.workspace"
  panels={[
    { id: "filters", defaultSize: 0.2, content: <FilterTree/> },
    { id: "results", defaultSize: 0.5, content: <LogList/> },
    { id: "detail",  defaultSize: 0.3, content: <LogDetail/> },
  ]}
/>

// DON'T — hand-roll resize handles
<div className="split" onMouseDown={beginDrag}/>

// DON'T — single-panel use case
<MultiPanelWorkspace panels={[{ id: "only", defaultSize: 1, content: <X/> }]}/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `MultiPanelWorkspace.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one `ResizablePanel` per entry in `panels`
- Drag of a handle updates panel sizes and emits `onSizesChange`
- Arrow-key on focused handle adjusts sizes by the keyboard step
- `storageKey` round-trips sizes through storage on remount
- Composition probes: `Box` at root; `ResizablePanel` for each panel
- Forwards ref; spreads remaining props onto root
- axe-core passes with 2 and 3 panels
