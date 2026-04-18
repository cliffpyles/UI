---
name: CommandPalette
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [navigation-and-hierarchy]
uses: [Box, Modal, SearchInput, Menu, Text]
replaces-raw: []
---

# CommandPalette

> A keyboard-triggered modal that fuzzy-searches actions, navigation, and entities across the entire app.

## Purpose
CommandPalette is the universal "do anything" surface — bound to a global shortcut (typically ⌘K), it lets the user search for a destination, run a registered action, or jump to an entity without leaving the keyboard. The component owns the modal frame, the input wiring, the result list keyboard model (Up/Down/Enter), grouped sections, and recent/most-used ordering. Feature teams register commands; the palette renders them.

## When to use
- The single global "search and act" entry point on every page
- Any app where power users benefit from skipping mouse navigation
- Surfaces that need to expose actions, navigation, and entity lookup in one place

## When NOT to use
- A page-local search input → use **SearchInput** directly
- Non-keyboard primary navigation → use **CollapsibleSidebarNav**
- A simple action menu attached to a button → use **Menu** or **Dropdown**

## Composition (required)
| Concern               | Use                                          | Never                                         |
|-----------------------|----------------------------------------------|-----------------------------------------------|
| Frame layout          | `Modal` (centered, narrow, no chrome)        | raw `<dialog>` or fixed-position `<div>`      |
| Inner stack           | `Box direction="column">`                    | hand-rolled flex CSS                          |
| Search input          | `SearchInput autoFocus>`                     | raw `<input type="search">`                   |
| Results list          | `Menu` (with grouped sections)               | hand-rolled `<ul>` with manual focus model    |
| Group label           | `Text size="xs" color="secondary" weight="semibold">` | raw `<div>` with typography CSS      |
| Empty / hint copy     | `Text size="sm" color="secondary">`          | raw `<p>` with typography CSS                 |

## API contract
```ts
interface CommandItem {
  id: string;
  label: string;
  hint?: string;                  // shortcut or context
  icon?: ReactNode;
  group?: string;                 // section label
  keywords?: string[];            // fuzzy search aliases
  onRun: () => void;
}

interface CommandPaletteProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  commands: CommandItem[];
  recent?: string[];              // ids, ordered
  placeholder?: string;           // default "Type a command or search"
  emptyMessage?: ReactNode;
}
```

## Required states
| State           | Behavior                                                              |
|-----------------|-----------------------------------------------------------------------|
| closed          | Renders nothing; consumes the registered global shortcut              |
| open-empty-query| Recent commands rendered first; remaining grouped by `group`          |
| typing          | Results filtered by fuzzy match against `label` + `keywords`          |
| no-results      | `emptyMessage` (or default) replaces the result list                  |
| selected        | Up/Down moves highlight; Enter calls `onRun` and closes the palette   |
| dismissed       | Esc / backdrop click calls `onOpenChange(false)`                      |

## Accessibility
- Inherits modal trap and `aria-modal="true"` from `Modal`
- The `SearchInput` is `aria-controls` / `aria-activedescendant` paired with the result list
- Result list uses a `listbox` pattern via `Menu`'s wired roles
- Esc closes; focus returns to the previously focused element on close
- Recent / group labels are non-interactive and announced as group headings

## Tokens
- Inherits all surface tokens from `Modal`, input tokens from `SearchInput`, list tokens from `Menu`
- Adds (component tier): `--command-palette-max-width`, `--command-palette-result-max-height`, `--command-palette-group-gap`

## Do / Don't
```tsx
// DO
<CommandPalette open={open} onOpenChange={setOpen} commands={commands} recent={recentIds} />

// DON'T — bypass Modal
<div className="palette-overlay"><div className="palette">…</div></div>

// DON'T — raw input
<input type="search" placeholder="Search…" />

// DON'T — hand-rolled keyboard list
<ul onKeyDown={…}>{items.map(c => <li>{c.label}</li>)}</ul>
```

## Forbidden patterns (enforced)
- Hand-rolled `display: grid` or `display: flex` in `CommandPalette.css`
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `open` controls visibility; `onOpenChange(false)` fires on Esc and backdrop click
- Empty query renders `recent` first, then grouped commands
- Typing filters results; Up/Down moves the highlighted item; Enter runs `onRun`
- `no-results` state renders the empty message
- SearchInput receives focus on open; focus returns to opener on close
- Composition probes: `Modal`, `SearchInput`, and `Menu` all resolve in the rendered tree
- Forwards ref; spreads remaining props onto root
- axe-core passes when open
