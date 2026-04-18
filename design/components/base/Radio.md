---
name: Radio
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-entry]
uses: [Box, Text]
replaces-raw: ["<input type=\"radio\">", "<div role=\"radiogroup\">"]
---

# Radio

> A single radio option, used inside a `RadioGroup` for one-of-N selection.

## Purpose
Radio + RadioGroup own single-choice selection. The group manages controlled/uncontrolled value state, generates a shared `name`, and provides a `radiogroup` ARIA container; individual `Radio` components contribute the visual control + label/description. Splitting the API mirrors the native model and makes keyboard-arrow nav inside the group natural.

## When to use
- A small set (≤ 6) of mutually exclusive options shown inline
- Settings choices where all options should be visible at once

## When NOT to use
- A larger option list → use **Select** (collapses to a dropdown)
- Multi-select → use **Checkbox**
- An on/off toggle → use **Toggle**
- A choice with rich card-like options → use a domain-specific **OptionCardGroup**

## Composition (required)
| Concern          | Use                                | Never                              |
|------------------|------------------------------------|------------------------------------|
| Internal layout  | `Box direction="row" align="start" gap="2"` for the input + label/description column on each Radio; group container uses `Box direction={orientation === "horizontal" ? "row" : "column"} gap="3"` | hand-rolled `display: flex` / `gap` / `padding` in `Radio.css` |
| Native control   | Owns raw `<input type="radio">`    | a `<div role="radio">` shim        |
| Group container  | Owns raw `<div role="radiogroup">` | hand-rolled focus management       |
| Label text       | `Text size="body">`                | raw styled `<span>`                |
| Description text | `Text size="caption" color="secondary">` | raw styled `<span>`           |

## API contract
```ts
interface RadioGroupOwnProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;                                  // auto-generated if omitted
  orientation?: "horizontal" | "vertical";        // default "vertical"
  disabled?: boolean;                              // default false
  children: ReactNode;
}
export type RadioGroupProps = RadioGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">;

interface RadioOwnProps {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}
export type RadioProps = RadioOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| default  | Empty circle                                                          |
| selected | Filled inner dot                                                      |
| disabled | Desaturated; click suppressed; group `disabled` overrides per-radio   |
| focus    | Visible focus ring on the control                                     |

## Accessibility
- Group is `role="radiogroup"` with `aria-orientation`; arrow keys move focus and selection within the group (native behavior).
- Each Radio shares the group's `name` so the browser enforces single-selection semantics.
- Visible label is a click target via wrapping `<label>`.

## Tokens
- Border: `--radio-border-{default|hover|checked|disabled}`
- Background: `--radio-background-{default|checked|disabled}`
- Dot color: `--radio-dot-color`
- Size: `--radio-size`
- Focus: `--shadow-focus-ring`

## Do / Don't
```tsx
// DO
<RadioGroup value={plan} onChange={setPlan} name="plan">
  <Radio value="free" label="Free" description="1 project"/>
  <Radio value="pro" label="Pro" description="Unlimited"/>
</RadioGroup>

// DON'T — Radio outside a group
<Radio value="x" label="Solo radio" />

// DON'T — raw styled label
<Radio value="x" label={<span style={{ color: "red" }}>X</span>}/>
```

## Forbidden patterns (enforced)
- Raw styled `<span>` for label or description — use `Text`
- Inline `<svg>` for the dot
- Hardcoded color, spacing, radius
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Group manages controlled and uncontrolled value
- Selecting a Radio fires `onChange` with its `value`
- Group `disabled` disables all members; per-Radio `disabled` is additive
- Arrow-key navigation within group works (native)
- Forwards ref to the native `<input>` for Radio and to the group `<div>` for RadioGroup
- axe-core passes
