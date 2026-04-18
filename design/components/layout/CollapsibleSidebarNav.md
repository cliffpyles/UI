---
name: CollapsibleSidebarNav
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, Button, Icon, Tooltip, Text]
replaces-raw: ["<nav>"]
---

# CollapsibleSidebarNav

> A vertical primary navigation that collapses to an icon-only rail, supports nested groups, and pins user favorites.

## Purpose
CollapsibleSidebarNav is the canonical primary navigation slot for `AppShell`. It renders a hierarchical list of destinations, supports collapsing to icon-only mode for power-user density, exposes nested groups (with disclosure), and lets the user pin frequently used items to a "Favorites" section. By centralizing the keyboard model, the active-item indication, and the icon-only Tooltip wiring, every product surface gets identical nav ergonomics no matter which routes are mounted into it.

## When to use
- Inside `AppShell.sidebar` for any authenticated screen with multi-page navigation
- Apps where users benefit from collapsing the rail to gain horizontal space
- Navigation hierarchies with two levels (group → item) and a small favorites section

## When NOT to use
- Top-of-page navigation → use **MultiWorkspaceSwitcher** or a header nav
- Section-local sub-tabs → use **ContextualSubNav**
- A flat list of three or fewer destinations → render `Button` links inline

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="column" gap>`                | hand-rolled flex CSS                          |
| Item / group trigger  | `Button variant="ghost">` with leading `Icon`| raw `<button>` with inline `<svg>`            |
| Item label            | `Text size="sm">`                            | raw `<span>` with typography CSS              |
| Collapsed-mode tooltip| `Tooltip` wrapping each icon-only `Button`   | hand-rolled hover popover                     |
| Group disclosure caret| `Icon name="chevron-right">` rotated by state| inline `<svg>` chevron                        |
| Section divider       | `Box>` with token-driven border              | hand-rolled `<hr>` with hex color             |

## API contract
```ts
interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;                // expected to be an <Icon>
  href?: string;
  onSelect?: () => void;
  badge?: ReactNode;              // optional Badge
  children?: NavItem[];           // one nesting level
}

interface CollapsibleSidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: NavItem[];
  favorites?: NavItem[];
  activeId?: string;
  collapsed?: boolean;            // controlled
  defaultCollapsed?: boolean;
  onCollapsedChange?: (next: boolean) => void;
  ariaLabel?: string;             // default "Primary"
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| expanded        | Icon + label rendered per item; nested groups disclose on click       |
| collapsed       | Label hidden; each row becomes an icon `Button` with `Tooltip`        |
| active          | Item with `id === activeId` shows active token + `aria-current="page"`|
| disclosed       | Group with children expanded; caret rotated; children indented        |
| with-favorites  | "Favorites" section rendered above main items with the same item shape|
| empty-favorites | Favorites section omitted entirely                                    |

## Accessibility
- Root element is `<nav>` with `aria-label` (default "Primary")
- Active item carries `aria-current="page"`
- Group triggers expose `aria-expanded` and `aria-controls` referencing the children list
- Collapse toggle exposes `aria-pressed` reflecting collapsed state
- In collapsed mode, the `Tooltip` provides the accessible label that the visible icon alone cannot

## Tokens
- Inherits Button and Icon tokens
- Adds (component tier): `--sidebar-nav-row-padding`, `--sidebar-nav-row-gap`, `--sidebar-nav-active-indicator-width`, `--sidebar-nav-collapsed-row-size`, `--sidebar-nav-section-gap`

## Do / Don't
```tsx
// DO
<CollapsibleSidebarNav
  items={items}
  favorites={pinned}
  activeId={routeId}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
/>

// DON'T — bare anchor list with hand-rolled active style
<nav><a className={isActive ? "on" : ""}>…</a></nav>

// DON'T — raw button + svg per row
<button><svg>…</svg><span>{label}</span></button>

// DON'T — omit Tooltip in collapsed mode
{collapsed && <Button>{icon}</Button>}   // unlabelled in AT
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `CollapsibleSidebarNav.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `<nav>` with the expected `aria-label`
- Active item has `aria-current="page"`
- Collapse toggle changes mode; `onCollapsedChange` fires; `aria-pressed` reflects state
- In collapsed mode, each item is wrapped by a `Tooltip` exposing the label
- Group disclosure toggles `aria-expanded` and reveals/hides children
- Favorites section renders above main items when provided
- Composition probes: `Button` renders triggers; `Icon` resolves per row; `Tooltip` resolves in collapsed mode
- Forwards ref; spreads remaining props onto root
- axe-core passes in expanded and collapsed modes
