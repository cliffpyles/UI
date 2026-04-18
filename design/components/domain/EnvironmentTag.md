---
name: EnvironmentTag
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [permissions-and-access]
uses: [Box, Badge, Text]
replaces-raw: []
---

# EnvironmentTag

> A high-contrast badge identifying the deployment environment (production, staging, dev, preview).

## Purpose
EnvironmentTag exists so that operators and developers cannot mistake which environment they are acting against. It owns the canonical mapping from environment enum to color, label, and accessible text — making destructive actions in production visually unmistakable from the same actions in staging.

## When to use
- App chrome (top bar, page header) on internal tools that connect to multiple environments
- Confirmation dialogs that perform environment-scoped writes
- Any surface where the user could reasonably confuse environments

## When NOT to use
- Generic status (active, archived) → use **StatusBadge**
- A removable filter pill → use **FilterChip**
- A user-defined tag → use base **Tag**

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap="1"`           | hand-rolled flex/gap in CSS          |
| Surface chip    | `Badge variant={envVariant}>`                          | raw styled `<span>` with bg          |
| Label text      | `Text size="caption" weight="bold">`                   | raw styled `<span>`                  |

## API contract
```ts
type Environment = "production" | "staging" | "development" | "preview" | "local";

interface EnvironmentTagProps extends HTMLAttributes<HTMLSpanElement> {
  environment: Environment;
  label?: string;                  // override default label (e.g., "PROD")
  size?: "sm" | "md";
}
```
Forwarded ref targets the root `<span>`. Remaining props are spread onto the root.

## Required states
| State        | Behavior                                                              |
|--------------|-----------------------------------------------------------------------|
| production   | High-contrast danger variant; uppercase "PRODUCTION" by default       |
| staging      | Warning variant; "STAGING"                                            |
| development  | Info variant; "DEVELOPMENT"                                           |
| preview      | Neutral-info variant; "PREVIEW"                                       |
| local        | Neutral variant; "LOCAL"                                              |

## Accessibility
- The environment must be conveyed by the visible label, never color alone.
- Root `<span>` has `aria-label` of the form `Environment: ${label}` so screen readers announce context.
- Production variant meets WCAG AA contrast against any allowed surface.
- Avoid `role="status"` — the value is static, not a live region.

## Tokens
- Inherits all surface tokens from `Badge`
- Adds (component tier): `--environment-tag-letter-spacing`

## Do / Don't
```tsx
// DO
<EnvironmentTag environment="production" />
<EnvironmentTag environment="staging" label="STG" size="sm" />

// DON'T — hand-rolled colored chip
<span style={{background: "red", color: "white"}}>PROD</span>

// DON'T — using base Tag for environment
<Tag variant="error">PROD</Tag>
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
- Each `environment` renders the correct variant and label
- `label` prop overrides the default copy
- `aria-label` includes the environment name
- Production variant meets contrast threshold
- Composition probe: `Badge` resolves in the rendered output
- Forwards ref; spreads remaining props onto root
- axe-core passes for every environment
