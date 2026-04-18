---
name: QueryExpressionNode
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search]
uses: [Box, OperatorSelect, ValueInput, Button]
replaces-raw: []
---

# QueryExpressionNode

> A recursive node in an AND/OR query tree — either a single condition or a group of nested nodes.

## Purpose
QueryExpressionNode is the building block of an advanced query builder. A leaf node is `field operator value`; a group node is `AND/OR` joining child nodes. It owns the toggle between leaf and group, the AND/OR conjunction selector, the add-condition / add-group / remove buttons, and the recursion into nested groups. Field selection uses the parent's bound field metadata; operator and value editing delegate entirely to `OperatorSelect` and `ValueInput`.

## When to use
- Advanced query builders ("Show records where … AND (… OR …)")
- Saved-search definitions with nested logic
- Programmatic filter authoring in admin/analytics tools

## When NOT to use
- Single inline filters with no nesting — use **FilterChip** + **FilterPicker**
- Free-form text search — use **SearchInput**
- Visual faceted filtering — compose **FilterChip**s instead

## Composition (required)
| Concern             | Use                                                                  | Never                                              |
|---------------------|----------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="column" gap="2"` with nested `Box direction="row"`    | hand-rolled `display: flex` / `gap` in `.css`      |
| Operator selection  | `OperatorSelect` (per-type catalog)                                  | raw `<select>` or duplicated operator lists        |
| Value entry         | `ValueInput` (per-type input)                                        | raw `<input>` / `<select>`                         |
| Add / remove / group toggle controls | `Button variant="ghost" size="sm"` with `Icon`     | raw `<button>` with inline `<svg>`                 |
| Conjunction toggle  | `Button` group rendered as a segmented control                       | raw `<input type="radio">` group                   |

## API contract
```ts
type Conjunction = "AND" | "OR";

interface LeafNode {
  type: "leaf";
  fieldId: string;
  operator: string;
  value: unknown;
}

interface GroupNode {
  type: "group";
  conjunction: Conjunction;
  children: ExpressionNode[];
}

type ExpressionNode = LeafNode | GroupNode;

interface QueryExpressionNodeProps extends HTMLAttributes<HTMLDivElement> {
  node: ExpressionNode;
  fields: FilterField[];                   // schema for the value/operator inputs
  onChange: (next: ExpressionNode) => void;
  onRemove?: () => void;                   // when omitted, this is the root
  depth?: number;                          // controls indentation; default 0
  maxDepth?: number;                       // refuses further nesting beyond this depth
}
```
The component forwards its ref to the root container and spreads remaining props onto it.

## Required states
| State              | Behavior                                                                 |
|--------------------|--------------------------------------------------------------------------|
| leaf               | Renders field display, `OperatorSelect`, `ValueInput`, remove button      |
| group              | Renders conjunction toggle and a list of children, each a recursive node  |
| nested             | Children indented by `depth`; group surface visually distinct             |
| invalid leaf       | When `value` does not satisfy the field type, the row is flagged          |
| empty group        | Renders an "Add condition" affordance only                                |
| at max depth       | "Add group" affordance is hidden; only "Add condition" remains            |

## Accessibility
- Root: `role="group"` with `aria-label` describing the node ("Filter group: AND, 3 conditions")
- Conjunction toggle: implemented as a `Button` group with `role="radiogroup"` and `aria-checked` per option
- Remove buttons: `aria-label="Remove condition"` / `"Remove group"`
- Keyboard: Tab moves through controls in reading order; nested groups are reachable in DOM order

## Tokens
- Inherits all chrome from `OperatorSelect`, `ValueInput`, and `Button`
- Adds: `--query-node-indent`, `--query-node-row-gap`, `--query-group-surface-bg`
- No component-specific text colors

## Do / Don't
```tsx
// DO
<QueryExpressionNode
  node={tree}
  fields={schema}
  onChange={setTree}
/>

// DON'T — hand-rolled recursion with raw inputs
<div>
  <select>...</select>
  <input/>
  <button>×</button>
</div>

// DON'T — duplicating operator vocabulary
<select><option>contains</option><option>starts with</option></select>
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
- Leaf node renders field, operator, and value controls
- Changing operator or value invokes `onChange` with the updated subtree
- Group node renders conjunction toggle and recursive children
- "Add condition" and "Add group" mutate the subtree correctly
- `onRemove` fires for non-root nodes only
- `maxDepth` hides the "Add group" affordance at the limit
- Forwards ref; spreads remaining props onto the root
- Composition probe: `OperatorSelect`, `ValueInput`, `Button` all render
- axe-core passes for leaf, group, and nested-group structures
