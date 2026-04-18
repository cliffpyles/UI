---
name: Tag
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-display]
uses: [Text, Icon, Dot]
replaces-raw: []
---

# Tag

> A small, colored chip representing a category, attribute, or filter token.

## Purpose
Tag is the canonical chip for inline classification — surfacing labels, statuses, filter pills, and removable tokens. It owns the variant-color mapping and removable affordance so every chip in the system shares the same chrome and dismissal behavior.

## When to use
- A category or attribute label on a row (`success`, `beta`, `archived`)
- A filter pill that the user can dismiss (`removable`)
- A status indicator with optional leading dot

## When NOT to use
- A clickable link or action → use **Button** with `variant="ghost"` `size="sm"`
- A counter (47 unread) → use **Badge** primitive
- A user identity chip with avatar → use a **PersonChip** domain component
- The full status mapping (enum → label + color) → use **StatusBadge** (domain)

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Label text      | `Text size="caption" weight="medium">` | raw styled `<span>`            |
| Leading icon    | `Icon`                             | inline `<svg>`                     |
| Status dot      | `Dot variant={tagVariant}>`        | `::before` pseudo-element with bg  |
| Dismiss control | `Button` (icon-only, ghost, xs) wrapping `Icon name="x"` | raw `<button>` with `<svg>` |

> Note: the dismiss control is itself a `Button` — that is the only allowed in-tier upward reference, justified by the fact that removable Tags appear inside lists where every dismiss must look and behave identically.

## API contract
```ts
type TagVariant = "neutral" | "primary" | "success" | "warning" | "error";
type TagSize = "sm" | "md";

interface TagOwnProps {
  variant?: TagVariant;       // default "neutral"
  size?: TagSize;              // default "md"
  removable?: boolean;         // default false
  onRemove?: () => void;
  leadingIcon?: ReactNode;     // composes <Icon> at call site
  showDot?: boolean;           // default false; renders a leading <Dot variant={variant}>
  children?: ReactNode;
}

export type TagProps = TagOwnProps & HTMLAttributes<HTMLSpanElement>;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Variant background + text color from tokens                           |
| removable | Trailing dismiss `Button` rendered; calls `onRemove` on click         |
| disabled | Desaturated; dismiss button disabled                                  |

## Accessibility
- Container is a non-interactive `<span>` with `role="status"` only when used to convey live status.
- Dismiss button MUST have `aria-label` of the form `Remove ${label}`; falls back to `Remove` when children isn't a string.
- Color is never the only signal — `showDot` and the label text carry the meaning.

## Tokens
- Background: `--tag-background-{neutral|primary|success|warning|error}`
- Text: `--tag-text-{neutral|primary|success|warning|error}`
- Border: `--tag-border-{neutral|primary|success|warning|error}` (optional, may be transparent)
- Padding: `--tag-padding-{sm|md}-{x|y}`
- Gap: `--tag-gap`
- Radius: `--radius-full`

## Do / Don't
```tsx
// DO
<Tag variant="success">Active</Tag>
<Tag variant="warning" showDot>Beta</Tag>
<Tag removable onRemove={drop}>filter:region=us</Tag>

// DON'T — clickable Tag
<Tag onClick={…}>Click me</Tag>      // use Button

// DON'T — hand-rolled remove glyph
<Tag /* … */>x close</Tag>           // use Icon name="x" inside the dismiss Button
```

## Forbidden patterns (enforced)
- Raw styled `<span>` for the label — use `Text`
- Inline `<svg>` anywhere — use `Icon`
- Raw `<button>` for dismiss — use `Button` (icon-only ghost) wrapping `Icon`
- `::before`/`::after` colored dots — use `Dot`
- Hardcoded color, spacing, radius
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `variant` and `size` renders correctly
- `removable` shows the dismiss button; clicking it fires `onRemove`
- `showDot` renders a `Dot` matching the `variant`
- Dismiss button has `aria-label` derived from string children
- Forwards ref; spreads remaining props
- axe-core passes
