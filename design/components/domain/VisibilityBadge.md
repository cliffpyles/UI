---
name: VisibilityBadge
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Badge, Icon, Text]
replaces-raw: []
---

# VisibilityBadge

> A chip that communicates the visibility scope of a record (private, team, organization, public).

## Purpose
VisibilityBadge owns the visibility scope enum and its visual mapping. It pairs a scope-specific icon with the scope label inside a `Badge` so every "who can see this?" indicator in the product reads identically and is impossible to skin off-grid.

## When to use
- A document/record header needs to show its scope
- A row in a list needs a quick scope mark
- A share dialog reflects the current scope back to the user

## When NOT to use
- A user's role within the org → use **RoleBadge**
- An access status (locked/restricted) → use **AccessIndicator**
- A status workflow value → use **WorkflowStatePicker**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="1">` (lives inside the Badge slot) | hand-rolled flex/gap |
| Pill            | `Badge variant=…>`                 | raw styled `<span>` chip           |
| Scope icon      | `Icon size="sm">`                  | inline `<svg>`                     |
| Scope label     | `Text size="caption" weight="medium">` | raw styled `<span>`            |

## API contract
```ts
type VisibilityScope = "private" | "team" | "organization" | "public";

interface VisibilityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  scope: VisibilityScope;
  label?: ReactNode;                  // override default scope display name
}
```
Component uses `forwardRef<HTMLSpanElement, VisibilityBadgeProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| private      | Lock icon + "Private" label, neutral `Badge` variant              |
| team         | People icon + "Team" label, info `Badge` variant                  |
| organization | Building icon + "Organization" label, primary `Badge` variant     |
| public       | Globe icon + "Public" label, success `Badge` variant              |

## Accessibility
- Scope is conveyed by both the icon and the label text — never color alone.
- Icon is decorative (`aria-hidden`); the label provides the accessible name.
- Read-only chip; non-interactive.

## Tokens
- Per-scope tokens (mapped to `Badge` variants):
  - `--visibility-color-{private|team|organization|public}`
  - `--visibility-surface-{private|team|organization|public}`
- Gap inherited from `Box`: `--space-1`

## Do / Don't
```tsx
// DO
<VisibilityBadge scope="team" />
<VisibilityBadge scope="public" label="Anyone with the link" />

// DON'T — bare icon
<Icon name="lock" />     // missing label, missing surface

// DON'T — caller-defined scope string
<VisibilityBadge scope={"internal" as VisibilityScope} />
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
- Each `scope` renders the correct icon, default label, and `Badge` variant
- `label` overrides the default display name
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Badge"]`, `[data-component="Icon"]`, `[data-component="Text"]` resolve
- axe-core passes for each scope
