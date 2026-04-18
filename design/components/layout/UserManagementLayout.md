---
name: UserManagementLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Box, DataTable, Modal, UserChip, RoleBadge, Button]
replaces-raw: []
---

# UserManagementLayout

> An admin surface for listing users, inviting new ones, and assigning or revoking roles.

## Purpose
User-admin surfaces converge on the same shape: a table of members showing chip + role + status, an invite flow in a `Modal`, and per-row actions for changing roles or removing access. UserManagementLayout owns that frame so identity, status, and role display are uniform across every product's user-management page.

## When to use
- A team or organization's "Members" admin page
- Any list of human users with role assignments and an invite flow
- Surfaces that combine a member table with bulk actions and an invite dialog

## When NOT to use
- A list of API credentials → use **APIKeyManagementLayout**
- A directory of external contacts → use **DataTable** with custom row renderers
- A user profile detail page → that's a domain feature, not this layout

## Composition (required)
| Concern             | Use                                                  | Never                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Frame layout        | `Box direction="column" gap>`                        | hand-rolled flex CSS                   |
| Header row          | `Box direction="row" align="center" justify="between" gap>` | hand-rolled flex CSS            |
| Member table        | `DataTable` (with custom row renderer)               | bespoke table                          |
| Identity cell       | `UserChip`                                           | inline avatar + name JSX               |
| Role cell           | `RoleBadge`                                          | inline pill JSX                        |
| Invite trigger      | `Button`                                             | raw `<button>`                         |
| Invite dialog       | `Modal`                                              | raw `<dialog>` or hand-rolled overlay  |
| Per-row action menus| `Menu` (via DataTable's row action slot)             | bespoke dropdown                       |

## API contract
```ts
type MembershipStatus = "active" | "invited" | "suspended";

interface Member {
  id: string;
  user: { id: string; name: string; email: string; avatarUrl?: string };
  roleId: string;
  status: MembershipStatus;
  joinedAt?: string;
}

interface UserManagementLayoutProps extends HTMLAttributes<HTMLDivElement> {
  members: Member[];
  roles: Array<{ id: string; label: string; badge?: { variant: string; label: string } }>;
  loading?: boolean;
  error?: Error | null;
  onInvite: (request: { email: string; roleId: string }) => Promise<void>;
  onChangeRole: (memberId: string, roleId: string) => void | Promise<void>;
  onRemove: (memberId: string) => void | Promise<void>;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State       | Behavior                                                                   |
|-------------|----------------------------------------------------------------------------|
| default     | DataTable renders rows for each member with `UserChip` + `RoleBadge`       |
| loading     | Inherits `DataTable` skeleton state                                        |
| empty       | Inherits `DataTable` EmptyState; CTA points at "Invite"                    |
| error       | Inherits `DataTable` ErrorState                                            |
| inviting    | Invite `Modal` open with email + role form; submit awaits `onInvite`       |
| changing-role | Per-row role selector reflects pending state until `onChangeRole` resolves |
| removing    | Confirm-remove `Modal` opens before invoking `onRemove`                    |

## Accessibility
- Tables, dialogs, chips, and buttons inherit accessibility wiring from their base components
- `UserChip` provides the accessible name (full name + email) for the row
- `RoleBadge` conveys role with text, never color alone
- Remove confirmation uses destructive `Button variant="destructive"` and requires explicit confirm
- Invite dialog focus trap and field labelling inherited from `Modal` + `FormField` (used by caller-supplied invite form, or the layout's default form)

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `Modal`, `UserChip`, `RoleBadge`, `Button`
- Adds (component tier): `--user-management-section-gap`

## Do / Don't
```tsx
// DO
<UserManagementLayout
  members={members}
  roles={roles}
  onInvite={inviteUser}
  onChangeRole={updateRole}
  onRemove={removeMember}
/>

// DON'T — bespoke member table
<table>{members.map(m => <tr key={m.id}><td><img/></td><td>{m.user.name}</td>…</tr>)}</table>

// DON'T — raw role pill
<span style={{ background: "#eee" }}>{roleLabel}</span>

// DON'T — confirm remove with window.confirm()
if (window.confirm("Remove?")) onRemove(id);
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `UserManagementLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders a `DataTable` of members with `UserChip` and `RoleBadge` per row
- Invite button opens the invite `Modal`; submit invokes `onInvite`
- Changing a row's role invokes `onChangeRole(memberId, roleId)`
- Remove action opens a confirmation `Modal`; confirming invokes `onRemove(memberId)`
- Composition probes: `DataTable`, `Modal`, `UserChip`, `RoleBadge`, `Button` resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes for default, invite-dialog-open, and remove-dialog-open states
