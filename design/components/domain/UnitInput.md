---
name: UnitInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Select, Text]
---

# UnitInput

> A numeric input paired with a unit selector that emits a `{ value, unit }` pair.

## Purpose
UnitInput is the generalization of `CurrencyInput` for any quantity-with-unit: durations, distances, weights, data sizes, throughput. It composes `Input` for the number and `Select` for the unit so consumers stop attaching trailing-text addons by hand and stop emitting two scalars where a single value belongs.

## When to use
- Numeric entry where the unit is part of the value (5 minutes vs 5 hours)
- Settings whose downstream API expects `{ amount, unit }` or a normalized form
- Forms where unit choice should be constrained to a known set

## When NOT to use
- Money entry → use **CurrencyInput**
- Bounded percentage → use **PercentageInput**
- Unitless numeric fields → use **Input** `type="number"`

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" gap` for amount + unit | hand-rolled flex / padding in CSS |
| Numeric entry   | `Input` (`type="number"`)            | raw `<input>`                        |
| Unit selector   | `Select`                             | raw `<select>` or button group       |
| Helper / error  | `Text`                               | raw styled `<span>`                  |

## API contract
```ts
interface UnitValue<U extends string = string> {
  value: number | null;
  unit: U;
}

interface UnitInputProps<U extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: UnitValue<U>;
  onChange: (next: UnitValue<U>) => void;
  units: { value: U; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  error?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| empty    | `Input` empty; default unit shown in `Select`                              |
| typed    | Number rendered with `precision`; unit visible alongside                   |
| invalid  | `error` true → `aria-invalid` on input; `Text color="error"` may show msg  |
| readonly | Both controls receive `readOnly`/`aria-readonly`                           |
| disabled | Both controls disabled                                                     |

## Accessibility
- `Select` has its own accessible name ("Unit") even when visually adjacent
- Numeric `Input` reflects `min`/`max`/`step` for assistive tech
- Unit changes do NOT silently rescale the numeric value — that is a consumer concern

## Tokens
- Inherits all tokens from `Input`, `Select`, `Text`
- Adds (component tier): `--unit-input-gap`

## Do / Don't
```tsx
// DO
<UnitInput value={{ value: 5, unit: "min" }} onChange={setDuration}
           units={[{ value: "min", label: "minutes" }, { value: "hr", label: "hours" }]} />

// DON'T — emit two scalars
<Input … /><Select … />

// DON'T — render the unit as a styled span
<Input trailingAddon={<span style={{ color: "#999" }}>{unit}</span>} />
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
- Typing fires `onChange` with `{ value, unit }`
- Changing unit fires `onChange` with the new unit and prior value
- `min`/`max`/`step`/`precision` enforced on the input
- `error` sets `aria-invalid`
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input` and `Select` both render inside output
- axe-core passes in default, error, disabled
