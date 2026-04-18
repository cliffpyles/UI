---
name: ContextualSubNav
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, Tabs]
replaces-raw: ["<nav>"]
---

# ContextualSubNav

> A horizontal secondary navigation bar that switches between sub-views of the current section.

## Purpose
ContextualSubNav is the single canonical sub-navigation surface — the row of "Overview / Activity / Settings" tabs that lives directly beneath a page header. It composes over `Tabs` to inherit the keyboard model, ARIA wiring, and active indicator, but presents itself as a `<nav>` landmark because each entry is a navigation destination rather than an in-page panel switch. By owning the sticky behavior, alignment to the page gutter, and overflow handling, every section in the product gets identical sub-nav ergonomics.

## When to use
- Beneath a section/page header to switch among that section's sub-views
- When the destinations correspond to routes (each entry has an `href`)
- When the sub-views are stable and few (≤ ~7)

## When NOT to use
- Top-level primary navigation → use **CollapsibleSidebarNav**
- In-page tabbed panels with no route change → use **Tabs** directly
- Many destinations or hierarchical destinations → use a sidebar

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="row" align="center" justify="between">` | hand-rolled flex CSS              |
| Tab strip             | `Tabs` (with link-style triggers)            | hand-rolled tablist + manual focus model      |
| Trailing actions slot | `Box direction="row" gap>`                   | hand-rolled flex CSS                          |

## API contract
```ts
interface SubNavItem {
  id: string;
  label: string;
  href: string;
  badge?: ReactNode;              // optional Badge or count
  disabled?: boolean;
}

interface ContextualSubNavProps extends HTMLAttributes<HTMLElement> {
  items: SubNavItem[];
  activeId: string;               // route-driven
  ariaLabel: string;              // e.g. "Project subsections"
  trailing?: ReactNode;           // page-level actions (e.g. "New")
  sticky?: boolean;               // default true
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | All items rendered; `activeId` shows active indicator                 |
| with-trailing   | Trailing slot rendered on the row's right edge                        |
| sticky          | Bar remains pinned beneath the header on scroll                       |
| overflow        | When the row is too narrow, items scroll horizontally with focus snap |
| disabled item   | Item is non-interactive and skipped by keyboard navigation            |

## Accessibility
- Root is `<nav>` with the supplied `aria-label`
- Active item carries `aria-current="page"`
- Inherits arrow-key navigation between items from `Tabs`
- Trailing actions remain in document order after the nav

## Tokens
- Inherits Tabs tokens (active indicator, padding, focus ring)
- Adds (component tier): `--contextual-sub-nav-row-height`, `--contextual-sub-nav-gutter`, `--contextual-sub-nav-divider-color`

## Do / Don't
```tsx
// DO
<ContextualSubNav
  ariaLabel="Project subsections"
  items={[{ id: "overview", label: "Overview", href: "/p/1" }, …]}
  activeId="overview"
  trailing={<Button>New</Button>}
/>

// DON'T — replicate Tabs by hand
<nav><a className="tab tab--active">Overview</a>…</nav>

// DON'T — use Tabs without a nav landmark when entries are routes
<Tabs value={routeId}>…</Tabs>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `ContextualSubNav.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Root is `<nav>` with the supplied `aria-label`
- Active item has `aria-current="page"`
- Arrow keys move focus among enabled items (inherited Tabs model)
- Disabled items are skipped by keyboard navigation
- Trailing slot renders on the row when supplied
- Composition probes: `Tabs` resolves inside the nav; `Box` is the layout
- Forwards ref; spreads remaining props onto root
- axe-core passes
