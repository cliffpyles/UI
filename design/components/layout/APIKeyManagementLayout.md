---
name: APIKeyManagementLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [data-display]
uses: [Box, DataTable, Button, Modal]
replaces-raw: []
---

# APIKeyManagementLayout

> An admin surface for listing, creating, scoping, and revoking API credentials.

## Purpose
Every product that exposes an API needs the same admin surface: a table of keys with their scopes and expiration, a "create key" flow that shows the secret exactly once, and a confirm-to-revoke flow. APIKeyManagementLayout owns that frame so security-sensitive flows (one-shot secret display, confirm-on-revoke) are consistent and never re-rolled per product surface.

## When to use
- Managing API tokens, personal access tokens, or service credentials
- Any admin surface that lists revocable credentials with scopes and expirations
- Surfaces where new secrets must be displayed once and never again

## When NOT to use
- Listing OAuth integrations → use **IntegrationHubLayout**
- Listing application users → use **UserManagementLayout**
- Showing audit history of key usage → use **AuditLogLayout**

## Composition (required)
| Concern             | Use                                                  | Never                                  |
|---------------------|------------------------------------------------------|----------------------------------------|
| Frame layout        | `Box direction="column" gap>`                        | hand-rolled flex CSS                   |
| Header row          | `Box direction="row" align="center" justify="between" gap>` | hand-rolled flex CSS            |
| Credentials table   | `DataTable`                                          | bespoke table                          |
| Create / revoke triggers | `Button`                                        | raw `<button>`                         |
| Create-key dialog   | `Modal`                                              | raw `<dialog>` or hand-rolled overlay  |
| Confirm-revoke dialog | `Modal`                                            | raw `<dialog>` or hand-rolled overlay  |

## API contract
```ts
interface APIKey {
  id: string;
  label: string;
  scopes: string[];
  createdAt: string;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
}

interface APIKeyManagementLayoutProps extends HTMLAttributes<HTMLDivElement> {
  keys: APIKey[];
  loading?: boolean;
  error?: Error | null;
  onCreate: (request: { label: string; scopes: string[]; expiresAt?: string | null }) => Promise<{ secret: string }>;
  onRevoke: (id: string) => void | Promise<void>;
  availableScopes: Array<{ id: string; label: string; description?: string }>;
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State          | Behavior                                                                    |
|----------------|-----------------------------------------------------------------------------|
| default        | DataTable renders rows for each key                                         |
| loading        | DataTable inherits its loading skeleton state                               |
| empty          | DataTable inherits its EmptyState; CTA points at "Create key"               |
| error          | DataTable inherits its ErrorState                                           |
| creating       | Create dialog open with form; submit awaits `onCreate`                      |
| created        | Create dialog shows the returned secret exactly once with a copy affordance |
| revoking       | Confirm-revoke dialog open; primary action awaits `onRevoke`                |

## Accessibility
- Tables, dialogs, and buttons inherit accessibility wiring from `DataTable`, `Modal`, `Button`
- The one-shot secret panel announces with `role="status"` and includes explicit instructions that the value will not be shown again
- Revoke confirmation uses destructive `Button variant="destructive"` and requires an explicit confirm step

## Tokens
- Inherits all tokens from `Box`, `DataTable`, `Button`, `Modal`
- Adds (component tier): `--api-key-section-gap`

## Do / Don't
```tsx
// DO
<APIKeyManagementLayout
  keys={keys}
  availableScopes={scopes}
  onCreate={createKey}
  onRevoke={revokeKey}
/>

// DON'T — bespoke table
<table>{keys.map(k => <tr key={k.id}>…</tr>)}</table>

// DON'T — raw confirm dialog
<dialog open><p>Revoke?</p><button>Yes</button></dialog>

// DON'T — show the secret in a console.log or persistently in the UI
console.log(secret);
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `APIKeyManagementLayout.css` (use `Box`)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders a `DataTable` of keys
- Create button opens a `Modal`; submit invokes `onCreate` and surfaces the returned secret
- Revoke action opens a confirmation `Modal`; confirming invokes `onRevoke`
- Composition probes: `DataTable`, `Modal`, `Button` resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes for default, create-dialog-open, and revoke-dialog-open states
