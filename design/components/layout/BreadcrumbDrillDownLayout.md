---
name: BreadcrumbDrillDownLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Breadcrumbs]
replaces-raw: []
---

# BreadcrumbDrillDownLayout

> A page frame whose breadcrumb trail preserves filter, scroll, and selection state at each level of a drill-down.

## Purpose
BreadcrumbDrillDownLayout owns the chrome for hierarchical exploration where users dive into successive levels of detail (Org → Team → Project → Run) and expect to return to any level with their prior context intact. It centralizes breadcrumb placement, the navigation API for pushing/popping levels, and the contract that each level supplies its own snapshot of state to be restored on return. Callers supply level renderers and the level model; the layout owns the frame, the trail, and state restoration hooks.

## When to use
- Multi-level drill-downs where each level deserves a labelled crumb
- Surfaces where users compare deep records and need to bounce back without losing filter state
- Any flow where browser-back is too coarse a UX (you want labelled, jumpable history)

## When NOT to use
- Single-page detail views — use **EntityDetailLayout**
- Fixed three-pane navigation — use **MasterDetailLayout**
- A tree on the side that drives main content — use **HierarchicalTreeLayout**

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box as="main" display="flex" direction="column">` | raw `<main>` with flex CSS                  |
| Breadcrumb trail     | `Breadcrumbs`                                      | raw `<nav>` with `<a>` chain                |
| Header strip         | `Box display="flex" justify="between" align="center">` | hand-rolled flex CSS                    |
| Level body           | `Box>` (level content slotted by caller)           | raw `<section>` with padding CSS            |
| Level stack rhythm   | `Box gap>`                                         | margin between sections in stylesheet       |

The layout exposes a `levels` stack; each entry has an `id`, `label`, `render`, and an opaque `state` snapshot. Pushing a level renders a new body and appends a crumb; clicking a crumb pops to that level and rehydrates its state.

## API contract
```ts
interface DrillLevel<S = unknown> {
  id: string;
  label: string;
  render: (state: S | undefined) => ReactNode;
  state?: S;
}

interface BreadcrumbDrillDownLayoutProps extends HTMLAttributes<HTMLElement> {
  levels: DrillLevel[];
  onNavigateTo?: (id: string) => void;       // user clicked a crumb
  onPush?: (level: DrillLevel) => void;
  onPop?: () => void;
  toolbar?: ReactNode;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| root         | `levels.length === 1` → only one crumb, no back affordance                |
| nested       | `levels.length > 1` → all crumbs render; current is non-link              |
| navigating   | A crumb click fires `onNavigateTo` and the layout truncates the stack     |
| restored     | Returning to a level rehydrates its `state` via the level's `render(state)` |
| keyboard     | Backspace at the top of the body region pops one level (when focus allows) |

## Accessibility
- Root is `<main>` (page landmark).
- Breadcrumb trail is `<nav aria-label="Breadcrumb">` (delegated to `Breadcrumbs`).
- Current crumb is announced via `aria-current="page"`.
- Level changes update the page title via the host application; the layout exposes the current level's label as `data-current-level`.

## Tokens
- Header padding: `--drill-header-padding-{x|y}`
- Body gap: `--drill-body-gap`
- Surface inherited from `Box` / `Breadcrumbs`

## Do / Don't
```tsx
// DO
<BreadcrumbDrillDownLayout
  levels={stack}
  onNavigateTo={popTo}
  toolbar={<DrillToolbar/>}
/>

// DON'T — hand-rolled crumb chain
<nav>
  <a href="/orgs/1">Acme</a> / <a href="/orgs/1/teams/2">Eng</a> / Run #42
</nav>

// DON'T — drop and reset state on every navigation
onNavigateTo={(id) => resetEverything(id)}
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
- Renders one breadcrumb item per level via `Breadcrumbs`
- Clicking a non-current crumb fires `onNavigateTo` with that level's id
- Pushing a level appends a crumb and renders the new body via `level.render(state)`
- Returning to a previous level invokes `render` with the previously supplied `state`
- Composition probe: `Breadcrumbs` and the column `Box` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with a multi-level stack
