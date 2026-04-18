---
name: Select
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-entry]
uses: [Icon]
replaces-raw: ["<select>"]
---

# Select

> A native dropdown for choosing one option from a list of pre-defined values.

## Purpose
Select wraps the native `<select>` so a styled chevron, focus ring, and error visual stay consistent with `Input`. Using the native control keeps mobile UX excellent (OS-native pickers), avoids reimplementing keyboard / type-to-search, and stays accessible by default. Custom-rendered option lists (search, multi-select, custom row layout) belong in **Combobox** / **Dropdown** at the composite tier.

## When to use
- A single-value choice from a small-to-medium static list (≤ ~30 items)
- Native picker is acceptable on the target platforms (almost always)

## When NOT to use
- Searchable / type-ahead options → use **Combobox** (composite)
- Multi-select → use **MultiSelect** (composite)
- Rich option rendering (icons, descriptions, custom layout) → use **Dropdown** (composite)
- A labeled, error-bearing field → wrap in **FormField**

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Native control | Owns raw `<select>` + `<option>`s  | a `<div role="combobox">` shim     |
| Chevron        | `Icon name="chevron-down"`         | inline `<svg>`                     |

## API contract
```ts
type SelectSize = "sm" | "md" | "lg";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectOwnProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  size?: SelectSize;       // default "md"
  error?: boolean;         // default false; sets aria-invalid
  disabled?: boolean;      // default false
}

export type SelectProps = SelectOwnProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>,
       "size" | "value" | "defaultValue" | "onChange">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Border + chevron from tokens                                          |
| focus    | Border + ring swap                                                    |
| error    | `aria-invalid="true"`; border swaps to error                          |
| disabled | Disabled visual; native interaction suppressed                        |
| placeholder | When `placeholder` set and value is empty, renders disabled empty option |

## Accessibility
- Native `<select>` provides full keyboard support and platform-native pickers.
- `error` only signals invalid state — message text comes from `FormField`.
- Disabled options are skipped by keyboard navigation (native behavior).

## Tokens
- Inherits the Input token set: `--input-border-*`, `--input-background-*`, `--input-padding-*`, `--radius-md`, `--color-text-*`, `--duration-fast`
- Adds (component tier): `--select-chevron-color`, `--select-chevron-size`

## Do / Don't
```tsx
// DO
<Select
  value={role}
  onChange={setRole}
  placeholder="Choose role"
  options={[{ value: "admin", label: "Admin" }, { value: "user", label: "User" }]}
/>

// DON'T — inline chevron svg
<Select /* … */ /> {/* with hand-rolled <svg> in Select.tsx */}

// DON'T — Select with search
<Select searchable />   // build a Combobox composite instead
```

## Forbidden patterns (enforced)
- Inline `<svg>` for the chevron — use `Icon`
- Hardcoded color, spacing, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Each `size` renders the correct class
- `value` / `defaultValue` controlled and uncontrolled both work
- `onChange` fires with the chosen value string
- `error` sets `aria-invalid="true"`
- `placeholder` renders a leading disabled option
- Disabled options are present in the DOM with `disabled`
- Forwards ref to the native `<select>`; spreads remaining props
- axe-core passes in default, error, disabled
