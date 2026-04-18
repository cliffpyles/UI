---
name: EntityLink
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display]
uses: [Box, Text, Icon]
replaces-raw: ["<a> used as an entity reference"]
---

# EntityLink

> A clickable reference to a record (issue, project, user, document) with a type icon and consistent styling.

## Purpose
EntityLink is the canonical "go to this record" link — `# 1234 · Fix login bug`, `@cliff`, `~Project Atlas`. It owns the type icon, the truncation of long titles, and the link/anchor semantics so every entity reference in the product looks and behaves the same.

## When to use
- A row that links to a related record (parent issue, owner, dependency)
- Inline references inside copy or audit log entries
- Breadcrumb or back-link to a parent record

## When NOT to use
- Inline mention inside running text → use **MentionToken**
- A bare user reference (avatar + name) → use **UserChip**
- Generic navigation link with no entity context → product nav, not this component

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="2xs">` | hand-rolled inline CSS  |
| Type icon       | `Icon>`                                          | inline `<svg>` or emoji        |
| Identifier      | `Text size="inherit" weight="medium">`           | raw styled `<span>`            |
| Title / label   | `Text size="inherit" truncate>`                  | raw styled `<span>` with CSS   |
| Anchor element  | Owns raw `<a>` (only when no `as` override)      | wrapping `<button>`            |

## API contract
```ts
type EntityType = "issue" | "project" | "user" | "team" | "document" | "commit" | "release" | "custom";

interface EntityLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  type: EntityType;
  identifier?: string;          // e.g. "#1234"
  label: string;                // human-readable title
  href: string;
  iconOverride?: ReactNode;     // for type="custom"
  truncate?: boolean;           // default true
}
```

## Required states
| State        | Behavior                                                         |
|--------------|------------------------------------------------------------------|
| default      | Icon + identifier + label, label truncates with ellipsis         |
| hover/focus  | Underline + focus ring per token spec                             |
| visited      | Visited state inherits from link tokens                          |
| disabled     | `aria-disabled` rendered as muted, non-interactive               |

## Accessibility
- Renders a real `<a href>` so middle-click and right-click work
- Type icon marked `aria-hidden`; type is part of the visible label or `aria-label`
- Truncated label: full text exposed via `title` and `aria-label`
- Focus ring uses the standard focus token

## Tokens
- Inherits typography tokens from `Text`, sizing from `Icon`
- Adds: `--entity-link-gap`, `--entity-link-icon-color`

## Do / Don't
```tsx
// DO
<EntityLink type="issue" identifier="#1234" label="Fix login bug" href="/issues/1234" />
<EntityLink type="user" label="Cliff Pyles" href="/users/cliff" />

// DON'T — wrap a bare anchor
<a href={href}><Icon name="issue"/> #1234 Fix login bug</a>

// DON'T — make a button look like a link
<Button variant="ghost" onClick={() => navigate(href)}>#1234</Button>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders `<a href>` with type icon and label
- Truncation exposes full text via `title` and `aria-label`
- Disabled renders `aria-disabled` and is not focusable
- `type="custom"` accepts `iconOverride`
- Keyboard activation works via Enter
- Forwards ref; spreads remaining props onto root
- axe-core passes
