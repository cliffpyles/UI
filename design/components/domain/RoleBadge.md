---
name: RoleBadge
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Badge, Text]
replaces-raw: []
---

# RoleBadge

> A compact visual representation of a user's role within an organization or workspace.

## Purpose
RoleBadge owns the role enum (`owner`, `admin`, `member`, `guest`, `billing`) and its visual mapping. By rendering every role chip through this one component, the system guarantees that "Admin" looks the same on the team page, the audit log, and a user popover, and that role-color decisions live in one place.

## When to use
- A user row needs a role chip
- A member list cell shows access level
- A user profile popover surfaces the role

## When NOT to use
- Free-form labels → use **LabelPicker** / **Tag**
- Workflow status → use **WorkflowStatePicker**
- Visibility scope → use **VisibilityBadge**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box display="inline-flex" align="center" gap="1">` | hand-rolled flex/gap   |
| Role pill       | `Badge variant=…>`                 | raw styled `<span>` with chip CSS  |
| Role name text  | `Text size="caption" weight="medium">` (when not inside Badge slot) | raw styled `<span>` |

## API contract
```ts
type Role = "owner" | "admin" | "member" | "guest" | "billing";

interface RoleBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  role: Role;
  label?: ReactNode;                  // override default role display name
}
```
Component uses `forwardRef<HTMLSpanElement, RoleBadgeProps>`.

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| owner    | Strong/primary `Badge` variant; "Owner" label                         |
| admin    | Primary `Badge` variant; "Admin" label                                |
| member   | Neutral `Badge` variant; "Member" label                               |
| guest    | Warning-tinted `Badge` variant; "Guest" label                         |
| billing  | Info-tinted `Badge` variant; "Billing" label                          |

## Accessibility
- Role badge is non-interactive; carries plain text content (the role name) so screen readers read it directly.
- Color never carries the meaning alone — the role label is always rendered.
- When used as the only role indicator on a row, the component is included in the row's accessible name.

## Tokens
- Per-role tokens (mapped to `Badge` variants):
  - `--role-color-{owner|admin|member|guest|billing}`
  - `--role-surface-{owner|admin|member|guest|billing}`
- Gap inherited from `Box`: `--space-1`

## Do / Don't
```tsx
// DO
<RoleBadge role="admin" />
<RoleBadge role="guest" label="External guest" />

// DON'T — role color without label text
<Badge variant="primary"/>     // not a RoleBadge

// DON'T — caller-defined role string
<RoleBadge role={"superuser" as Role} />   // outside the enum
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
- Each `role` renders the correct default label and `Badge` variant
- `label` overrides the default display name
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Badge"]` resolves
- axe-core passes for each role
