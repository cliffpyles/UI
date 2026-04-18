---
name: HierarchicalTreeLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: []
uses: [Grid, Box, Button, Icon]
replaces-raw: []
---

# HierarchicalTreeLayout

> A page frame with an expandable sidebar tree on the left whose selection drives the main content region.

## Purpose
HierarchicalTreeLayout owns the chrome for hierarchical navigation surfaces — file trees, object explorers, taxonomy browsers, account hierarchies. It centralizes the sidebar/main grid, the expand/collapse model, the keyboard tree behavior (Arrow keys move focus, Right expands, Left collapses), and the contract that selecting a node renders its detail in the main region. Callers supply the tree data and node renderer; the layout owns frame, expansion state, and a11y.

## When to use
- A navigation tree that drives detail content (left sidebar + right main)
- Surfaces where users browse a deep hierarchy and pin context to a node
- Any explorer whose nodes have parent/child relationships

## When NOT to use
- A flat list of records — use **Table** or a list view
- Drill-down with breadcrumbs but no persistent tree — use **BreadcrumbDrillDownLayout**
- A two-pane list/detail without hierarchy — use **MasterDetailLayout**

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Grid` with named tracks `tree main`               | raw CSS Grid in stylesheet                  |
| Sidebar container    | `Box as="aside" display="flex" direction="column">`| raw `<aside>` with flex CSS                 |
| Tree node row        | `Box display="flex" align="center" gap>`           | hand-rolled flex CSS                        |
| Expand/collapse caret| `Button variant="ghost" size="sm">` + `Icon name="chevron-right">` | raw `<button>` toggling `<svg>`     |
| Node label container | `Box>` (label content slotted by caller)           | raw `<span>` with text CSS                  |
| Main region          | `Box as="section">`                                | raw `<section>` with padding CSS            |

The expand/collapse caret rotates via a token-driven CSS transform on the `Icon`; the layout never inlines an `<svg>`.

## API contract
```ts
interface TreeNode {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  meta?: ReactNode;                   // optional right-aligned content (count etc.)
}

interface HierarchicalTreeLayoutProps extends HTMLAttributes<HTMLDivElement> {
  nodes: TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  expandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  defaultExpandedIds?: string[];
  main: ReactNode;                    // detail region content
  sidebarWidth?: number;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Renders the root nodes; expanded nodes show their children                |
| selected     | Selected node row carries `aria-selected="true"` and the selection token  |
| expanded     | Caret rotates; child rows render with token-driven indent                 |
| keyboard     | ArrowUp/Down move focus; ArrowRight expands or moves to first child; ArrowLeft collapses or moves to parent |
| disabled     | Disabled nodes are skipped by keyboard navigation and not selectable       |

## Accessibility
- Root tree container has `role="tree"`; each node row has `role="treeitem"` with `aria-level`, `aria-expanded` (when it has children), and `aria-selected`.
- The sidebar is `<aside aria-label="Navigation">`.
- The main region is `<section aria-label="Selected item">` and exposes `aria-live="polite"` for selection-driven updates that should be announced.
- Expand/collapse triggers are real `Button`s with `aria-label` ("Expand {label}").

## Tokens
- Indent step: `--tree-indent`
- Row padding: `--tree-row-padding-{x|y}`
- Selection background: `--color-surface-selected`
- Caret rotation: `--duration-fast`
- Frame: `--tree-sidebar-width-default`
- Surface inherited from `Box` / `Grid`

## Do / Don't
```tsx
// DO
<HierarchicalTreeLayout
  nodes={tree}
  selectedId={sel}
  onSelect={setSel}
  main={<NodeDetail id={sel}/>}
/>

// DON'T — raw caret with inline svg
<button onClick={toggle}><svg>…</svg></button>

// DON'T — handle ArrowRight/Left manually with onKeyDown on a div
<div onKeyDown={…}>{rows}</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owner components
- `onClick` on `<div>` or `<span>`
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline `▲`, `▼`, `↑`, `↓` glyphs
- Inline `<svg>`
- Hand-rolled `display: grid` or `display: flex` in this layout's CSS
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders root nodes; expanding a node renders its children at the next indent step
- ArrowDown / ArrowUp move focus among visible rows
- ArrowRight expands a collapsed parent; ArrowLeft collapses an expanded parent
- Selecting a node fires `onSelect` and applies `aria-selected="true"`
- Disabled nodes are skipped by keyboard navigation and ignored by clicks
- Composition probe: `Grid`, at least one `Button`, and one `Icon` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with a multi-level sample tree
