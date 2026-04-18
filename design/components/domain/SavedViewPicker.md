---
name: SavedViewPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: []
uses: [Box, Menu, Button, Text]
replaces-raw: []
---

# SavedViewPicker

> A dropdown for switching between saved configurations of filters, sorts, and visible columns.

## Purpose
SavedViewPicker is the "view switcher" at the top of a list or table — "All issues", "My issues", "Open last 30 days", etc. It owns the trigger that displays the active view, the list of available views, the visual indication of unsaved changes, and the menu actions for save/save-as/rename/delete. It does not own the underlying filter/sort/column state; it only emits selection and management intents that the surrounding view manager applies.

## When to use
- A saved-view switcher above a table, board, or list
- Persona-style presets in a dashboard ("Sales view", "Engineering view")
- Anywhere a complex filter+sort+column configuration must round-trip

## When NOT to use
- Selecting a single field to filter by — use **FilterPicker**
- Picking a value for a form — use **Select**
- A simple "sort by" picker — use **Menu** or **Select** directly
- Switching between application-level navigation destinations — use a real nav

## Composition (required)
| Concern              | Use                                                              | Never                                              |
|----------------------|------------------------------------------------------------------|----------------------------------------------------|
| Internal layout      | `Box direction="row" align="center" gap="2"` for trigger contents | hand-rolled flex in `.css`                        |
| Trigger              | `Button variant="ghost"` with leading icon and trailing chevron  | raw `<button>` with manual aria-expanded wiring    |
| View list            | `Menu` with `Menu.Item`, `Menu.Group`, `Menu.Separator`          | raw `<div role="menu">`                            |
| View labels          | `Text size="sm">` with secondary `Text` for "Modified" indicator | raw `<span>` with font CSS                         |

## API contract
```ts
interface SavedView {
  id: string;
  label: string;
  scope?: "personal" | "shared";
  isDefault?: boolean;
}

interface SavedViewPickerProps extends HTMLAttributes<HTMLDivElement> {
  views: SavedView[];
  activeId: string;
  dirty?: boolean;                              // active view has unsaved changes
  onSelect: (id: string) => void;
  onSave?: () => void;                          // save changes to the active view
  onSaveAs?: (label: string) => void;           // create a new view from current state
  onRename?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
}
```
The component forwards its ref to the trigger element and spreads remaining props onto the root wrapper.

## Required states
| State            | Behavior                                                                 |
|------------------|--------------------------------------------------------------------------|
| default          | Trigger displays the active view's label                                  |
| dirty            | Trigger displays a "Modified" indicator; "Save" item enabled in menu      |
| open             | Menu portals via `Popover`; views grouped by scope (personal/shared)      |
| renaming         | An inline rename affordance appears in the menu; Escape cancels           |
| deleting         | Confirmation is the caller's responsibility; component only emits intent  |
| disabled         | Trigger is non-interactive                                                |

## Accessibility
- Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`
- Active view marked with `aria-current="true"` in the menu
- "Modified" indicator is visible text, not color alone
- Escape closes the menu and returns focus to the trigger

## Tokens
- Inherits all surface and spacing tokens from `Menu`, `Popover`, and `Button`
- Adds: `--saved-view-trigger-gap`
- No component-specific colors beyond the dirty indicator using `--color-status-warning-fg`

## Do / Don't
```tsx
// DO
<SavedViewPicker
  views={views}
  activeId={current}
  dirty={hasUnsavedChanges}
  onSelect={switchView}
  onSave={persist}
  onSaveAs={createView}
/>

// DON'T — hand-rolled menu
<button onClick={...}>{label}</button>
{open && <ul>...</ul>}

// DON'T — using SavedViewPicker for value selection in a form
<SavedViewPicker views={[…]} activeId={…} onSelect={setFormValue}/>   // use Select
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>` (use `Icon`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger renders the active view's label and "Modified" indicator when `dirty`
- `onSelect` fires with the chosen view id and closes the menu
- "Save", "Save as", "Rename", "Delete" emit their respective callbacks
- Active view is marked with `aria-current="true"`
- Personal vs shared views render in distinct groups
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Menu` and `Button` render the surface and trigger
- axe-core passes in closed, open, and dirty states
