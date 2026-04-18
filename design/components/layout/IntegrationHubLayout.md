---
name: IntegrationHubLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Grid, Box, Card, Tabs]
replaces-raw: []
---

# IntegrationHubLayout

> A category-tabbed catalog of available integrations rendered as a responsive card grid with per-tile status and a configuration drawer.

## Purpose
Integration directories converge on the same pattern: tabs to browse categories (data sources, identity, messaging, etc.), a responsive grid of integration tiles with connection status, and a side panel for configuring the selected integration. IntegrationHubLayout owns that frame so every product's integration page has the same structure and the same wiring between the catalog and the inspector.

## When to use
- The "Integrations" admin section of a product
- Any catalog of installable/connectable third-party services with on/off and configuration states
- Surfaces that combine a browseable tile grid with a per-selection side panel

## When NOT to use
- A single integration's setup wizard → use a dedicated wizard or `Modal`
- A list of all webhooks → use **DataTable**
- An API key admin surface → use **APIKeyManagementLayout**

## Composition (required)
| Concern             | Use                                                            | Never                                       |
|---------------------|----------------------------------------------------------------|---------------------------------------------|
| Frame layout        | `Grid` with named tracks `catalog`/`inspector`                 | hand-rolled `display: grid` in CSS          |
| Catalog grid        | `Grid` (multi-column responsive)                               | hand-rolled grid CSS                        |
| Category switcher   | `Tabs`                                                         | hand-rolled tablist                         |
| Integration tile    | `Card`                                                         | raw `<div>` with border CSS                 |
| Tile inner stack    | `Box direction="column" gap>`                                  | hand-rolled flex CSS                        |
| Inspector stack     | `Box direction="column" gap>`                                  | hand-rolled flex CSS                        |

## API contract
```ts
type IntegrationStatus = "connected" | "disconnected" | "error" | "pending";

interface IntegrationTile {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  description?: string;
}

interface IntegrationHubLayoutProps extends HTMLAttributes<HTMLDivElement> {
  integrations: IntegrationTile[];
  categories: Array<{ id: string; label: string }>;
  activeCategory?: string;            // controlled
  defaultActiveCategory?: string;     // uncontrolled
  onActiveCategoryChange?: (id: string) => void;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  inspector?: ReactNode;              // panel content when something is selected
  loading?: boolean;
  error?: Error | null;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| default        | Catalog grid renders all tiles in the active category                 |
| selected       | Inspector pane renders `inspector` for the selected tile              |
| no-selection   | Inspector pane collapses; catalog occupies the freed track            |
| loading        | Catalog grid renders skeleton tiles                                   |
| empty-category | Active category has no tiles → renders an empty message inside the catalog grid |
| error          | Catalog renders an error affordance (caller-provided messaging)        |

## Accessibility
- `Tabs` provides `tablist`/`tab`/`tabpanel` wiring for category browsing
- Each tile is a focusable `Card` button (uses the `Card` interactive variant) with an accessible name combining integration name and status
- Inspector pane carries `role="region"` with `aria-label="Integration details"`
- Status indicator inside each tile must convey state with text, not color alone

## Tokens
- Inherits all tokens from `Box`, `Grid`, `Card`, `Tabs`
- Adds (component tier): `--integration-hub-tile-min-width`, `--integration-hub-inspector-width`

## Do / Don't
```tsx
// DO
<IntegrationHubLayout
  integrations={items}
  categories={cats}
  selectedId={selected}
  onSelect={setSelected}
  inspector={<IntegrationConfig id={selected}/>}
/>

// DON'T — hand-roll the responsive tile grid
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, …)" }}>…</div>

// DON'T — color-only status dot
<div style={{ background: status === "connected" ? "green" : "red" }}/>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `IntegrationHubLayout.css` (use `Grid` and `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders tiles for the active category
- Switching tabs emits `onActiveCategoryChange`
- Selecting a tile emits `onSelect` and renders the inspector
- Composition probes: outer `Grid`; `Tabs` for categories; inner `Grid` for tile layout; `Card` per tile
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without a selected integration
