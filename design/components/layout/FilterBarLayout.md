---
name: FilterBarLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [filtering-and-search]
uses: [Box, FilterChip, Button]
replaces-raw: []
---

# FilterBarLayout

> A horizontal, scrollable strip of active-filter chips that sits directly above a data region.

## Purpose
FilterBarLayout owns the chrome that makes the current filter set always visible above tables, charts, and lists. It centralizes the chip row layout, the overflow scroll behavior, the Add-filter affordance, the Clear-all action, and the count-of-results summary slot. Callers think only about the filter model; the layout owns horizontal rhythm, focus order, and scroll behavior.

## When to use
- Above a primary data region whose state must explain itself ("you are seeing N rows because…")
- Pairing with a separate filter editor (popover, drawer, or modal) that produces chips
- Surfaces where users add/remove filters frequently and want one-glance visibility

## When NOT to use
- Sidebar-style faceted refinement — use **FacetedSearchLayout**
- Free-form, nested expressions — use **QueryBuilderLayout**
- A single search box — use **SearchInput** in a toolbar

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box display="flex" align="center">`               | raw `<div>` with flex CSS                   |
| Chip row container   | `Box display="flex" gap wrap="nowrap">`            | hand-rolled flex CSS                        |
| Filter chip          | `FilterChip` (one per active filter)               | raw `<span>` with chip CSS                  |
| Add-filter affordance| `Button variant="ghost" size="sm">` + `Icon`       | raw `<button>` with inline `<svg>`          |
| Clear-all affordance | `Button variant="ghost" size="sm">`                | raw `<button>`                              |
| Result-count summary | `Box>` (text content slotted by caller)            | raw `<div>` with typography CSS             |

The chip row scrolls horizontally on overflow; the scroll behavior is driven by tokens, not hardcoded sizes.

## API contract
```ts
interface FilterBarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  filters: ReactNode;                       // caller supplies the FilterChips
  onAddFilter?: () => void;
  onClearAll?: () => void;
  addFilterLabel?: string;                  // default "Add filter"
  clearAllLabel?: string;                   // default "Clear all"
  summary?: ReactNode;                      // e.g. "1,204 results"
  sticky?: boolean;                         // default false
}
```

## Required states
| State            | Behavior                                                                      |
|------------------|-------------------------------------------------------------------------------|
| default          | Chips render left-to-right; Add-filter at the end of the row                  |
| empty            | Only the Add-filter Button renders; Clear-all hidden                          |
| overflow         | Row becomes horizontally scrollable; focus on a hidden chip auto-scrolls it in |
| sticky           | `sticky === true` → the bar pins to the top of its scroll container           |
| with-summary     | Summary slot renders right-aligned; collapses below at narrow widths          |

## Accessibility
- Root renders as `<div role="region">` with `aria-label="Active filters"` so it is announced as a discrete region.
- Chip row uses `role="list"`, each `FilterChip` is a `role="listitem"`.
- Add-filter and Clear-all are real `Button`s; both expose visible labels in addition to any icon.
- Horizontal scrolling is keyboard-reachable: Tab order traverses all chips even when scrolled out of view.

## Tokens
- Bar height & padding: `--filter-bar-height`, `--filter-bar-padding-{x|y}`
- Chip gap: `--filter-bar-chip-gap`
- Sticky offset: `--filter-bar-sticky-top`, `--z-sticky`
- Surface inherited from `Box`

## Do / Don't
```tsx
// DO
<FilterBarLayout
  filters={chips}
  onAddFilter={openPicker}
  onClearAll={clear}
  summary={<ResultCount value={1204}/>}
/>

// DON'T — raw chips
<div className="bar">
  <span className="chip">Status: open</span>
</div>

// DON'T — raw add button with inline svg
<button onClick={open}><svg>…</svg> Add</button>
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
- Each child filter renders inside the chip row in the supplied order
- `onAddFilter` and `onClearAll` are wired to the corresponding `Button`s
- Empty filter set hides Clear-all but still renders Add-filter
- Overflow row is horizontally scrollable; tabbing to an off-screen chip scrolls it into view
- `sticky={true}` applies the sticky token treatment
- Composition probe: at least one `FilterChip` and one `Button` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with chips, summary, and both action buttons
