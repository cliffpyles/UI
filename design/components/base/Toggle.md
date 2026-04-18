---
name: Toggle
tier: base
level: 3
status: stable
since: 0.3.0
patterns: [data-entry]
uses: [Text]
replaces-raw: ["<input type=\"checkbox\" role=\"switch\">"]
---

# Toggle

> An on/off switch — used for settings that take effect immediately.

## Purpose
Toggle is a checkbox semantically (`<input type="checkbox" role="switch">`) but visually a slider. The semantic split matters: a Toggle implies the change applies the moment it's flipped, while a Checkbox implies a value that will be saved as part of a form submission. Reuse the native control to inherit keyboard accessibility for free.

## When to use
- Instant-effect settings: notifications on/off, dark mode, feature flags in a settings panel
- Anywhere the metaphor "this is now ON" is clearer than "this checkbox is checked"

## When NOT to use
- A form value that's saved on submit → use **Checkbox**
- A choice between two non-binary modes ("List" vs "Grid") → use **SegmentedControl** (composite, when present) or **RadioGroup**
- A pressable button with state ("Bold" in a toolbar) → use **ToggleButton** (composite)

## Composition (required)
| Concern          | Use                                  | Never                              |
|------------------|--------------------------------------|------------------------------------|
| Native control   | Owns raw `<input type="checkbox" role="switch">` | a `<div role="switch">` shim |
| Label text       | `Text size="body">`                  | raw styled `<span>`                |

## API contract
```ts
type ToggleSize = "sm" | "md";

interface ToggleOwnProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;        // default false
  size?: ToggleSize;         // default "md"
  label?: ReactNode;
}

export type ToggleProps = ToggleOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>,
       "type" | "size" | "checked" | "defaultChecked" | "onChange">;
```

## Required states
| State    | Behavior                                                              |
|----------|-----------------------------------------------------------------------|
| off      | Track in neutral; thumb at start                                      |
| on       | Track in `--color-action-primary`; thumb at end                       |
| disabled | Desaturated; click suppressed                                         |
| focus    | Visible focus ring on the track                                       |

## Accessibility
- `role="switch"` + `aria-checked` mirror the boolean state.
- Wrapping `<label>` makes the visible label a click target.
- Color is not the only signal — thumb position changes too.

## Tokens
- Track: `--toggle-track-{off|on|disabled}`
- Thumb: `--toggle-thumb-color`
- Size: `--toggle-size-{sm|md}-{width|height}`
- Duration: `--duration-fast`
- Focus: `--shadow-focus-ring`

## Do / Don't
```tsx
// DO
<Toggle label="Email notifications" checked={on} onChange={setOn}/>

// DON'T — raw styled label
<Toggle label={<span style={{ color: "blue" }}>Notify</span>}/>

// DON'T — Toggle for a form field saved on submit
<form><Toggle label="Subscribe"/></form>   // use Checkbox
```

## Forbidden patterns (enforced)
- Raw styled `<span>` for the label — use `Text`
- Hardcoded color, spacing, radius, duration
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Controlled and uncontrolled both work
- `onChange` fires with the new boolean
- `aria-checked` mirrors the state
- `disabled` prevents toggling
- Forwards ref to the native `<input>`; spreads remaining props
- axe-core passes
