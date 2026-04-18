---
name: AccessIndicator
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Icon, Tooltip]
replaces-raw: []
---

# AccessIndicator

> A small lock-or-key icon with tooltip that signals an item's access status.

## Purpose
AccessIndicator is the canonical "this thing is locked / restricted / open" mark. It standardizes the icon + tooltip pairing so every product surface uses the same glyph, the same wording, and the same accessibility behavior to communicate access state.

## When to use
- A row, file, or record needs a quick visual signal of restricted access
- A tooltip explanation suffices (no inline action required)
- A condensed surface where a full **VisibilityBadge** is too heavy

## When NOT to use
- The full visibility scope (private/internal/public) → use **VisibilityBadge**
- A user role display → use **RoleBadge**
- An inline share action → use **ShareControl**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center">` | hand-rolled inline-flex CSS |
| Status icon     | `Icon size="sm">`                  | inline `<svg>`                     |
| Tooltip         | `Tooltip>` wrapping the icon       | raw `title=""` attribute / hand-rolled tooltip |

## API contract
```ts
type AccessStatus = "locked" | "restricted" | "open" | "shared";

interface AccessIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: AccessStatus;
  label?: ReactNode;                  // overrides default tooltip copy
}
```
Component uses `forwardRef<HTMLSpanElement, AccessIndicatorProps>`.

## Required states
| State       | Behavior                                                          |
|-------------|-------------------------------------------------------------------|
| locked      | Lock icon, default tooltip "Locked"                               |
| restricted  | Lock-with-people icon, default tooltip "Restricted access"        |
| open        | Globe icon, default tooltip "Open access"                         |
| shared      | People icon, default tooltip "Shared"                             |

## Accessibility
- The icon is decorative; the `Tooltip` content provides the accessible name via `aria-describedby` (or `aria-label` on the host element when no other label exists).
- Color is never the only signal — the icon shape carries meaning.
- The component is keyboard focusable so the tooltip is reachable without a mouse.

## Tokens
- Icon color: `--access-indicator-icon-{locked|restricted|open|shared}`
- No spacing tokens (single icon)

## Do / Don't
```tsx
// DO
<AccessIndicator status="locked" />
<AccessIndicator status="restricted" label="Visible to admins only" />

// DON'T — title attribute as tooltip
<span title="Locked"><svg/></span>

// DON'T — color as the only signal
<Icon name="circle" color="red" />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `status` renders the correct icon and default tooltip copy
- `label` overrides the default tooltip text
- Tooltip is reachable via keyboard focus
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Tooltip"]` and `[data-component="Icon"]` resolve
- axe-core passes in each status
