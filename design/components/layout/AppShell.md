---
name: AppShell
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box]
replaces-raw: []
---

# AppShell

> The top-level application frame: fixed header, collapsible sidebar, and a single scrollable main region.

## Purpose
AppShell owns the persistent chrome that wraps every signed-in screen — the brand/header bar, the primary navigation rail, and the content viewport beneath them. By centralizing landmark roles, scroll containment, and the collapse behavior of the sidebar, every product surface inherits identical navigation ergonomics and accessibility wiring without rebuilding the frame.

## When to use
- The default frame for any authenticated, multi-page application surface
- Screens that need persistent global navigation alongside per-page content
- Apps where the header must stay fixed while only the main region scrolls

## When NOT to use
- A focused, chromeless workflow → use **FullViewportCanvas**
- A linear step-by-step task with no nav → use **WizardFrame**
- A settings sub-area with its own vertical nav → use **SettingsFrame** inside the AppShell main slot

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Grid` with named tracks `header`/`sidebar`/`main` | hand-rolled `display: grid` in CSS      |
| Header content row    | `Box direction="row" align="center" gap>`    | hand-rolled flex CSS                          |
| Sidebar content stack | `Box direction="column" gap>`                | hand-rolled flex CSS                          |
| Main content wrapper  | `Box>` (scroll container)                    | raw `<div>` with overflow CSS                 |
| Sidebar collapse trigger | `Button variant="ghost"` + `Icon>`        | raw `<button>` with inline `<svg>`            |

## API contract
```ts
type SidebarState = "expanded" | "collapsed";

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;             // main content
  sidebarState?: SidebarState;     // controlled
  defaultSidebarState?: SidebarState; // uncontrolled, default "expanded"
  onSidebarStateChange?: (state: SidebarState) => void;
  footer?: ReactNode;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State       | Behavior                                                              |
|-------------|-----------------------------------------------------------------------|
| default     | Header pinned; sidebar expanded; main scrolls independently           |
| collapsed   | Sidebar narrows to icon rail; main expands to fill freed track        |
| no-footer   | When `footer` is omitted, footer track collapses                       |
| narrow viewport | Sidebar is hidden behind a disclosure trigger in the header        |

## Accessibility
- Header element carries `role="banner"`
- Sidebar element carries `role="navigation"` with `aria-label="Primary"`
- Main element carries `role="main"` and is the single scroll container
- Sidebar collapse trigger exposes `aria-expanded` and `aria-controls` referencing the sidebar id
- Skip-link to main content is provided as the first focusable element

## Tokens
- Inherits all surface tokens from `Box` and `Grid`
- Adds (component tier): `--app-shell-header-height`, `--app-shell-sidebar-width-expanded`, `--app-shell-sidebar-width-collapsed`, `--app-shell-footer-height`
- Z-index: `--z-app-header`

## Do / Don't
```tsx
// DO
<AppShell header={<TopBar/>} sidebar={<PrimaryNav/>} footer={<StatusBar/>}>
  <RouteOutlet />
</AppShell>

// DON'T — hand-roll the frame
<div className="grid"><header/><nav/><main/></div>

// DON'T — collapse sidebar with raw button + svg
<button onClick={toggle}><svg>…</svg></button>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `AppShell.css` (use `Grid` and `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders banner, navigation, and main landmarks
- Sidebar collapse trigger toggles `sidebarState` and emits `onSidebarStateChange`
- `aria-expanded` on the trigger reflects current state
- Skip-link moves focus to main on activation
- Main region is the scroll container (header stays pinned)
- Composition probes: `Grid` resolves at the root; `Box` resolves inside header/sidebar/main
- Forwards ref; spreads remaining props onto root
- axe-core passes in expanded and collapsed states
