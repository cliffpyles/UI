---
name: EmptyStateScaffoldLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [states]
uses: [Box, EmptyState, Button, Card]
replaces-raw: []
---

# EmptyStateScaffoldLayout

> A first-run page scaffold pairing an EmptyState hero with a primary CTA and a strip of next-step Cards.

## Purpose
EmptyStateScaffoldLayout is the page-level frame the product shows the very first time a user lands on a feature with no data of their own. It elevates the canonical `EmptyState` to the role of hero, anchors the primary call-to-action, and presents a consistent set of "next step" tiles (sample data, docs, tutorial). By centralizing the scaffold, every feature's first-run surface communicates value the same way and the team can change the conversion model in one place.

## When to use
- A feature page rendered for the first time before any user data exists
- A new workspace landing page that needs a guided first action
- An empty list/dashboard that benefits from suggested next steps

## When NOT to use
- A simple "no items" state inside an existing populated screen → use **EmptyState**
- A failure to load → use **ErrorState**
- A repeating empty state on every visit → use **EmptyState** without the scaffold

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="column" align="center" gap>` | hand-rolled flex CSS                          |
| Hero block            | `EmptyState` with caller-supplied title/description | hand-rolled illustration + heading      |
| Primary CTA           | `Button variant="primary" size="lg">`        | raw `<button>`                                |
| Next-step tiles row   | `Box direction="row" gap wrap>`              | hand-rolled flex CSS                          |
| Each next-step tile   | `Card` with title + description + link Button| raw `<div>` with border CSS                   |

## API contract
```ts
interface ScaffoldStep {
  id: string;
  title: string;
  description: string;
  action: ReactNode;               // expected to be a <Button>
}

interface EmptyStateScaffoldLayoutProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: ReactNode;
  primaryAction: ReactNode;        // expected to be a <Button>
  steps?: ScaffoldStep[];          // 0–4 next-step tiles
  illustration?: ReactNode;        // overrides EmptyState's variant icon
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| default         | Hero + primary CTA rendered; tiles row collapses if `steps` is empty  |
| with-steps      | 1–4 tiles laid out in a wrapping row                                  |
| custom-illustration | `illustration` prop replaces the default EmptyState icon          |
| narrow viewport | Tile row stacks vertically; hero remains centered                     |

## Accessibility
- Hero heading is rendered through `EmptyState`'s `Text as="h1"` slot for the page-level use
- Primary CTA receives keyboard focus first after the heading
- Each next-step tile is a labelled region with the tile title as `aria-labelledby`
- Decorative illustration carries no `aria-label`

## Tokens
- Inherits surface tokens from `Card`, `EmptyState`, and `Box`
- Adds (component tier): `--empty-state-scaffold-hero-max-width`, `--empty-state-scaffold-tile-gap`, `--empty-state-scaffold-section-gap`

## Do / Don't
```tsx
// DO
<EmptyStateScaffoldLayout
  title="Build your first dashboard"
  description="Bring together your team's metrics in one place."
  primaryAction={<Button variant="primary" size="lg">Create dashboard</Button>}
  steps=[
    { id: "sample", title: "Try sample data", description: "Explore with demo metrics.", action: <Button variant="secondary">Open sample</Button> },
    { id: "docs", title: "Read the guide", description: "5-minute walkthrough.", action: <Button variant="ghost">Open docs</Button> },
  ]
/>

// DON'T — bypass EmptyState
<div className="hero"><h1>{title}</h1><p>{description}</p></div>

// DON'T — raw button as CTA
<EmptyStateScaffoldLayout primaryAction={<button>Create</button>} … />

// DON'T — handcraft the tile grid
<div className="tiles" style={{ display: "grid" }}>…</div>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `EmptyStateScaffoldLayout.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Hero renders title, optional description, and primary CTA in tab order
- `steps` array renders one `Card` per step; empty array hides the row
- `illustration` prop overrides the default EmptyState icon
- Composition probes: `EmptyState` resolves as hero; `Card` resolves per step; `Box` is the layout
- Forwards ref; spreads remaining props onto root
- axe-core passes with and without steps
