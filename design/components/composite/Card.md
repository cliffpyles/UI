---
name: Card
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [data-display]
uses: [Box, Text, Divider]
replaces-raw: []
---

# Card

> A bounded surface that groups related content with consistent padding, radius, and elevation.

## Purpose
Card is the canonical content container for grouping related information into a discrete, scannable unit on a dashboard, list, or report. It owns the surface treatment (background, radius, shadow, border) and the standard slot anatomy — header, body, footer, optional title and actions — so every card in the system reads as a member of the same family. Compound sub-components (`Card.Header`, `Card.Title`, `Card.Actions`, `Card.Body`, `Card.Footer`) are slots, not independent components.

## When to use
- Grouping related metrics, lists, or panels on a dashboard
- A bounded summary of an entity (user, project, transaction)
- Any region that should read as "one thing" against a denser background

## When NOT to use
- A clickable summary that navigates somewhere — wrap a Card in a link, or use a domain-specific `EntityCard`
- A metric tile with value + trend + sparkline — use **MetricCard** (domain)
- Modal-like focused tasks — use **Modal**
- Plain page sections without a surface — use a section heading + `Box`

## Composition (required)
| Concern         | Use                                              | Never                                       |
|-----------------|--------------------------------------------------|---------------------------------------------|
| Surface         | `Box` (background, radius, shadow, border via tokens) | raw `<div>` with surface CSS           |
| Header layout   | `Box display="flex" justify="between" align="center" gap>` | hand-rolled flex CSS              |
| Title           | `Text as="h3" size="base" weight="semibold">`    | raw `<h3>` with typography CSS              |
| Subtitle        | `Text size="sm" color="secondary">`              | raw `<p>` with typography CSS               |
| Actions group   | `Box display="flex" gap shrink={false}>`         | hand-rolled flex CSS                        |
| Section divider | `Divider`                                        | raw `<hr>` or `border-top` declarations     |
| Body / Footer   | `Box`                                            | raw `<div>` with padding CSS                |

## API contract
```ts
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
type CardTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "color">;
type CardActionsProps = HTMLAttributes<HTMLDivElement>;
type CardBodyProps = HTMLAttributes<HTMLDivElement>;
type CardFooterProps = HTMLAttributes<HTMLDivElement>;

// Compound:
// Card.Header, Card.Title, Card.Actions, Card.Body, Card.Footer
```

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| default  | Surface renders with token-driven padding, radius, border, shadow         |
| with header | `Card.Header` aligns title and actions; bottom border or spacing per density |
| with footer | `Card.Footer` aligns metadata or actions at the bottom edge            |
| empty    | Caller renders an `EmptyState` inside `Card.Body` — Card has no built-in empty mode |
| loading  | Caller renders `Skeleton` shapes inside `Card.Body` — Card has no built-in loading mode |
| interactive | Optional `as="a"` or wrapping in a link is allowed; Card itself does not own click handling |

## Accessibility
- Card has no implicit landmark role — it is a styled region. If a card is a navigation target, the wrapping anchor or button is responsible for the role and focus ring.
- `Card.Title` renders as `<h3>` by default; callers may override the heading level via `Text`'s `as` prop on the title slot when nested inside a different heading hierarchy.

## Tokens
- Surface: `--color-surface-card`, `--color-border-card`
- Radius: `--radius-lg`
- Shadow: `--shadow-card`
- Spacing: `--card-padding`, `--card-gap`, `--card-header-gap`
- Density overrides via `[data-density="compact"]` reduce padding and header gap

## Do / Don't
```tsx
// DO
<Card>
  <Card.Header>
    <Card.Title>Recent activity</Card.Title>
    <Card.Actions><Button size="sm" variant="ghost">View all</Button></Card.Actions>
  </Card.Header>
  <Card.Body>{rows}</Card.Body>
</Card>

// DON'T — duplicating Card surface
<div className="my-card" style={{ borderRadius: 8, boxShadow: "…" }}>…</div>

// DON'T — bypassing the title slot
<Card><h3 style={{ fontWeight: 600 }}>Recent activity</h3>…</Card>

// DON'T — props instead of slots
<Card title="Recent" showViewAll onViewAll={…}>…</Card>
```

## Forbidden patterns (enforced)
- Raw styled `<h1>`-`<h6>`, `<p>` — use `Text`
- Raw `<hr>` — use `Divider`
- Hand-rolled flex CSS in stylesheet — use `Box`
- Hardcoded color, spacing, radius, shadow values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders all slots in correct DOM order
- `Card.Title` renders as `<h3>` by default
- `Card.Actions` does not shrink when header content overflows
- Forwards ref; spreads remaining props onto root
- Composition probe: `Box` is the surface; `Text` renders the title
- axe-core passes with header + body + footer
