---
name: OrgSwitcher
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [states]
uses: [Box, Avatar, Text, Menu, Button]
replaces-raw: []
---

# OrgSwitcher

> A trigger + menu that switches the active organization or workspace.

## Purpose
OrgSwitcher is the global "which org am I in" affordance — typically pinned to a sidebar or top bar. It owns the current-org trigger (avatar + name + caret), the searchable org menu, and the "Create new organization" footer action so workspace switching looks and behaves the same everywhere.

## When to use
- Top-of-app or sidebar control for users who belong to multiple orgs
- Workspace picker in admin or settings shells
- Anywhere the user must switch identity context, not just navigate

## When NOT to use
- A user account menu (sign out, profile) → separate **UserMenu** (out of scope)
- Plain navigation between sections → use a sidebar nav
- Selecting a record (not a workspace) → use **Select** or **Dropdown**

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="flex" align="center" gap="sm">` for trigger contents | hand-rolled flex CSS |
| Trigger         | `Button variant="ghost">` wrapping the avatar + label | raw `<button>` or `<div onClick>` |
| Org icon        | `Avatar shape="square" size="sm">`               | raw `<img>`                    |
| Org name        | `Text size="sm" weight="medium" truncate>`       | raw styled `<span>`            |
| Menu surface    | `Menu>` for the dropdown panel and items         | raw `<ul>` with positioning    |
| Create action   | `Menu.Item` with leading `Icon`                  | hand-rolled footer item        |

## API contract
```ts
type Org = { id: string; name: string; logo?: string };

interface OrgSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  current: Org;
  orgs: Org[];
  onSelect: (org: Org) => void;
  onCreate?: () => void;
  searchable?: boolean;          // default true when orgs.length > 7
  loading?: boolean;
}
```

## Required states
| State          | Behavior                                                         |
|----------------|------------------------------------------------------------------|
| default        | Trigger shows current org; menu lists orgs with current marked   |
| open           | Menu open via Click / Enter / Space; arrow keys navigate         |
| searchable     | Filter input filters items as user types                         |
| loading        | Trigger shows current; menu shows skeleton list                  |
| empty          | `orgs.length === 0` → menu shows "Create your first organization" |

## Accessibility
- Trigger is a real `<button>` with `aria-haspopup="menu"` and `aria-expanded`
- Menu items render as `role="menuitem"` via `Menu`
- Current org marked with `aria-current="true"`
- Escape closes; focus returns to the trigger

## Tokens
- Inherits trigger tokens from `Button`, surface from `Menu`
- Adds: `--org-switcher-trigger-gap`, `--org-switcher-menu-min-width`

## Do / Don't
```tsx
// DO
<OrgSwitcher current={current} orgs={orgs} onSelect={switchOrg} onCreate={openCreate} />

// DON'T — raw button + custom menu
<button onClick={open}><img/> {current.name} ▼</button>

// DON'T — Select for orgs (loses avatar + create flow)
<Select value={current.id} options={orgOptions} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger renders avatar + current name and toggles the menu
- Selecting an org calls `onSelect` and closes the menu
- `onCreate` invoked from the create item
- Searchable mode filters orgs
- Loading shows skeleton items in the menu body
- Keyboard: Enter opens, arrows navigate, Escape closes, focus returns
- Forwards ref; spreads remaining props onto root
- axe-core passes in default and open
