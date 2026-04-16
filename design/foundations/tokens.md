# Design Tokens

Tokens are named values that encode every visual design decision. No component hardcodes a color, spacing value, font size, or duration. Everything flows through the token system, which is what makes theming, dark mode, and white-labeling possible by design.

## Token Tiers

Tokens are organized into three tiers. Each tier references the tier below it, never skipping levels.

### Tier 1: Primitive Tokens

Raw, context-free values. These define the full palette of available options but carry no meaning about how they're used. Primitive tokens are the only tier that contains literal values.

```
color.blue.50:   #eff6ff
color.blue.500:  #3b82f6
color.blue.900:  #1e3a8a
spacing.1:       0.25rem
spacing.4:       1rem
font.size.sm:    0.875rem
radius.md:       0.375rem
duration.fast:   150ms
```

**Rules:**
- Named by what they _are_, not what they _do_.
- Stable and exhaustive — define all available values upfront.
- Never referenced directly by components. Always consumed through semantic tokens.
- Additions are low-risk; removals or changes require an audit of downstream semantic tokens.

### Tier 2: Semantic Tokens

Apply meaning to primitive values. These answer: "What does this color/spacing/size _mean_ in our system?"

```
color.background.surface:        {color.white}
color.background.surface.raised: {color.gray.50}
color.text.primary:              {color.gray.900}
color.text.secondary:            {color.gray.500}
color.action.primary:            {color.blue.600}
color.action.primary.hover:      {color.blue.700}
color.status.success:            {color.green.500}
color.status.error:              {color.red.500}
color.border.default:            {color.gray.200}
spacing.content.gap:             {spacing.3}
spacing.section.gap:             {spacing.6}
font.size.body:                  {font.size.base}
font.size.caption:               {font.size.sm}
```

**Rules:**
- Named by what they _mean_, not what they look like. `color.status.error` not `color.red`.
- This is the primary tier that theming operates on. Dark mode swaps semantic token values to point at different primitives.
- Most components reference semantic tokens directly.
- Changes here have broad impact — changing `color.action.primary` changes every primary action in the product.

### Tier 3: Component Tokens

Component-specific overrides for cases where a semantic token applies to most contexts but a specific component needs a different value.

```
button.background.primary:       {color.action.primary}
button.background.primary.hover: {color.action.primary.hover}
button.text.primary:             {color.white}
button.padding.sm:               {spacing.1.5} {spacing.3}
table.header.background:         {color.background.surface.raised}
table.row.background.striped:    {color.gray.50}
input.border.default:            {color.border.default}
input.border.focus:              {color.action.primary}
```

**Rules:**
- Named by component, then property, then variant/state.
- Default value points to the appropriate semantic token. Only specify a component token when the semantic default is wrong for that component.
- This tier enables surgical overrides without polluting the semantic layer.
- White-labeling operates here — a customer can override `button.background.primary` without affecting `link.color.primary`.

## Naming Convention

Token names follow a structured hierarchy: `{category}.{property}.{variant}.{state}`

### Categories

| Category | Purpose | Examples |
|----------|---------|---------|
| `color` | All color values | `color.text.primary`, `color.background.surface` |
| `spacing` | Margins, padding, gaps | `spacing.content.gap`, `spacing.section.gap` |
| `font` | Typography | `font.size.body`, `font.weight.semibold`, `font.family.mono` |
| `radius` | Border radius | `radius.sm`, `radius.full` |
| `shadow` | Box shadows | `shadow.sm`, `shadow.overlay` |
| `duration` | Animation timing | `duration.fast`, `duration.normal` |
| `easing` | Animation curves | `easing.default`, `easing.enter` |
| `z` | Z-index layers | `z.dropdown`, `z.modal`, `z.toast` |
| `size` | Component sizing | `size.icon.sm`, `size.avatar.md` |

### Naming rules

1. Use dot notation: `color.text.primary` not `color-text-primary`.
2. No abbreviations except universally understood ones (`sm`, `md`, `lg`, `xl`).
3. State variants are suffixed: `.hover`, `.focus`, `.disabled`, `.active`.
4. Density variants are suffixed: `.compact`, `.default`, `.comfortable`.
5. Dark mode is not a naming variant — it's a theme that swaps semantic token values.

## Density Tokens

Density-sensitive tokens (spacing, font size, padding) exist at three levels:

```
spacing.content.gap.compact:      {spacing.1}
spacing.content.gap.default:      {spacing.3}
spacing.content.gap.comfortable:  {spacing.4}

font.size.body.compact:           {font.size.xs}      // 0.75rem
font.size.body.default:           {font.size.base}     // 1rem
font.size.body.comfortable:       {font.size.base}     // 1rem
```

Density is applied at the container level via a CSS class or context provider, not per-component. Components inside a density container inherit the appropriate token values.

## Theming

Themes swap the values of semantic tokens. The token _names_ never change — only their resolved values.

```
// Light theme
color.background.surface: {color.white}
color.text.primary:       {color.gray.900}

// Dark theme
color.background.surface: {color.gray.900}
color.text.primary:       {color.gray.100}
```

### Theme contract

The theme contract is the set of semantic tokens that a theme must define. Any valid theme provides values for every token in the contract. This guarantees that switching themes never produces undefined values.

### White-label layer

White-labeling operates at the component token tier. Customers may override:
- Brand colors (primary action color, accent color)
- Logo and brand assets
- Font family (with fallback constraints)

Customers may not override:
- Spacing, padding, or layout tokens
- Status/semantic colors (these are functional, not brand)
- Typography scale or weight

See [Theming](../standards/theming.md) for the full specification.

## Implementation

In the codebase, tokens are defined as TypeScript objects in `src/tokens/`. They are consumed:

1. As CSS custom properties (generated from the token definitions) for use in component CSS files.
2. As TypeScript values for use in runtime logic that needs to reference design values.
3. As exported constants for consumer applications that need programmatic access.

The token source of truth is the TypeScript definition. CSS custom properties, Figma variables, and any other formats are derived from this source.
