---
name: ComparisonLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Card]
replaces-raw: []
---

# ComparisonLayout

> Two or more entities placed side-by-side as parallel columns with synchronized vertical scroll.

## Purpose
ComparisonLayout is the standard surface for A/B/N comparison views — pricing plans, candidate diffs, environment configurations, releases. It owns the equal-width column tracks, the per-column `Card` surface, and the synchronized scroll behavior so the same row of attributes always lines up across columns and the user can scan horizontally without losing their vertical position.

## When to use
- Side-by-side comparison of 2-N peer entities with the same attribute schema
- Pricing or plan comparison
- Diff-style configuration or release comparison

## When NOT to use
- Editing two panels independently → use **MultiPanelWorkspace**
- A pivot table of values across two dimensions → use **PivotLayout**
- One primary + one supporting view → use a primary/detail pattern inside `AppShell`

## Composition (required)
| Concern             | Use                                          | Never                                  |
|---------------------|----------------------------------------------|----------------------------------------|
| Frame layout        | `Grid` (equal-width column tracks)           | hand-rolled `display: grid`            |
| Per-column surface  | `Card>`                                       | raw `<div>` with surface CSS           |
| Per-column content  | `Box direction="column" gap>`                | hand-rolled flex CSS                   |
| Optional shared header row | `Box direction="row">`                | hand-rolled flex CSS                   |

## API contract
```ts
interface ComparisonColumn {
  id: string;
  header: ReactNode;
  highlight?: boolean;             // visually emphasized column
  content: ReactNode;
}

interface ComparisonLayoutProps extends HTMLAttributes<HTMLDivElement> {
  columns: ComparisonColumn[];     // 2 or more
  syncScroll?: boolean;            // default true; vertical scroll syncs across columns
  stickyHeaders?: boolean;         // default true
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Equal-width columns; headers sticky at top; vertical scroll syncs     |
| highlighted    | A column with `highlight` receives an emphasized `Card` variant       |
| narrow viewport| Columns stack vertically; sync-scroll disabled                        |
| no-sync        | Columns scroll independently when `syncScroll === false`              |

## Accessibility
- Root carries `role="group"` with `aria-label="Comparison"`
- Each column is a region whose accessible name comes from its `header`
- Sticky headers maintain semantic heading order
- Sync-scroll never traps the keyboard; arrow keys behave normally inside each column

## Tokens
- Inherits all tokens from `Grid`, `Box`, `Card`
- Adds (component tier): `--comparison-layout-column-gap`, `--comparison-layout-min-column-width`, `--comparison-layout-header-offset`

## Do / Don't
```tsx
// DO
<ComparisonLayout columns={[
  { id: "starter", header: <Text as="h3">Starter</Text>, content: <PlanFeatures plan="starter"/> },
  { id: "pro",     header: <Text as="h3">Pro</Text>, highlight: true, content: <PlanFeatures plan="pro"/> },
]}/>

// DON'T — different markup per column
<div className="cols"><div>{a}</div><section>{b}</section></div>

// DON'T — render headers with raw <h3>
columns={[{ id: "x", header: <h3>X</h3>, content: ... }]}
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ComparisonLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders one column per entry; equal track widths
- Highlighted column receives the emphasized `Card` variant
- Vertical scroll in one column scrolls the others when `syncScroll`
- Sync disabled when `syncScroll === false`
- Composition probes: `Grid` at root; `Card` per column
- Forwards ref; spreads remaining props onto root
- axe-core passes with 2 and 3 columns
