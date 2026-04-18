---
name: StatusBadge
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, states]
uses: [Box, Badge, Text, Icon]
replaces-raw: []
---

# StatusBadge

> A status enum mapped to a colored badge with an optional leading icon and consistent label.

## Purpose
StatusBadge owns the registry that translates application status enums (active, pending, archived, suspended, failed, success, etc.) into a single, consistent badge. Product surfaces never re-decide which color "pending" gets — they call StatusBadge with the enum and inherit the design system's authoritative mapping.

## When to use
- Status column in tables (`DataTable`, `Table`)
- Inline status next to a record title in a `Card` or list row
- Header chrome of a detail page

## When NOT to use
- System health (green/yellow/red services) → use **HealthIndicator**
- Deployment environment chip → use **EnvironmentTag**
- Free-form, user-defined classification → use base **Tag**
- A removable filter pill → use **FilterChip**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1">`          | hand-rolled flex/gap in CSS          |
| Surface chip    | `Badge variant={statusVariant}>`                       | raw styled `<span>` with bg          |
| Status icon     | `Icon name={statusIcon}>` (optional)                   | inline `<svg>`                       |
| Label text      | `Text size="caption" weight="medium">`                 | raw styled `<span>`                  |

## API contract
```ts
type Status =
  | "active" | "inactive" | "pending" | "in-progress"
  | "success" | "warning" | "error" | "failed"
  | "archived" | "draft" | "suspended" | "scheduled";

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  label?: string;              // override default label
  showIcon?: boolean;          // default true
  size?: "sm" | "md";
}
```
Forwarded ref targets the root `<span>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                              |
|----------------|-----------------------------------------------------------------------|
| each status    | Renders mapped variant, icon, and label                               |
| custom label   | `label` prop overrides default copy; mapping for variant/icon stays   |
| no icon        | `showIcon={false}` renders chip with text only                        |
| unknown status | Falls back to neutral variant with the raw enum string as label       |

## Accessibility
- Status is conveyed by label + icon + color — never color alone.
- Root `<span>` has `aria-label` of the form `Status: ${label}`.
- Icon is `aria-hidden` since the label carries the meaning.
- Avoid `role="status"`; the value is static, not a live region.

## Tokens
- Inherits all surface tokens from `Badge`
- Adds (component tier): `--status-badge-gap`

## Do / Don't
```tsx
// DO
<StatusBadge status="active" />
<StatusBadge status="failed" label="Build failed" />

// DON'T — bespoke status mapping at call site
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>

// DON'T — color-only signal
<span style={{color: "green"}}>active</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `status` value renders the correct variant, icon, and label
- `label` prop overrides default copy
- `showIcon={false}` omits the icon
- Unknown status falls back to neutral
- Composition probe: `Badge` resolves in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every status
