---
name: MultiWorkspaceSwitcher
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, OrgSwitcher, Menu, SearchInput]
replaces-raw: []
---

# MultiWorkspaceSwitcher

> The top-level switcher that lets a user pivot between organizations and workspaces from anywhere in the app.

## Purpose
MultiWorkspaceSwitcher is the persistent top-of-shell control that exposes the user's organizations and the workspaces beneath each one. It composes the domain-level `OrgSwitcher` for the current-context label and a searchable `Menu` for the full list. By centralizing the search affordance, the org → workspace grouping, and the "create workspace" footer action, every product surface presents the same mental model for "where am I and where else can I go."

## When to use
- The top of `AppShell.header` for any multi-org / multi-workspace product
- Any place a user must be able to switch context without losing their current page
- Apps where the workspace count per user is large enough to require search

## When NOT to use
- Single-org products with a single workspace → omit entirely
- A user-account menu (avatar dropdown) → use a `UserChip` + `Menu`
- A primary navigation list → use **CollapsibleSidebarNav**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Box direction="row" align="center" gap>`    | hand-rolled flex CSS                          |
| Current-context label | `OrgSwitcher` as the trigger surface         | raw `<button>` showing the org name           |
| Popover list          | `Menu` (grouped by org)                      | hand-rolled list with manual focus            |
| Search                | `SearchInput` pinned at the top of the menu  | raw `<input type="search">`                   |
| Footer "Create" action| `Menu.Item` with leading `Icon`              | raw `<button>` appended to the menu           |

## API contract
```ts
interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface OrgGroup {
  id: string;
  name: string;
  avatar?: ReactNode;
  workspaces: Workspace[];
}

interface MultiWorkspaceSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  orgs: OrgGroup[];
  activeOrgId: string;
  activeWorkspaceId: string;
  onSelect: (orgId: string, workspaceId: string) => void;
  onCreateWorkspace?: () => void;
  searchPlaceholder?: string;     // default "Search workspaces"
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| closed          | Renders the trigger only (current org + workspace label)              |
| open            | Menu opens with search focused and full grouped list visible          |
| searching       | List filters by case-insensitive substring against workspace + org    |
| no-results      | Renders an empty hint inside the menu                                 |
| with-create     | "Create workspace" footer item rendered when `onCreateWorkspace` set  |

## Accessibility
- Trigger inherits `aria-haspopup="menu"` and `aria-expanded` from `OrgSwitcher`
- Menu uses a `menu` / `menuitem` role from `Menu`
- SearchInput's `aria-controls` references the menu list
- Active workspace is announced as the selected item via `aria-checked`/`aria-current`
- Esc closes the menu and returns focus to the trigger

## Tokens
- Inherits OrgSwitcher, Menu, and SearchInput tokens
- Adds (component tier): `--multi-workspace-switcher-menu-width`, `--multi-workspace-switcher-group-gap`, `--multi-workspace-switcher-search-padding`

## Do / Don't
```tsx
// DO
<MultiWorkspaceSwitcher
  orgs={orgs}
  activeOrgId={orgId}
  activeWorkspaceId={wsId}
  onSelect={switchTo}
  onCreateWorkspace={openCreate}
/>

// DON'T — skip OrgSwitcher and roll your own trigger
<button>{orgName} / {wsName}</button>

// DON'T — raw input for search
<input placeholder="Search…" />

// DON'T — render workspaces in a flat list with no group labels
<Menu>{allWorkspaces.map(w => <Menu.Item>{w.name}</Menu.Item>)}</Menu>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `MultiWorkspaceSwitcher.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger renders the active org + workspace label
- Opening the menu focuses the search input
- Typing filters workspaces across all orgs
- Selecting a workspace fires `onSelect(orgId, workspaceId)` and closes the menu
- "Create workspace" footer appears only when `onCreateWorkspace` is set
- Composition probes: `OrgSwitcher` is the trigger; `Menu` is the list; `SearchInput` is the search
- Forwards ref; spreads remaining props onto root
- axe-core passes when open and closed
