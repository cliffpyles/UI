---
name: FacetedSearchLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [filtering-and-search]
uses: [Grid, Box, ResizablePanel, FilterChip, Checkbox]
replaces-raw: []
---

# FacetedSearchLayout

> A two-track page frame with a resizable facets sidebar on the left and a results region on the right.

## Purpose
FacetedSearchLayout owns the page-level frame for catalog and library experiences — log search, asset libraries, ticket queues — where the user narrows a large result set by toggling categorical facets. It centralizes the sidebar/main split, the responsive collapse of the facets rail, the persistence of the rail width, and the wiring of an active-filter chip strip above the results so the current selection is always visible.

## When to use
- A searchable collection where filters are categorical and many at once
- Lists where users repeatedly refine via checkboxes, ranges, or pickers
- Catalogs that benefit from scannable, always-visible filter state

## When NOT to use
- A single search box returning one homogeneous list — use **GlobalSearchLayout**
- A free-form expression-based filter — use **QueryBuilderLayout**
- A drill-down into a single record — use **EntityDetailLayout** or **MasterDetailLayout**

## Composition (required)
| Concern              | Use                                                        | Never                                       |
|----------------------|------------------------------------------------------------|---------------------------------------------|
| Frame layout         | `Grid` with named tracks `facets main` (sidebar/main)      | raw CSS Grid in stylesheet                  |
| Resizable sidebar    | `ResizablePanel` wrapping the facets rail                  | hand-rolled drag handle                     |
| Facets rail          | `Box as="aside" display="flex" direction="column">`        | raw `<aside>` with flex CSS                 |
| Facet group stack    | `Box gap>`                                                 | margin between groups in stylesheet         |
| Facet option control | `Checkbox` (one per option)                                | raw `<input type="checkbox">`               |
| Active filter strip  | `Box display="flex" wrap="wrap">` of `FilterChip`s         | raw `<div>` of styled spans                 |
| Results region       | `Box as="section">`                                        | raw `<section>` with padding CSS            |

## API contract
```ts
interface FacetedSearchLayoutProps extends HTMLAttributes<HTMLDivElement> {
  facets: ReactNode;                  // caller supplies the facet groups (Checkboxes etc.)
  activeFilters: ReactNode;           // caller supplies a node of FilterChips
  results: ReactNode;
  toolbar?: ReactNode;                // sort/density/export controls above results
  defaultSidebarWidth?: number;       // px; persisted by ResizablePanel
  collapsible?: boolean;              // default true
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}
```

## Required states
| State        | Behavior                                                                          |
|--------------|-----------------------------------------------------------------------------------|
| default      | Facets rail visible, results render in main; chip strip above results             |
| collapsed    | Facets rail hidden; a Show-filters affordance is exposed in the toolbar slot      |
| narrow       | At a token-defined breakpoint, rail auto-collapses behind a disclosure            |
| no-filters   | When `activeFilters` is empty, the chip strip collapses and reserves no height    |
| no-results   | Results region delegates empty rendering to caller (caller uses `EmptyState`)     |

## Accessibility
- Frame root uses `role="search"` so the screen reader announces the page as a search landmark.
- Facets rail renders as `<aside>` with `aria-label="Filters"`.
- Results region renders as `<section>` with `aria-label="Results"` and `aria-live="polite"` for the result count.
- Resize handle is keyboard-operable and exposes `role="separator"` with `aria-orientation="vertical"` (delegated to `ResizablePanel`).

## Tokens
- Frame: `--faceted-rail-width-default`, `--faceted-rail-width-min`, `--faceted-gap`
- Surface inherited from `Box` / `Grid`
- Active chip strip: `--faceted-chip-strip-padding-{x|y}`
- Breakpoint for auto-collapse: `--breakpoint-md`

## Do / Don't
```tsx
// DO
<FacetedSearchLayout
  facets={<FacetGroups/>}
  activeFilters={chips}
  results={<ResultsTable/>}
  toolbar={<ResultsToolbar/>}
/>

// DON'T — hand-rolled grid
<div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>{…}</div>

// DON'T — raw checkboxes for facet options
<input type="checkbox" /> Active
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
- Renders the facets rail, chip strip, and results region in the named-track positions
- `collapsed={true}` hides the rail and exposes a disclosure affordance
- `activeFilters` of zero renders no chip strip height
- Resize handle is reachable via Tab and movable via ArrowLeft/Right
- Composition probe: `Grid`, `ResizablePanel`, at least one `FilterChip` and `Checkbox` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with sample facets, chips, and results
