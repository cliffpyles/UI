---
name: FormField
tier: composite
level: 4
status: stable
since: 0.4.0
patterns: [data-entry]
uses: [Box, Text]
replaces-raw: ["<label>", "<div role=\"alert\">"]
---

# FormField

> A labeled wrapper that links a form control to its label, hint, and error messaging.

## Purpose
FormField owns the wiring that every form input needs and most teams get wrong: a stable id linking `<label htmlFor>` to the input's `id`, `aria-describedby` pointing at the hint or error, and `aria-invalid` flipping in error state. Callers compose any base input (`Input`, `Select`, `Checkbox`, `Textarea`) as the child; FormField does not own the control itself. This keeps inputs reusable outside of forms and forms consistent across inputs.

## When to use
- Any labeled form control on a page, settings panel, or modal form
- Inputs that need a hint, helper text, or validation message
- Required/optional field indication

## When NOT to use
- A plain visual label with no associated control — use `Text as="label">` directly
- Toggle switches where the label is intrinsic to the control — use **Toggle**'s built-in label prop
- Filter-bar inline inputs with no visible label — use the input directly with `aria-label`
- Multi-field groupings (date range, address) — wrap in a `<fieldset>` with `<legend>`; one FormField per logical control

## Composition (required)
| Concern         | Use                                        | Never                                     |
|-----------------|--------------------------------------------|-------------------------------------------|
| Vertical layout | `Box display="flex" direction="column" gap` | hand-rolled `display: flex` in CSS       |
| Label text      | `Text as="label">`                         | raw styled `<label>` with typography CSS  |
| Required marker | `Text size="xs" color="secondary">`        | inline `<span>` with hardcoded color      |
| Hint text       | `Text size="sm" color="secondary">`        | raw `<div>` with typography styling       |
| Error text      | `Text size="sm" color="error" role="alert">` | raw `<div role="alert">`                |
| Form control    | Caller provides `Input`/`Select`/`Checkbox`/`Textarea` as children | reimplementing input markup inside FormField |

## API contract
```ts
interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;                // required visible label
  htmlFor?: string;                // explicit id override; auto-generated otherwise
  error?: ReactNode;               // when truthy, switches to error state
  hint?: ReactNode;                // suppressed when `error` is present
  required?: boolean;              // appends "(required)" via Text, sets aria-required on child
  children: ReactNode;             // exactly one form control element
}
```
The component clones its single child to inject `id`, `aria-describedby`, and `aria-invalid`. It does not accept multiple children — wrap composite inputs (e.g. an input + adornment) in their own component first.

## Required states
| State    | Behavior                                                                       |
|----------|--------------------------------------------------------------------------------|
| default  | Label + control rendered; no described-by                                      |
| hint     | Hint `Text` rendered below control; `aria-describedby` points at hint id       |
| error    | Error `Text` replaces hint; `aria-describedby` points at error id; `aria-invalid="true"` on the child |
| required | "(required)" appended via `Text`; `aria-required="true"` propagated to child   |
| disabled | Disabled state lives on the child input — FormField has no disabled prop       |

## Accessibility
- Label is wired via `htmlFor`/`id`. If the child already has an `id`, it is preserved; otherwise a `useId` value is generated.
- Error and hint ids are derived from the field id and exposed through `aria-describedby`.
- Error message uses `role="alert"` so it is announced when it appears.
- Required state must be communicated as text "(required)", not just an asterisk (per data-entry pattern).

## Tokens
- Layout gap: `--form-field-gap`
- Label color: inherits from `Text` semantic color tokens
- Error color: `--color-text-error`
- No component-specific colors, radii, or shadows

## Do / Don't
```tsx
// DO
<FormField label="Email" required hint="We'll never share it" error={errors.email}>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</FormField>

// DON'T — reimplementing label/error styling
<div className="my-field">
  <label className="bold-label">Email</label>
  <input />
  <div style={{ color: "red" }}>Required</div>
</div>

// DON'T — multiple children break id wiring
<FormField label="Name">
  <Input name="first" />
  <Input name="last" />
</FormField>
```

## Forbidden patterns (enforced)
- Raw styled `<label>`, `<p>`, `<span>` for label/hint/error text — use `Text`
- Hand-rolled flex CSS for vertical stack — use `Box`
- Owning the input markup (no `<input>`, `<select>`, `<textarea>` inside this component)
- Hardcoded color, spacing, font-size values
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Label clicks focus the child input (htmlFor/id wiring)
- `error` sets `aria-invalid="true"` and `aria-describedby` on the child
- `hint` is suppressed when `error` is present
- `required` appends "(required)" text and sets `aria-required` on the child
- Forwards ref; spreads remaining props onto root
- Composition probe: `Text` renders the label; `Box` is the root layout
- axe-core passes in default, hint, error, required combinations
