---
name: OperatorSelect
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search]
uses: [Box, Select]
replaces-raw: []
---

# OperatorSelect

> A select that lists the operators valid for a given field type ("is", "contains", "before", "between", …).

## Purpose
OperatorSelect translates a field's data type into the appropriate operator vocabulary. Text fields offer "contains / does not contain / starts with"; numeric fields offer "= / ≠ / < / > / between"; date fields offer "before / after / between / in the last"; user fields offer "is / is not / is any of". It owns the per-type operator catalog and the default selection for a given type. The chrome is provided entirely by `Select`.

## When to use
- Inside a query builder row, between the field picker and the value input
- Anywhere the operator vocabulary depends on the bound field's type
- Whenever you'd otherwise hardcode an operator list per call site

## When NOT to use
- A generic value `<select>` — use **Select**
- Picking the field itself — use **FilterPicker**
- Picking the value — use **ValueInput**
- Composing the whole expression tree — use **QueryExpressionNode**

## Composition (required)
| Concern             | Use                                                              | Never                                              |
|---------------------|------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" align="center"` (typically a single `Select`) | hand-rolled flex in `.css`                       |
| Operator dropdown   | `Select size="sm">` with options driven by `fieldType`           | raw `<select>` or hand-rolled menu                 |

## API contract
```ts
type FieldType = "text" | "number" | "date" | "user" | "enum" | "boolean";

type Operator =
  | "eq" | "neq"
  | "lt" | "lte" | "gt" | "gte"
  | "between"
  | "contains" | "not_contains" | "starts_with" | "ends_with"
  | "before" | "after" | "in_last"
  | "is_any_of" | "is_none_of"
  | "is_empty" | "is_not_empty";

interface OperatorSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  fieldType: FieldType;
  value: Operator;
  onChange: (op: Operator) => void;
  size?: "sm" | "md";                        // default "sm"
  disabled?: boolean;
  /** Overrides the default operator catalog for a field type */
  operators?: Operator[];
}
```
The component forwards its ref to the underlying `Select` and spreads remaining props onto the root wrapper.

## Required states
| State            | Behavior                                                              |
|------------------|-----------------------------------------------------------------------|
| default          | Renders the operator catalog for `fieldType`; `value` shown            |
| switched type    | When `fieldType` changes, `value` is reconciled to the closest valid operator |
| custom catalog   | `operators` prop overrides the default catalog                         |
| disabled         | `Select` disabled state; trigger is non-interactive                    |

## Accessibility
- All ARIA semantics inherited from `Select` (`role="combobox"`, `aria-expanded`, listbox/option roles)
- The component itself does not add labels — the parent (typically `QueryExpressionNode`) provides one
- Operator labels are localized strings, never raw symbols ("equals" vs "=") to ensure screen-reader clarity

## Tokens
- Inherits all chrome tokens from `Select`
- No component-specific tokens

## Do / Don't
```tsx
// DO
<OperatorSelect fieldType="text" value={op} onChange={setOp}/>

// DO — custom catalog
<OperatorSelect fieldType="number" operators={["eq","between"]} value="eq" onChange={setOp}/>

// DON'T — hardcoded list per call site
<Select options={["contains","starts with"]} .../>

// DON'T — raw select
<select onChange={...}><option>=</option></select>
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
- Each `fieldType` exposes the expected default catalog
- Changing `fieldType` reconciles `value` to a valid operator
- `operators` prop overrides the default catalog
- `onChange` fires with the chosen operator
- Disabled state blocks interaction
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Select` renders the trigger and listbox
- axe-core passes in default and disabled
