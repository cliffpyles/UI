---
name: CategoryPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Menu, Button, Text]
---

# CategoryPicker

> Hierarchical category selector that lets users drill into nested taxonomies and pick a leaf or branch.

## Purpose
CategoryPicker owns the interaction model for choosing a value from a tree-shaped taxonomy (product categories, account hierarchies, ledger codes). It surfaces the currently-selected path as breadcrumbs and lets the user navigate up or down the tree without losing context. Without it, every consumer reinvents collapsible trees, breadcrumbs, and keyboard nav inconsistently.

## When to use
- Picking a single category from a multi-level taxonomy (e.g. "Electronics → Audio → Headphones")
- Forms where the value space is too large for a flat `Select` but small enough to browse
- Settings where the path itself is meaningful and should be visible after selection

## When NOT to use
- Flat option lists → use **Select**
- Free-text tag entry → use **TagInput**
- Multi-select across siblings → use a tree-style multi-picker (out of scope)

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" gap` for trigger row; `Box direction="column"` for menu sections | hand-rolled flex/padding in CSS |
| Trigger control | `Button variant="secondary"`         | raw `<button>` with chevron CSS      |
| Drill-down panel| `Menu` (with submenus per level)     | bespoke popover with manual focus    |
| Breadcrumb / path text | `Text`                        | raw styled `<span>`                  |
| Empty branch    | `Text color="secondary"`             | inline string with hardcoded color   |

## API contract
```ts
interface CategoryNode {
  id: string;
  label: string;
  children?: CategoryNode[];
}

interface CategoryPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: CategoryNode[];
  value: string | null;                 // selected node id
  onChange: (id: string, path: CategoryNode[]) => void;
  placeholder?: string;                 // default "Select category"
  allowBranchSelection?: boolean;       // default false; only leaves are selectable
  disabled?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                    |
|----------|-----------------------------------------------------------------------------|
| empty    | Trigger shows `placeholder` via `Text color="secondary"`                    |
| selected | Trigger shows the resolved path joined with " / "                           |
| open     | `Menu` is open at the current level; arrow keys navigate, Enter selects     |
| disabled | Trigger disabled; menu cannot open                                          |

## Accessibility
- Trigger has `aria-haspopup="menu"` and `aria-expanded` reflecting open state
- `Menu` provides roving tabindex, arrow-key nav, and Esc-to-close
- The selected path must be readable as text (not only color/icon)
- Submenu open/close is announced via `aria-expanded` on parent items

## Tokens
- Inherits all tokens from `Button` and `Menu`
- Adds (component tier): `--category-picker-path-separator-color`

## Do / Don't
```tsx
// DO
<CategoryPicker options={tree} value={catId} onChange={setCat} />

// DON'T — render a hand-rolled tree
<div className="tree">{tree.map(renderNode)}</div>

// DON'T — bypass Menu and roll a popover
<Popover><ul role="tree">…</ul></Popover>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders placeholder when `value` is null
- Renders resolved path when value matches a leaf
- Drilling into a branch shows its children; selecting a leaf calls `onChange` with id + path
- `allowBranchSelection` enables selecting non-leaf nodes
- Keyboard: ArrowDown opens, Arrow keys navigate, Enter selects, Esc closes
- Forwards ref; spreads remaining props onto root
- Composition probe: `Menu` and `Button` both render inside output
- axe-core passes in default, open, selected, disabled
