---
name: UserPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [states]
uses: [Box, Input, Popover, UserChip, Button]
replaces-raw: []
---

# UserPicker

> A searchable, async, multi-select picker for choosing users.

## Purpose
UserPicker is the canonical "assign / invite / mention" control — async-searchable user list with multi-select, selected `UserChip`s shown inline. It owns the search input, the popover-anchored result list, the selection model, and the loading/empty/error states so user selection looks identical wherever it appears.

## When to use
- Assigning one or more users to a record
- Inviting users to a project or team
- Filtering a list by participant

## When NOT to use
- A single-user inline reference → use **UserChip**
- Switching the active workspace → use **OrgSwitcher**
- A non-user record selector → use **Dropdown** or a domain-specific picker

## Composition (required)
| Concern         | Use                                              | Never                          |
|-----------------|--------------------------------------------------|--------------------------------|
| Internal layout | `Box display="flex" direction="column" gap="xs">` for trigger + popover body | hand-rolled flex CSS |
| Selected chips  | `Box display="flex" wrap="wrap" gap="2xs">` of `UserChip`s | hand-rolled flex CSS |
| Search input    | `Input>` (inside the popover)                    | raw `<input>`                  |
| Popover surface | `Popover>`                                       | hand-rolled positioned `<div>` |
| Each result row | `UserChip` + selection check via `Button variant="ghost">` row trigger | raw `<li>` with onClick |
| Clear / submit  | `Button variant="ghost" \| "primary">`           | raw `<button>`                 |

## API contract
```ts
interface UserPickerProps extends HTMLAttributes<HTMLDivElement> {
  selected: string[];                        // user ids
  onChange: (ids: string[]) => void;
  loadOptions: (query: string) => Promise<{ id: string; name: string; avatarUrl?: string; secondary?: string }[]>;
  placeholder?: string;
  max?: number;                              // selection cap
  loading?: boolean;
  error?: Error | null;
  emptyState?: ReactNode;
}
```

## Required states
| State          | Behavior                                                         |
|----------------|------------------------------------------------------------------|
| default        | Trigger shows selected `UserChip`s + "Add" affordance            |
| open           | Popover with search input and result list                        |
| loading        | Result list shows skeleton rows; input still typeable            |
| empty (query)  | "No matching users" via `EmptyState`-style copy                  |
| error          | Inline error inside the popover with retry affordance            |
| at max         | Further selection disabled with explanatory text                 |

## Accessibility
- Trigger is a real `<button>` with `aria-haspopup="listbox"` and `aria-expanded`
- Result list uses `role="listbox"`; rows use `role="option"` with `aria-selected`
- Arrow keys move focus through results; Enter toggles selection; Escape closes
- Selected chips are not removable via Backspace inside the input unless explicitly allowed

## Tokens
- Inherits tokens from `Input`, `Popover`, `UserChip`, `Button`
- Adds: `--user-picker-chip-gap`, `--user-picker-popover-min-width`

## Do / Don't
```tsx
// DO
<UserPicker selected={ids} onChange={setIds} loadOptions={searchUsers} />

// DON'T — raw input + custom list
<input onChange={…} /><ul>{results.map(u => <li onClick={…}/>)}</ul>

// DON'T — Select for async users (no chips, no async)
<Select multiple value={ids} options={…} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (`▲▼↑↓`)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Trigger shows selected `UserChip`s and toggles the popover
- Typing calls `loadOptions` and renders results as `UserChip` rows
- Selecting a row toggles inclusion in `selected` and calls `onChange`
- `loading`, empty, and `error` states render correctly
- `max` blocks further selection with messaging
- Keyboard: arrows navigate, Enter toggles, Escape closes, focus returns to trigger
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input`, `Popover`, `UserChip` resolve in DOM
- axe-core passes in default, open, loading, error
