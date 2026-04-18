---
name: GlobalSearchLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [filtering-and-search]
uses: [Box, Modal, SearchInput, Tabs, EntityLink]
replaces-raw: []
---

# GlobalSearchLayout

> A full-page or modal search surface that returns categorized results and lets the user jump directly to any entity.

## Purpose
GlobalSearchLayout owns the chrome of an app-wide search experience: the top-of-surface input, the categorized result tabs (Pages / Documents / People / etc.), the keyboard-navigable result list, and the focus model when the search is opened from a global trigger. It centralizes overlay behavior so callers only think about queries, categories, and result rendering.

## When to use
- A command-palette-style search reachable from anywhere in the app
- Cross-entity lookup where results are heterogeneous and need grouping
- A dedicated `/search` page that mirrors the same modal experience

## When NOT to use
- A search scoped to a single list — use **SearchInput** inline above the list
- A facet-driven catalog — use **FacetedSearchLayout**
- An action launcher with no entity results — use a dedicated command palette

## Composition (required)
| Concern              | Use                                                  | Never                                       |
|----------------------|------------------------------------------------------|---------------------------------------------|
| Frame layout (modal) | `Modal size="lg">` wrapping the surface              | raw `<dialog>`                              |
| Frame layout (page)  | `Box as="main" display="flex" direction="column">`   | raw `<main>` with flex CSS                  |
| Search input         | `SearchInput`                                        | raw `<input type="search">`                 |
| Category nav         | `Tabs` with `Tabs.List` of categories                | hand-rolled tablist                         |
| Result list          | `Box as="ul">`                                       | raw `<ul>` with list CSS                    |
| Result row link      | `EntityLink`                                         | raw `<a>` with entity CSS                   |
| Section gap          | `Box gap>`                                           | margin between sections in stylesheet       |

When opened as an overlay, the surface is wrapped in `Modal`; when opened as a route, the same composition renders inside a `Box as="main">`.

## API contract
```ts
interface SearchCategory {
  id: string;
  label: string;
  count?: number;
  results: ReactNode;                   // caller renders a list of EntityLinks
}

interface GlobalSearchLayoutProps extends HTMLAttributes<HTMLDivElement> {
  query: string;
  onQueryChange: (next: string) => void;
  categories: SearchCategory[];
  activeCategoryId?: string;
  onActiveCategoryChange?: (id: string) => void;
  loading?: boolean;
  emptyState?: ReactNode;
  presentation?: "modal" | "page";      // default "modal"
  open?: boolean;                       // required when presentation === "modal"
  onOpenChange?: (open: boolean) => void;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| closed       | `presentation="modal"` and `open === false` → returns null                |
| opening      | Focus moves to the `SearchInput` on mount                                 |
| typing       | `onQueryChange` fires; result rendering delegated to caller               |
| loading      | Result region exposes `aria-busy="true"`; caller may render its own skeletons |
| empty        | `categories` produce zero rows → renders the `emptyState` slot            |
| navigating   | ArrowDown/Up move focus among result `EntityLink`s; Enter activates       |
| escape       | Esc closes the modal (delegated to `Modal`)                               |

## Accessibility
- Root in modal mode is `role="dialog"` (delegated to `Modal`); in page mode is `role="main"`.
- The search input owns `role="combobox"` semantics with `aria-controls` pointing at the result list and `aria-expanded` reflecting result presence.
- Result list is `role="listbox"` and rows are `role="option"`; focus is virtual via `aria-activedescendant`.
- Category `Tabs` provide `tablist`/`tab`/`tabpanel` roles (delegated to `Tabs`).

## Tokens
- Surface inherited from `Modal` / `Box`
- Search input area: `--global-search-input-padding-{x|y}`
- Result row: `--global-search-row-padding-{x|y}`, `--global-search-row-gap`
- Active row: `--color-surface-selected`

## Do / Don't
```tsx
// DO
<GlobalSearchLayout
  presentation="modal"
  open={open}
  onOpenChange={setOpen}
  query={q}
  onQueryChange={setQ}
  categories={cats}
/>

// DON'T — raw input + dialog
<dialog open><input type="search"/></dialog>

// DON'T — raw anchor for results
<a href={`/users/${id}`}>{name}</a>
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
- `presentation="modal"` + `open={false}` renders nothing
- Focus moves to the `SearchInput` on open
- ArrowDown/Up move focus among result rows; Enter activates the focused row
- Switching `activeCategoryId` swaps the visible result panel via `Tabs`
- Empty state renders when no category produces rows
- Composition probe: `SearchInput`, `Tabs`, and at least one `EntityLink` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes in open and empty states
