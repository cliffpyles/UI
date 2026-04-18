---
name: Icon
tier: primitive
level: 2
status: stable
since: 0.2.0
patterns: []
uses: []
replaces-raw: ["<svg> used to render a system glyph"]
---

# Icon

> The system's SVG glyph primitive — name-keyed, size-keyed, color-keyed.

## Purpose
Icon is the only sanctioned source of glyphs in the system. It renders the registered SVG for a named icon at a token-driven size and color, with consistent stroke handling and accessibility defaults.

## When to use
- Any glyph used in a Button, Input, Tab, Menu, Badge, etc.
- Decorative status icons inside notifications, banners, list rows
- Standalone iconography that requires an accessible name

## When NOT to use
- A custom illustration / artwork → render a dedicated SVG component
- A "loading" indicator → use **Spinner**
- A status pill with text → use **Badge**

## Composition (required)
| Concern        | Use                                | Never                              |
|----------------|------------------------------------|------------------------------------|
| Wrapper tag    | Owns raw `<svg>`                   | inline `<svg>` in other components |
| Glyph source   | `iconPaths[name]` registry          | hand-pasted `<path>` markup       |
| Color          | `IconColor` semantic token map      | hardcoded `stroke="#…"`            |

## API contract
```ts
type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconColor =
  | "currentColor"
  | "primary" | "secondary" | "tertiary" | "disabled"
  | "success" | "warning" | "error" | "info";

interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "color"> {
  name: IconName;        // required, must exist in iconPaths registry
  size?: IconSize;       // default "sm"
  color?: IconColor;     // default "currentColor"
  label?: string;        // when present → role="img" + aria-label; otherwise aria-hidden
}
```

## Required states
| State        | Behavior                                                          |
|--------------|-------------------------------------------------------------------|
| decorative   | No `label` → `aria-hidden="true"`, no role                        |
| labelled     | `label` provided → `role="img"` + `aria-label={label}`            |

## Accessibility
- Decorative is the default; this is correct when icon sits next to a text label.
- A standalone meaningful icon (no adjacent text) MUST receive `label`.
- Stroke width steps up at `lg`/`xl` so smaller sizes remain crisp.

## Tokens
- Colors: `--color-text-{primary|secondary|tertiary|disabled}`
- Status colors: `--color-status-{success|warning|error|info}-icon`
- Sizing: pixel values from `sizeMap` (12/16/20/24/32) — these match the documented `--size-icon-*` scale

## Do / Don't
```tsx
// DO — decorative inside a button with text
<Button><Icon name="plus" /> New</Button>

// DO — standalone meaningful icon
<Icon name="trash" label="Delete row" color="error" />

// DON'T — hand-rolled SVG
<svg><path d="…" /></svg>

// DON'T — color outside the system map
<Icon name="check" style={{ color: "lime" }} />
```

## Forbidden patterns (enforced)
- Inline `<svg>`/`<path>` in components other than Icon
- Hardcoded color values (`stroke`/`fill` outside `colorMap`)
- Adding glyphs anywhere except `src/primitives/Icon/icons.ts`
- `var(--…)` references not declared in the Tokens section

## Tests (required coverage)
- Renders the SVG path for the requested name
- Each size sets the correct width/height
- Each color sets the correct stroke
- `label` toggles `role="img"`/`aria-label` vs `aria-hidden`
- Forwards ref; spreads remaining props
- axe-core passes both decorative and labelled
