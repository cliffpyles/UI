---
name: SettingsFrame
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box]
replaces-raw: []
---

# SettingsFrame

> A two-column frame with a persistent vertical navigation sidebar and a scrollable content pane for settings/preferences screens.

## Purpose
SettingsFrame is the standard layout for any "preferences"-style sub-area: account, billing, integrations, organization settings. It owns the sidebar/main split, the sticky-on-scroll behavior of the nav, and the consistent inner padding so every settings surface in the product feels like a single coherent area regardless of which team built it.

## When to use
- Account, organization, or workspace settings sub-area
- Any multi-section preferences surface with a stable left-hand index
- Documentation or help-center style nested-section pages

## When NOT to use
- A top-level application shell with global nav → use **AppShell** (and place SettingsFrame inside it)
- A linear flow → use **WizardFrame**
- A widget canvas → use **DashboardFrame**

## Composition (required)
| Concern               | Use                                          | Never                                  |
|-----------------------|----------------------------------------------|----------------------------------------|
| Frame layout          | `Grid` with named tracks `sidebar`/`main`    | hand-rolled `display: grid`            |
| Sidebar content stack | `Box direction="column" gap>`                | hand-rolled flex CSS                   |
| Main content wrapper  | `Box direction="column" gap>` (scroll container) | raw `<div>` with overflow CSS      |
| Optional title row    | `Box direction="row" justify="between">`     | hand-rolled flex CSS                   |

## API contract
```ts
interface SettingsFrameProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;              // typically a list of nav links
  title?: ReactNode;
  actions?: ReactNode;             // right-aligned actions next to title
  children: ReactNode;             // main content
  sidebarWidth?: "narrow" | "default" | "wide"; // default "default"
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Two-column grid; sidebar sticky; main scrolls independently            |
| no-title       | Title row collapses; main begins at the top of its track              |
| narrow viewport| Sidebar collapses above main as a horizontal section nav              |

## Accessibility
- Sidebar carries `role="navigation"` with `aria-label="Settings"`
- Main carries `role="main"` (or `role="region"` with `aria-label` if nested under another `main`)
- Active sidebar item exposes `aria-current="page"`
- Title (when present) is a single `h1`/`h2` rendered via `Text` and is the labelled-by target for main

## Tokens
- Inherits all surface tokens from `Box` and `Grid`
- Adds (component tier): `--settings-frame-sidebar-width-{narrow|default|wide}`, `--settings-frame-content-max-width`, `--settings-frame-padding`

## Do / Don't
```tsx
// DO
<SettingsFrame
  sidebar={<SettingsNav/>}
  title={<Text as="h1" size="xl">Account</Text>}
  actions={<Button>Save</Button>}
>
  <SettingsSection .../>
</SettingsFrame>

// DON'T — hand-roll the two-column grid
<div className="settings"><nav/><main/></div>

// DON'T — render the page title with a raw <h1>
<SettingsFrame title={<h1>Account</h1>} .../>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `SettingsFrame.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders navigation and main landmarks
- Sidebar stays in view while main scrolls
- Title and actions render only when provided
- `sidebarWidth` switches the sidebar track to the corresponding token
- Composition probes: `Grid` at root; `Box` inside sidebar and main
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without title/actions
