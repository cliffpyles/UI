---
name: BulkActionBar
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-display, states]
uses: [Box, Button, Text]
replaces-raw: []
---

# BulkActionBar

> A sticky bar that appears when rows are selected, showing the count and the actions available across the selection.

## Purpose
BulkActionBar is the canonical surface for "you have N items selected — here is what you can do with them." It owns the sticky positioning, the selection-count copy, the clear-selection affordance, and the slot for caller-defined action buttons — so every list and table in the system communicates bulk state identically.

## When to use
- Below or above a `DataTable` when row selection is active
- A multi-select list where actions apply to the whole selection
- Email/inbox-style surfaces where multi-row operations are common

## When NOT to use
- A single-row action menu → use **RowActionsMenu**
- Toolbar actions that apply to the whole dataset (not selection-scoped) → use **DataTableToolbar**
- A confirm/cancel footer for a form → use a **Modal** footer

## Composition (required)
| Concern         | Use                                                    | Never                                |
|-----------------|--------------------------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" justify="between" gap="3" padding="2">` | hand-rolled flex/gap in CSS |
| Selection count | `Text size="body" weight="medium">` formatted via `formatNumber` | inline `Intl.NumberFormat`     |
| Clear button    | `Button variant="ghost" size="sm">`                    | raw `<button>`                       |
| Action buttons  | `Button` (caller-supplied, rendered into actions slot) | raw `<button>`                       |

## API contract
```ts
interface BulkActionBarProps extends HTMLAttributes<HTMLDivElement> {
  selectedCount: number;
  totalCount?: number;             // when set, copy reads "N of M selected"
  onClearSelection: () => void;
  clearLabel?: string;             // default "Clear selection"
  actions: ReactNode;              // slot for one or more <Button> elements
  sticky?: boolean;                // default true
}
```
Forwarded ref targets the root `<div>`. Remaining props are spread onto the root.

## Required states
| State            | Behavior                                                              |
|------------------|-----------------------------------------------------------------------|
| default          | Renders count + clear + actions; sticks to bottom (or top) of scroll container |
| zero selection   | Caller is responsible for not rendering the bar; component renders nothing if `selectedCount === 0` |
| with totalCount  | Copy reads "N of M selected"                                          |
| not sticky       | `sticky={false}` removes sticky positioning                            |

## Accessibility
- Root has `role="region"` with `aria-label="Bulk actions"` so it's announced as a landmark when it appears.
- `aria-live="polite"` so the selection count update is announced.
- Clear button has `aria-label` derived from `clearLabel`.
- Focus is NOT auto-stolen when the bar appears — caller decides.

## Tokens
- Inherits all tokens from `Box`, `Button`, `Text`
- Adds (component tier): `--bulk-action-bar-shadow`, `--bulk-action-bar-z`, `--bulk-action-bar-padding`

## Do / Don't
```tsx
// DO
<BulkActionBar
  selectedCount={selected.size}
  totalCount={rows.length}
  onClearSelection={clear}
  actions={<>
    <Button variant="secondary" onClick={archive}>Archive</Button>
    <Button variant="danger" onClick={remove}>Delete</Button>
  </>}
/>

// DON'T — bespoke sticky bar
<div className="sticky-bar">{count} selected <button>Delete</button></div>

// DON'T — inline number formatting
<span>{count.toLocaleString()} selected</span>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use `formatNumber`)
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- `onClick` on `<div>` or `<span>`
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- `selectedCount === 0` renders nothing
- `selectedCount > 0` renders count, clear button, and actions slot
- `totalCount` switches copy to "N of M selected"
- Clear button click invokes `onClearSelection`
- `sticky={false}` removes sticky positioning class
- Composition probe: `Button` resolves for the clear control
- Forwards ref; spreads remaining props onto root
- axe-core passes when visible
