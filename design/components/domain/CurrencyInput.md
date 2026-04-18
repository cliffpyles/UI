---
name: CurrencyInput
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Input, Select, Text]
---

# CurrencyInput

> A numeric input paired with a currency selector that emits a `{ amount, currency }` value.

## Purpose
CurrencyInput owns the wiring that ad-hoc currency fields always get wrong: locale-aware grouping while typing, the symbol-as-leading-addon contract, and the amount/currency pair as a single value. It composes `Input` for the number and `Select` for the currency code so that money entry is consistent everywhere it appears.

## When to use
- Any monetary input in a form (price, budget, transfer, threshold)
- Multi-currency entry where the user must pick a code alongside the amount
- Fields whose downstream value type is `Money` (amount + currency)

## When NOT to use
- Read-only display of money — use the **Currency** domain component
- Pure unitless numeric entry → use **Input** `type="number"` or **PercentageInput**
- Number with arbitrary unit → use **UnitInput**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" gap` for amount + currency | hand-rolled flex / margin in CSS |
| Numeric entry   | `Input` with `leadingAddon` symbol   | raw `<input type="number">`          |
| Currency code   | `Select`                             | raw `<select>`                       |
| Symbol / hint   | `Text`                               | raw styled `<span>`                  |

## API contract
```ts
interface MoneyValue {
  amount: number | null;
  currency: string;                     // ISO 4217 code
}

interface CurrencyInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value: MoneyValue;
  onChange: (next: MoneyValue) => void;
  currencies?: string[];                // default ["USD"]
  locale?: string;                      // default browser locale
  min?: number;
  max?: number;
  precision?: number;                   // default 2
  disabled?: boolean;
  error?: boolean;
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                |
|----------|-------------------------------------------------------------------------|
| empty    | `Input` empty; currency `Select` shows first/default code                |
| typed    | Amount displayed with locale grouping; symbol shown as `leadingAddon`    |
| invalid  | `error` on the `Input`; `aria-invalid` set                               |
| readonly | Both controls receive `readOnly`/`aria-readonly`                         |
| disabled | Both controls disabled                                                   |

## Accessibility
- The currency `Select` has its own accessible name ("Currency"), even when visually adjacent
- The `Input` accessible name describes the amount; the symbol addon is decorative (`aria-hidden`)
- Numeric formatting uses the `locale` prop — never hand-rolled

## Tokens
- Inherits all tokens from `Input`, `Select`
- Adds (component tier): `--currency-input-gap`

## Do / Don't
```tsx
// DO
<CurrencyInput value={{ amount: 1240, currency: "USD" }} onChange={setMoney} />

// DON'T — emit two scalars
<Input … /><Select … />

// DON'T — format inline
<Input value={amount.toLocaleString()} />
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString` (use the formatting utility)
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Typing an amount calls `onChange` with `{ amount, currency }`
- Changing currency calls `onChange` and updates the leading symbol
- Locale prop changes grouping (e.g. `de-DE` → `1.240,00`)
- `min`/`max`/`precision` enforced on entry
- `error` sets `aria-invalid`
- Forwards ref; spreads remaining props onto root
- Composition probe: `Input` and `Select` both render inside output
- axe-core passes in default, error, disabled
