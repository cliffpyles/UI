---
name: ColorPicker
tier: domain
level: 5
status: stable
since: 0.6.0
patterns: [data-entry]
uses: [Box, Popover, Button, Input, Text]
---

# ColorPicker

> Picker for selecting a value from an approved palette, with optional custom color entry.

## Purpose
ColorPicker constrains color selection to the design-system palette by default — every other color in a data app should be a token, and ad-hoc colors break charts, brand consistency, and dark-mode swaps. When a custom color is genuinely required (e.g. user-chosen tag color), the component opens a hex input with validation. The default-constrained behavior is the point.

## When to use
- Picking a label, tag, or category color from an approved palette
- Choosing a chart series color when overrides are permitted
- Customizing a workspace accent within a curated set

## When NOT to use
- Free-form artistic color selection (eyedropper, gradients) — out of scope
- Theme switching — that is a `ThemeProvider` concern, not user input
- Single boolean color toggles — use **Toggle**

## Composition (required)
| Concern         | Use                                  | Never                                |
|-----------------|--------------------------------------|--------------------------------------|
| Internal layout | `Box direction="row" gap` for swatch trigger; `Box` grids inside the popover | hand-rolled flex/grid in CSS |
| Trigger         | `Button variant="ghost"` wrapping the swatch + label | raw `<button>` with color CSS |
| Floating panel  | `Popover`                            | bespoke positioning logic            |
| Custom hex entry| `Input`                              | raw `<input type="text">`            |
| Labels / hints  | `Text`                               | raw styled `<span>`                  |

## API contract
```ts
interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string | null;                 // hex string or null
  onChange: (color: string | null) => void;
  palette: { name: string; value: string }[];
  allowCustom?: boolean;                // default false
  disabled?: boolean;
  placeholder?: string;                 // default "Pick color"
}
```
Forwards ref to the root `<div>`.

## Required states
| State    | Behavior                                                                  |
|----------|---------------------------------------------------------------------------|
| empty    | Trigger shows `placeholder` text; no swatch                                |
| selected | Trigger shows the swatch + the palette name (or hex, if custom)            |
| open     | `Popover` shows palette grid; arrow keys move focus between swatches       |
| custom   | When `allowCustom`, an `Input` accepts a hex value with validation         |
| disabled | Trigger disabled; popover cannot open                                      |

## Accessibility
- Each swatch is a button with `aria-label="<palette name> (<hex>)"`
- Currently selected swatch has `aria-pressed="true"`
- Color is never the only signal — name and check icon both indicate selection
- Custom hex `Input` is a labeled `FormField` inside the popover with validation messaging

## Tokens
- Inherits all tokens from `Button`, `Popover`, `Input`
- Adds (component tier): `--color-picker-swatch-size`, `--color-picker-swatch-border`

## Do / Don't
```tsx
// DO
<ColorPicker value={tagColor} onChange={setTagColor} palette={tagPalette} />

// DON'T — render a raw color input
<input type="color" value={color} onChange={…} />

// DON'T — bypass Popover with a custom div
<div className="floating-palette">…</div>
```

## Forbidden patterns (enforced)
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>` outside their owners
- Raw `<input type="color">` (the whole point is to constrain)
- `onClick` on `<div>` / `<span>`
- Inline `<svg>` (use `Icon`)
- Inline `Intl.NumberFormat` / `toLocaleString`
- Inline trend glyphs (▲▼↑↓)
- Hardcoded color, spacing, radius, shadow, duration, z-index — palette comes via the `palette` prop, not CSS
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders placeholder when value is null
- Selecting a palette swatch calls `onChange` with its hex
- `allowCustom` shows the hex `Input`; invalid hex blocks `onChange`
- Keyboard: arrows move between swatches, Enter selects, Esc closes
- Forwards ref; spreads remaining props onto root
- Composition probe: `Popover`, `Button`, `Input` all render inside output
- axe-core passes in default, open, selected, disabled
