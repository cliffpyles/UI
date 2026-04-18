---
name: Grid
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["unstyled <div> with display: grid", "<section>/<article>/<ul>/<ol>/<dl> used as grid containers"]
---

# Grid

> The generic CSS Grid primitive — token-driven gaps, padding, columns/rows, and template areas.

## Purpose
Grid covers two-dimensional layout when a flex Box is insufficient. It exposes only the grid concerns that compose cleanly with the token scale, keeping per-component CSS empty of grid wiring.

## When to use
- Multi-column layouts with shared track sizing
- Named-area page scaffolds (template areas)
- Lists rendered as `<ul>`/`<ol>`/`<dl>` with grid placement

## When NOT to use
- One-dimensional flex stacks → use **Box**
- Tabular data with semantics → use raw `<table>` (or future DataTable)
- A page-level layout with sidebars/header slots → use a Layout component (Level 6)

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<div>` / list / landmark | inline-styled `<div style="display:grid">` |
| Track sizing    | `columns={N}` shorthand or string   | inline `gridTemplateColumns` style |

## API contract
```ts
type GridElement =
  | "div" | "section" | "article" | "aside"
  | "main" | "nav" | "header" | "footer"
  | "ul" | "ol" | "dl";

type SpacingToken =
  | "0" | "px" | "0.5" | "1" | "1.5" | "2" | "2.5"
  | "3" | "3.5" | "4" | "5" | "6" | "7" | "8"
  | "10" | "12" | "14" | "16" | "20" | "24" | "32"
  | "content" | "section" | "inline" | "page";

interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: GridElement;
  columns?: string | number;        // N → repeat(N, minmax(0, 1fr))
  rows?: string | number;
  gap?: SpacingToken;
  columnGap?: SpacingToken;
  rowGap?: SpacingToken;
  autoFlow?: "row" | "column" | "row dense" | "column dense";
  templateAreas?: string | string[];
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
}
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | `display: grid` always; columns/rows/areas applied via inline style   |

## Accessibility
- `as` must match the semantics of the content (e.g. lists use `ul`/`ol`).
- Non-interactive — like Box, must not receive `onClick`.

## Tokens
- Spacing (gap/padding): `--spacing-{0|px|0-5|1|1-5|2|2-5|3|3-5|4|5|6|7|8|10|12|14|16|20|24|32}`
- Semantic spacing: `--spacing-content-gap`, `--spacing-section-gap`, `--spacing-inline-gap`, `--spacing-page-padding`

## Do / Don't
```tsx
// DO
<Grid columns={3} gap="content" />

// DO — named areas
<Grid templateAreas={["header header", "side main"]} columns="200px 1fr" />

// DON'T — inline grid CSS
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` handlers on Grid
- Hardcoded color, spacing, radius
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders each `as` element correctly
- `columns={N}` expands to `repeat(N, minmax(0, 1fr))`
- `templateAreas` array is joined into quoted-row CSS string
- Each spacing prop emits the correct `var(--spacing-…)`
- Forwards ref; spreads remaining props
- axe-core passes
