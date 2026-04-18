---
name: PermissionRow
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Checkbox, Text, Icon]
replaces-raw: []
---

# PermissionRow

> A single permission entry — one action × one resource — with a toggleable checkbox and explanatory text.

## Purpose
PermissionRow is the canonical building block for permission matrices and role editors. It pairs a `Checkbox` with the resource label, optional description, and an inherited/locked indicator so every permission surface in the product reads the same way and consistently signals when a permission is forced by a parent role.

## When to use
- A row inside a role/permission editor
- A grouped list of capabilities for a user, role, or team
- A permission summary on an audit panel

## When NOT to use
- A user role display chip → use **RoleBadge**
- A scope/visibility indicator → use **VisibilityBadge**
- A standalone checkbox unrelated to permissions → use **Checkbox** + **FormField**

## Composition (required)
| Concern         | Use                                | Never                              |
|-----------------|------------------------------------|------------------------------------|
| Internal layout | `Box direction="row" align="start" gap="3" padding="2">` | hand-rolled flex/padding |
| Toggle          | `Checkbox>`                        | raw `<input type="checkbox">`      |
| Resource label  | `Text size="sm" weight="medium">`  | raw `<label>` with typography CSS  |
| Description text | `Text size="caption" color="secondary">` | raw `<p>` with typography CSS |
| Locked / inherited indicator | `Icon size="sm">`     | inline `<svg>`                     |

## API contract
```ts
interface PermissionRowProps extends HTMLAttributes<HTMLDivElement> {
  action: string;                     // resource label, e.g. "Edit projects"
  description?: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  inherited?: boolean;                // checked because of parent role; lock icon shown
  disabled?: boolean;
}
```
Component uses `forwardRef<HTMLDivElement, PermissionRowProps>`.

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| default      | `Checkbox` interactive; resource label + optional description     |
| inherited    | `Checkbox` shows checked + lock `Icon`; non-interactive           |
| disabled     | `Checkbox` disabled; row text muted                               |
| description  | When provided, renders below the resource label                   |

## Accessibility
- The `Checkbox` is the labelled control; resource label is wired via `htmlFor`/`id` (handled by `Checkbox` + `Text as="label">` pairing).
- Description, when present, is wired through `aria-describedby`.
- Inherited rows announce "Inherited" via VisuallyHidden or as part of the description.

## Tokens
- Surface hover: `--permission-row-surface-hover`
- Lock icon color: `--permission-row-lock-icon`
- Padding/gap inherited from `Box`: `--space-2`, `--space-3`

## Do / Don't
```tsx
// DO
<PermissionRow action="Edit projects" description="Rename, archive, change settings"
  checked={can.edit} onChange={set("edit")} />

// DO — inherited
<PermissionRow action="View members" checked inherited />

// DON'T — raw checkbox
<input type="checkbox" checked={…} />

// DON'T — color-only inherited signal
<PermissionRow action="…" checked style={{ opacity: 0.5 }} />
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
- Toggling the `Checkbox` fires `onChange` with the new value
- `inherited` renders the lock `Icon` and disables the checkbox
- `disabled` blocks interaction
- Description, when present, is wired via `aria-describedby`
- Forwards ref; spreads remaining props onto root
- Composition probe: `[data-component="Checkbox"]` and `[data-component="Text"]` resolve
- axe-core passes in default, inherited, disabled states
