---
name: ValueInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [filtering-and-search, data-entry]
uses: [Box, Input, Select]
replaces-raw: []
---

# ValueInput

> A polymorphic input that adapts to the bound field's type — text, number, date, user, multi-select.

## Purpose
ValueInput is the value half of a `field operator value` triple. It picks the right input for the given field type: `Input` for text and number, a date control for dates, a `Select` for enums, a `UserPicker` for user fields, a multi-select for `is_any_of` operators. It owns the dispatch from `(fieldType, operator)` to the concrete input component, and the value-shape contract (string vs number vs Date vs string[] vs User[]). It does not own validation messaging — that is provided by the surrounding `FormField` or `QueryExpressionNode`.

## When to use
- Inside `QueryExpressionNode` as the value editor for a leaf condition
- In any filter UI where the value editor must adapt to the chosen field
- Anywhere you'd otherwise switch on `fieldType` to pick an input component

## When NOT to use
- A static text or number input — use **Input** directly
- A static option list — use **Select** directly
- A user picker outside a query context — use **UserPicker** directly
- A date range picker — use **SmartDateRange**

## Composition (required)
| Concern             | Use                                                                    | Never                                              |
|---------------------|------------------------------------------------------------------------|----------------------------------------------------|
| Internal layout     | `Box direction="row" align="center" gap="2"` when an operator (e.g. `between`) requires two inputs | hand-rolled flex in `.css`        |
| Text / number value | `Input type="text" \| "number">`                                       | raw `<input>`                                      |
| Enum value          | `Select`                                                                | raw `<select>`                                     |
| User value          | `UserPicker` (peer domain component)                                    | raw avatar list with `onClick`                     |
| Date value          | `Input type="date">`                                                    | raw `<input type="date">`                          |

## API contract
```ts
type FieldType = "text" | "number" | "date" | "user" | "enum" | "boolean";

interface ValueInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  fieldType: FieldType;
  operator: string;                          // e.g. "between" → renders two inputs
  value: unknown;                            // shape depends on fieldType
  onChange: (value: unknown) => void;
  options?: { value: string; label: string }[];   // required for "enum"
  size?: "sm" | "md";                        // default "sm"
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
}
```
The component forwards its ref to the underlying input element and spreads remaining props onto the root wrapper.

## Required states
| State              | Behavior                                                                 |
|--------------------|--------------------------------------------------------------------------|
| text / number      | Renders an `Input`; `value` is a `string`                                 |
| date               | Renders an `Input type="date"`; `value` is an ISO date string             |
| enum               | Renders a `Select`; `value` is a `string`; `options` required             |
| user               | Renders a `UserPicker`; `value` is a `User` or `User[]`                  |
| multi              | When operator is `is_any_of` / `is_none_of`, value is an array            |
| between            | Renders two inputs joined by "and"; value is a `[from, to]` tuple         |
| empty operator     | When operator is `is_empty` / `is_not_empty`, no input renders            |
| disabled / invalid | Forwarded to the underlying input                                         |

## Accessibility
- The component itself does not add a label — it is consumed inside `FormField` or a labeled query row
- When two inputs render (`between`), the second input's accessible name includes "End"
- `invalid` is forwarded as `aria-invalid="true"` on the underlying input
- Multi-value editors expose selected items as a list to assistive tech via the underlying component

## Tokens
- Inherits all chrome from `Input` and `Select`
- Adds: `--value-input-between-gap`
- No component-specific colors

## Do / Don't
```tsx
// DO
<ValueInput fieldType="text" operator="contains" value={v} onChange={setV}/>

// DO — between operator
<ValueInput fieldType="number" operator="between" value={[0, 100]} onChange={setRange}/>

// DON'T — switching on type at the call site
{type === "text" ? <Input/> : type === "enum" ? <Select/> : <UserPicker/>}

// DON'T — raw input
<input type="number" value={v} onChange={...}/>
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
- Each `fieldType` renders the expected underlying component
- `operator="between"` renders two inputs and emits a tuple
- `operator="is_empty"` / `"is_not_empty"` renders nothing
- `enum` requires `options` and renders them via `Select`
- `disabled` and `invalid` propagate to the underlying input
- Forwards ref; spreads remaining props onto the root
- Composition probe: `Input` and `Select` (and `UserPicker` for user fields) render as appropriate
- axe-core passes for text, number, date, enum, and between configurations
