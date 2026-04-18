---
name: Breadcrumbs
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, Text, Icon]
replaces-raw: ["<nav>"]
---

# Breadcrumbs

> A horizontal trail of navigation links showing the user's location within the app's hierarchy, collapsing long paths.

## Purpose
Breadcrumbs is the canonical "where am I" trail rendered above page headers — a compact ordered list of links separated by chevron `Icon`s, with an automatic collapse-into-overflow when the path is too long for the row. By centralizing the separator, the truncation behavior, and the active-segment styling, every page in the product communicates hierarchy the same way and the team can adjust the long-path heuristic in one place.

## When to use
- Above a page header to show the path from the app root to the current page
- Detail pages where the user benefits from jumping to an ancestor in one click
- Apps with deep nesting (org → workspace → project → entity)

## When NOT to use
- The current page is the top-level destination → omit Breadcrumbs entirely
- Sub-views of the current section → use **ContextualSubNav**
- Wayfinding inside a workflow → use **WizardFrame**'s step indicator

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="row" align="center" gap>`    | hand-rolled flex CSS                          |
| Crumb label / link    | `Text size="sm">` (rendered as `a` when `href` present) | raw `<a>` with typography CSS      |
| Separator             | `Icon name="chevron-right" size="sm">`       | text glyph (`/`, `›`) or inline `<svg>`       |
| Overflow trigger      | `Text>` rendering an ellipsis with a Menu/Popover (caller-supplied) | raw `<button>` with inline styles |
| Current crumb         | `Text weight="medium" color="primary">`      | raw `<span>` with typography CSS              |

## API contract
```ts
interface Crumb {
  id: string;
  label: string;
  href?: string;                  // omit on the current crumb
}

interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: Crumb[];                 // ordered root → current
  maxVisible?: number;            // default 4 (root + … + last 2)
  ariaLabel?: string;             // default "Breadcrumb"
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| short           | All crumbs rendered with separator chevrons                           |
| long            | When `items.length > maxVisible`, middle crumbs collapse to ellipsis  |
| current         | Last crumb rendered as text only (no link), `aria-current="page"`     |
| single          | Renders one crumb (no separators)                                     |

## Accessibility
- Root is `<nav>` with `aria-label` (default "Breadcrumb")
- Inner ordered list uses `<ol>` for explicit sequence
- Current crumb carries `aria-current="page"` and is not a link
- Separator `Icon`s are `aria-hidden="true"` (decorative)
- Overflow ellipsis trigger exposes `aria-expanded` and `aria-controls` for its disclosed list

## Tokens
- Inherits Text and Icon tokens
- Adds (component tier): `--breadcrumbs-gap`, `--breadcrumbs-separator-color`, `--breadcrumbs-overflow-min-width`

## Do / Don't
```tsx
// DO
<Breadcrumbs items={[
  { id: "home", label: "Workspaces", href: "/" },
  { id: "ws", label: "Acme", href: "/acme" },
  { id: "proj", label: "Q3 Plan" },
]} />

// DON'T — text separators
<nav>Workspaces / Acme / Q3 Plan</nav>

// DON'T — render the current crumb as a link
<a href="/acme/q3" aria-current="page">Q3 Plan</a>

// DON'T — inline svg chevron
<span><svg>…</svg></span>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `Breadcrumbs.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs (separator must use `Icon`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Root is `<nav>` with `aria-label="Breadcrumb"` and contains an `<ol>`
- Last crumb has `aria-current="page"` and renders no link
- When `items.length > maxVisible`, middle items collapse to a single ellipsis trigger
- Separator `Icon`s render between every pair and are `aria-hidden`
- Single-item input renders without any separator
- Composition probes: `Box` is the layout; `Text` renders crumbs; `Icon` renders separators
- Forwards ref; spreads remaining props onto root
- axe-core passes for short, long, and single-item inputs
