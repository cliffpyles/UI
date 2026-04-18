---
name: EmptyState
tier: composite
level: 5
status: stable
since: 0.5.0
patterns: [states]
uses: [Box, Text, Icon, Button]
replaces-raw: []
---

# EmptyState

> A centered placeholder explaining why a region has no data and what the user can do next.

## Purpose
EmptyState is the canonical answer to "the data loaded successfully and there is nothing to show." It encodes the empty-state taxonomy from the states pattern doc: `no-data`, `no-results`, `error`, `first-use`, `restricted` — each with its own default icon and recommended copy shape. The component is presentational; the caller supplies the title, description, and action button. By owning the layout and variant→icon mapping, EmptyState keeps every "no data" surface in the product reading the same way.

## When to use
- A list, table, or chart whose query returned zero items
- A first-use surface that should onboard the user
- A region the user lacks permission to view
- A search result panel with no matches

## When NOT to use
- A failed request — use **ErrorState**
- A loading state — use **Skeleton**
- An entire page-level error or permission boundary — use a feature-level error/empty layout, not a single EmptyState
- Inline "no value" placeholders — use an em-dash (`—`)

## Composition (required)
| Concern         | Use                                              | Never                                  |
|-----------------|--------------------------------------------------|----------------------------------------|
| Root layout     | `Box display="flex" direction="column" align="center" gap>` | hand-rolled flex CSS        |
| Illustration    | `Icon size="xl" color="secondary">` (variant default) or caller-supplied node | inline `<svg>` |
| Title           | `Text as="h3" size="lg" weight="semibold">`      | raw `<h3>` with typography CSS         |
| Description     | `Text as="p" size="sm" color="secondary">`       | raw `<p>` with typography CSS          |
| Action          | `Button>` provided by caller via `action` prop   | raw `<button>` inside this component   |

## API contract
```ts
type EmptyStateVariant =
  | "no-data"
  | "no-results"
  | "error"          // emergent variant; prefer the dedicated ErrorState component
  | "first-use"
  | "restricted";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: EmptyStateVariant;     // default "no-data"
  title: string;
  description?: ReactNode;
  icon?: ReactNode;                // overrides the variant default
  action?: ReactNode;              // expected to be a <Button>
}
```

## Required states
| State            | Default icon         | Title shape                  | Action                       |
|------------------|----------------------|------------------------------|------------------------------|
| `no-data`        | `Icon name="plus"`   | "No [items] yet"             | Primary CTA: "Create [item]" |
| `no-results`     | `Icon name="search"` | "No results for '[query]'"   | "Clear filters"              |
| `error`          | `Icon name="alert-circle"` | "Couldn't load [items]" | "Retry" (prefer **ErrorState**) |
| `first-use`      | `Icon name="info"`   | "Get started with [feature]" | "Learn more" / first-step CTA |
| `restricted`     | `Icon name="eye-off"`| "You don't have access"      | "Request access"             |

## Accessibility
- The root region carries no implicit role; it is a styled container. Callers may wrap it in a labelled landmark when used at the section level.
- The icon is decorative — no `aria-label`. The title carries the accessible meaning.
- Action buttons inherit accessibility from `Button`.

## Tokens
- Spacing: `--empty-state-gap`, `--empty-state-padding`
- Max width: `--empty-state-max-width`
- Icon color: inherited from `Icon` semantic colors
- Text colors: inherited from `Text` semantic colors

## Do / Don't
```tsx
// DO
<EmptyState
  variant="no-results"
  title="No projects match your filter"
  description="Try clearing the status filter or changing the date range."
  action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
/>

// DON'T — using EmptyState for an error
<EmptyState variant="error" title="Couldn't load"/>     // use ErrorState

// DON'T — inline svg illustration
<EmptyState title="No results" icon={<svg>…</svg>}/>    // pass an Icon

// DON'T — raw button as action
<EmptyState title="…" action={<button>Create</button>}/>// use Button
```

## Forbidden patterns (enforced)
- Raw styled `<h1>`-`<h6>`, `<p>`, `<span>` (use `Text`)
- Inline `<svg>` (use `Icon`)
- Raw `<button>` (caller must pass a `Button` via `action`)
- Hand-rolled flex CSS (use `Box`)
- Hardcoded color, spacing, font-size values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `variant` renders its mapped default icon
- Custom `icon` prop overrides the default
- `description` and `action` are conditionally rendered
- Forwards ref; spreads remaining props onto root
- Composition probe: `Box` is the layout; `Text` renders title/description; `Icon` renders the default illustration
- axe-core passes for each variant
