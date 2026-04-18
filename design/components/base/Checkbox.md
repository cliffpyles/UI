---
name: Checkbox
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-entry]
uses: [Text, Icon]
replaces-raw: ["<input type=\"checkbox\">"]
---

# Checkbox

> A binary (or tri-state) selection control with an optional inline label and description.

## Purpose
Checkbox wraps the native `<input type="checkbox">` so every checkmark in the system shares the same control surface, focus ring, and indeterminate visual. The optional `label` / `description` slots make the common labeled case ergonomic without reaching for `FormField`, while still preserving native semantics (clicking the label toggles the input).

## When to use
- A single boolean choice ("I agree", "Remember me")
- One row of a multi-select list (a parent row in indeterminate state, children in checked/unchecked)
- A bulk-select header in a table — the indeterminate state communicates "some, not all"

## When NOT to use
- One of N mutually exclusive options → use **Radio** / **RadioGroup**
- An on/off setting that takes effect immediately → use **Toggle**
- A row of choices that needs a fieldset legend + error → wrap in **FormField** (composite)

## Composition (required)
| Concern             | Use                                | Never                              |
|---------------------|------------------------------------|------------------------------------|
| Native control      | Owns raw `<input type="checkbox">` | a `<div role="checkbox">` shim     |
| Label text          | `Text size="body">`                | raw styled `<span>`                |
| Description text    | `Text size="caption" color="secondary">` | raw styled `<span>`           |
| Check / dash glyph  | `Icon name="check"` / `name="minus"` | inline `<svg>` polylines           |

## API contract
```ts
interface CheckboxOwnProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;       // default false
  disabled?: boolean;            // default false
  label?: ReactNode;
  description?: ReactNode;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>,
       "type" | "checked" | "defaultChecked" | "onChange">;
```

## Required states
| State          | Behavior                                                          |
|----------------|-------------------------------------------------------------------|
| default        | Empty box, neutral border                                         |
| checked        | Filled background + check `Icon`                                  |
| indeterminate  | Filled background + dash `Icon`; sets `aria-checked="mixed"`      |
| disabled       | Desaturated visual; click suppressed                              |
| focus          | Visible focus ring on the control                                 |

## Accessibility
- Native input keeps full keyboard semantics (Space toggles).
- Indeterminate is set imperatively on the DOM node (not an HTML attribute) AND mirrored via `aria-checked="mixed"`.
- Wrapping `<label>` makes the visible label a click target; description text is associated via `aria-describedby` when present.

## Tokens
- Border: `--checkbox-border-{default|hover|checked|disabled}`
- Background: `--checkbox-background-{default|checked|disabled}`
- Icon color: `--checkbox-icon-color`
- Size: `--checkbox-size`
- Radius: `--radius-sm`
- Focus: `--shadow-focus-ring`

## Do / Don't
```tsx
// DO
<Checkbox label="Subscribe" description="Weekly digest" onChange={set} />
<Checkbox indeterminate aria-label="Select all" />

// DON'T — hand-rolled checkmark
<Checkbox /* … */>{checked && <svg>…</svg>}</Checkbox>

// DON'T — raw styled label
<Checkbox label={<span style={{ fontWeight: 600 }}>Subscribe</span>}/>
```

## Forbidden patterns (enforced)
- Inline `<svg>` for the check / dash — use `Icon`
- Raw styled `<span>` for label or description — use `Text`
- Hardcoded color, spacing, radius
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Default, checked, indeterminate, disabled render correctly
- `onChange` fires with the new boolean
- Indeterminate sets `aria-checked="mixed"`
- Clicking the label toggles the control
- Forwards ref to the native `<input>`; spreads remaining props
- axe-core passes in each state
