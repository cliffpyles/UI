---
name: QueryBuilderLayout
tier: layout
level: 6
status: stable
since: 0.7.0
patterns: [filtering-and-search]
uses: [Box, QueryExpressionNode, Button]
replaces-raw: []
---

# QueryBuilderLayout

> A nested AND/OR condition builder that lets users compose precise filter expressions visually.

## Purpose
QueryBuilderLayout owns the page-or-panel frame for visual query construction: the root group, indented child groups, the Add-condition / Add-group affordances, the Clear / Apply footer, and the keyboard model for traversing the tree. Each node is a `QueryExpressionNode` (domain component); the layout owns rhythm, indentation tokens, footer placement, and the overall a11y wiring.

## When to use
- Filter UIs that must express compound boolean logic (e.g. (A AND B) OR (C AND NOT D))
- Saved-search builders, alert-rule editors, segment definitions
- Power-user surfaces where chip-only filters are insufficient

## When NOT to use
- Simple categorical filtering — use **FacetedSearchLayout** or **FilterBarLayout**
- A single search string — use **SearchInput**
- A wizard with linear steps — use a stepper layout

## Composition (required)
| Concern              | Use                                                | Never                                       |
|----------------------|----------------------------------------------------|---------------------------------------------|
| Frame layout         | `Box display="flex" direction="column">`           | raw `<div>` with flex CSS                   |
| Tree node            | `QueryExpressionNode` (one per condition/group)    | raw `<div>` with rule CSS                   |
| Indent rhythm        | `Box>` with token-driven left-padding              | hardcoded indentation values                |
| Add-condition button | `Button variant="ghost" size="sm">`                | raw `<button>`                              |
| Add-group button     | `Button variant="ghost" size="sm">`                | raw `<button>`                              |
| Footer actions       | `Box display="flex" justify="end" gap>` of `Button`s | hand-rolled flex CSS                      |

The expression tree is supplied as data; the layout renders one `QueryExpressionNode` per item and owns the indent/connector visuals via tokens only.

## API contract
```ts
type QueryConnector = "and" | "or";

interface QueryNode {
  id: string;
  kind: "condition" | "group";
  connector?: QueryConnector;
  children?: QueryNode[];
  payload?: unknown;                  // delegated to QueryExpressionNode
}

interface QueryBuilderLayoutProps extends HTMLAttributes<HTMLDivElement> {
  root: QueryNode;
  onChange: (next: QueryNode) => void;
  onApply?: () => void;
  onClear?: () => void;
  applyLabel?: string;                // default "Apply"
  clearLabel?: string;                // default "Clear"
  readOnly?: boolean;
}
```

## Required states
| State        | Behavior                                                                  |
|--------------|---------------------------------------------------------------------------|
| default      | Renders the root group with its child nodes; Apply/Clear in the footer    |
| empty        | Root with no children → only the Add-condition / Add-group buttons render |
| readonly     | All inputs and add/remove buttons are disabled; Apply/Clear hidden        |
| nested       | Child groups indent by the indent token; connectors render between siblings |
| invalid      | A node may render an inline error via `QueryExpressionNode`; layout sets `aria-invalid` |

## Accessibility
- Root renders as `<div role="group" aria-label="Query builder">`.
- Each group is itself `role="group"` with an `aria-label` reflecting its connector ("All of:", "Any of:").
- Tab order traverses condition controls first, then the per-group Add buttons, then the footer.
- Tree depth is reflected via `aria-level` on each node.

## Tokens
- Indent step: `--query-builder-indent`
- Node gap: `--query-builder-node-gap`
- Connector color: `--color-border-muted`
- Footer padding: `--query-builder-footer-padding-{x|y}`
- Surface inherited from `Box`

## Do / Don't
```tsx
// DO
<QueryBuilderLayout
  root={tree}
  onChange={setTree}
  onApply={apply}
  onClear={clear}
/>

// DON'T — hand-rolled rule rows
<div className="rule">
  <select>…</select><input/><button>x</button>
</div>

// DON'T — bypass QueryExpressionNode for "just one rule"
<input placeholder="value"/>
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
- Renders one `QueryExpressionNode` per node in `root`
- Add-condition appends a condition node and fires `onChange` with the new tree
- Add-group appends a nested group; the new group renders indented one step
- `readOnly={true}` disables all node controls and hides Apply/Clear
- Footer Apply / Clear `Button`s wire to `onApply` / `onClear`
- Composition probe: at least one `QueryExpressionNode` and one `Button` resolve in the rendered output
- Forwards ref; spreads remaining props onto the root element
- axe-core passes with a multi-level sample tree
