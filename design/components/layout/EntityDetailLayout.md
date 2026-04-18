---
name: EntityDetailLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Box, Breadcrumbs, Tabs, Button, Text]
replaces-raw: []
---

# EntityDetailLayout

> A full-page detail frame with breadcrumbs, title, primary actions, and tabbed sections beneath.

## Purpose
EntityDetailLayout owns the page-level chrome for any record-detail surface — a user, an order, a deployment, a customer. It centralizes the breadcrumb row, the title-and-actions header, the metadata strip beneath the title, and the tabbed body region that switches between sections (Overview / Activity / Settings / etc.). Callers supply title text, action buttons, metadata, and tab definitions; the layout owns the frame, rhythm, and a11y wiring.

## When to use
- A "view this record" page reachable from a list, search, or breadcrumb trail
- Any detail surface that benefits from a stable header with switchable sub-views
- The right-hand panel of a master/detail when the detail has its own first-class page

## When NOT to use
- A side panel attached to a list — use **ContextualDrawerLayout** or **MasterDetailLayout**
- Inline expansion within a row — use a row-detail pattern in **Table**
- A landing page or dashboard — use a domain dashboard layout

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box as="main" display="flex" direction="column">` | raw `<main>` with flex CSS                  |
| Breadcrumb row       | `Breadcrumbs`                                      | raw `<nav>` with `<a>` chain                |
| Header layout        | `Box display="flex" justify="between" align="center">` | hand-rolled flex CSS                    |
| Title text           | `Text as="h1" size="2xl" weight="semibold">`       | raw `<h1>` with typography CSS              |
| Actions group        | `Box display="flex" gap>` of `Button`s             | hand-rolled flex CSS                        |
| Metadata strip       | `Box display="flex" wrap="wrap" gap>`              | hand-rolled flex CSS                        |
| Tabbed body          | `Tabs`                                             | hand-rolled tablist                         |
| Tab panel container  | `Box>` (caller fills with section content)         | raw `<section>` with padding CSS            |

## API contract
```ts
interface DetailTab {
  value: string;
  label: string;
  panel: ReactNode;
  badge?: ReactNode;                  // e.g. count
  disabled?: boolean;
}

interface EntityDetailLayoutProps extends HTMLAttributes<HTMLElement> {
  breadcrumbs: ReactNode;             // caller passes the Breadcrumbs node
  title: ReactNode;
  description?: ReactNode;
  metadata?: ReactNode;               // caller composes Tag/Badge/Timestamp etc.
  actions?: ReactNode;                // caller composes Buttons
  tabs: DetailTab[];
  activeTab?: string;
  onActiveTabChange?: (value: string) => void;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Breadcrumbs, header (title + actions), metadata, then the active tab panel |
| no-actions   | Header right-aligns nothing; title fills the row                          |
| no-metadata  | Metadata strip collapses and reserves no height                           |
| single-tab   | When `tabs.length === 1`, the tablist may visually collapse but `Tabs` still wraps the panel |
| tab-disabled | A `disabled` tab is rendered but skipped by keyboard navigation (delegated to `Tabs`) |

## Accessibility
- Root is `<main>` (page landmark).
- Title is the page's only `<h1>` (rendered via `Text as="h1">`); the layout exposes its id so callers can wire `aria-labelledby`.
- Breadcrumbs delegate to `Breadcrumbs` and use `<nav aria-label="Breadcrumb">`.
- Tab semantics (`tablist`/`tab`/`tabpanel`) delegated to `Tabs`.
- Action buttons receive a visible label even when icon-bearing.

## Tokens
- Header padding: `--entity-detail-header-padding-{x|y}`
- Section gap: `--entity-detail-section-gap`
- Metadata gap: `--entity-detail-metadata-gap`
- Surface inherited from `Box`

## Do / Don't
```tsx
// DO
<EntityDetailLayout
  breadcrumbs={<Breadcrumbs items={crumbs}/>}
  title="Order #1042"
  metadata={<MetaStrip/>}
  actions={<><Button variant="ghost">Edit</Button><Button>Approve</Button></>}
  tabs={tabs}
/>

// DON'T — raw heading
<h1 style={{ fontSize: 24 }}>Order #1042</h1>

// DON'T — hand-rolled tabs
<div className="tabs"><div role="tab">Overview</div></div>
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
- Renders Breadcrumbs, title (`<h1>`), metadata, actions, and Tabs in document order
- Default `activeTab` selects the first non-disabled tab; `onActiveTabChange` fires on switch
- `actions={null}` collapses the actions slot without a layout shift in the title row
- `tabs.length === 1` still wraps the panel in `Tabs`
- Composition probe: `Breadcrumbs`, `Tabs`, at least one `Button`, and `Text as="h1"` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with a multi-tab sample
