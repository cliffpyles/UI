---
name: PercentageInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Text]
---

# PercentageInput

> A numeric input bounded to 0-100 with a `%` suffix and consistent emit semantics.

## Purpose
PercentageInput owns two things every team gets wrong: bounding to 0-100 by default, and the user-facing/value-shape contract (does `25` mean 25% or 0.25?). The component standardizes both — the user types an integer-or-decimal in `[0, 100]`, and the value is emitted as a number on the same scale (or as a fraction in `[0, 1]` when `valueScale="fraction"`).

## When to use
- Discount, completion, allocation, and threshold fields
- Any percentage entry that should not exceed 100 or drop below 0
- Settings expressed as a share of a whole

## When NOT to use
- Currency entry → use **CurrencyInput**
- Numeric entry with arbitrary unit → use **UnitInput**
- Unbounded ratios or multipliers (e.g. 1.5x) → use plain `Input` `type="number"`

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" align="center" gap` for input + suffix | hand-rolled flex / padding in CSS |
| Numeric entry   | `Input` with `trailingAddon` for `%` | raw `<input type="number">`          |
| Suffix glyph    | `Text` rendering `%`                 | raw styled `<span>`                  |

## API contract
```ts
type PercentScale = "percent" | "fraction";

interface PercentageInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number | null;                 // null when empty
  onChange: (next: number | null) => void;
  valueScale?: PercentScale;            // default "percent" (0-100); "fraction" → 0-1
  min?: number;                         // default 0
  max?: number;                         // default 100
  precision?: number;                   // default 0
  disabled?: boolean;
  error?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                    |
|----------|-----------------------------------------------------------------------------|
| empty    | `Input` empty; `value === null`                                              |
| valid    | Number within `[min, max]`; `%` suffix shown via `Text`                      |
| invalid  | `error` true → `aria-invalid` on input; entry above `max` clamps on commit   |
| disabled | Input disabled                                                               |

## Accessibility
- `Input` accessible name describes the percent meaning ("Discount, percent")
- `%` suffix is decorative; the visible text suffix is `aria-hidden`
- `min`/`max` reflected as `aria-valuemin`/`aria-valuemax` on the underlying input
- `error` sets `aria-invalid="true"`

## Tokens
- Inherits all tokens from `Input`, `Text`
- Adds (component tier): `--percentage-input-suffix-color`

## Do / Don't
```tsx
// DO
<PercentageInput value={discount} onChange={setDiscount} />
<PercentageInput value={share} onChange={setShare} valueScale="fraction" />

// DON'T — let users type 250
<Input type="number" max={9999} />

// DON'T — render the suffix as a raw span
<span className="suffix">%</span>
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
- Typing within range fires `onChange` with the parsed number
- Entry above `max` clamps on commit (blur)
- `valueScale="fraction"` emits `0.25` when user types `25`
- Empty input emits `null`
- `error` sets `aria-invalid`
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input` and `Text` both render inside output
- axe-core passes in default, error, disabled
