# Phase 1: Token System & Infrastructure

**Architecture Level:** Level 1 (Design Tokens) + cross-cutting infrastructure
**Dependencies:** None (this is the foundation)
**Source of truth:** [design/foundations/tokens.md](../design/foundations/tokens.md), [design/foundations/color.md](../design/foundations/color.md), [design/foundations/typography.md](../design/foundations/typography.md), [design/foundations/spacing-and-density.md](../design/foundations/spacing-and-density.md), [design/foundations/motion.md](../design/foundations/motion.md), [design/standards/theming.md](../design/standards/theming.md)

## Objective

Build the complete token system that every component will reference. Establish the CSS custom property pipeline, the theme engine (light/dark), the density provider, and the testing infrastructure (including axe-core). No component will be built without this foundation in place.

## Directory Changes

```
src/
  tokens/                     # Restructure existing
    primitives/               # Tier 1: raw values
      colors.ts
      spacing.ts
      typography.ts
      radius.ts
      shadows.ts
      motion.ts
      z-index.ts
    semantic/                 # Tier 2: meaningful mappings
      colors.ts               # Structural, action, semantic, categorical
      spacing.ts              # Content gap, section gap, etc.
      typography.ts           # Body, caption, heading sizes
    component/                # Tier 3: component-specific overrides
      button.ts
      input.ts
      table.ts
    contract.ts               # Theme contract type (all semantic tokens a theme must define)
    index.ts                  # Public API: all tiers + types
  styles/                     # New
    reset.css                 # CSS reset / normalize
    tokens.css                # Generated CSS custom properties
    themes/
      light.css               # Light theme token values
      dark.css                # Dark theme token values
    density/
      compact.css             # Compact density overrides
      comfortable.css         # Comfortable density overrides
  providers/                  # New
    ThemeProvider.tsx          # Theme context + data-theme attribute
    DensityProvider.tsx        # Density context + data-density attribute
  test/                       # Extend existing
    setup.ts                  # Add axe-core, theme/density helpers
    test-utils.tsx            # Custom render with providers
```

## Deliverables

### 1. Primitive Tokens (Tier 1)

Restructure existing `src/tokens/` into `src/tokens/primitives/`. Expand to cover all categories from [design/foundations/tokens.md](../design/foundations/tokens.md):

**colors.ts** — Full palette for each hue (50-950 steps):
- gray, blue, green, red, amber, teal, purple, pink, indigo, orange, cyan
- Plus: white, black

**spacing.ts** — Base-4 scale per [design/foundations/spacing-and-density.md](../design/foundations/spacing-and-density.md):
- 0, px, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 32

**typography.ts** — Per [design/foundations/typography.md](../design/foundations/typography.md):
- `fontFamily`: sans, mono
- `fontSize`: 2xs (10px) through 4xl (36px)
- `fontWeight`: normal (400), medium (500), semibold (600), bold (700)
- `lineHeight`: tight (1.25), normal (1.5), relaxed (1.75)

**radius.ts**:
- none, sm (2px), md (4px), lg (8px), xl (12px), full (9999px)

**shadows.ts**:
- none, sm, md, lg, overlay

**motion.ts** — Per [design/foundations/motion.md](../design/foundations/motion.md):
- `duration`: instant (0ms), fast (100ms), normal (200ms), slow (300ms), deliberate (500ms)
- `easing`: default, enter, exit, linear

**z-index.ts** — Per [design/foundations/layout.md](../design/foundations/layout.md):
- sticky.column (70), sticky.tableHeader (80), sticky.filter (90), sticky.header (100), dropdown (200), modal (300), toast (400)

### 2. Semantic Tokens (Tier 2)

Map primitive tokens to meaningful names per [design/foundations/tokens.md](../design/foundations/tokens.md):

**colors.ts** — Four categories per [design/foundations/color.md](../design/foundations/color.md):
- **Structural**: background.surface, background.surface.raised, background.surface.sunken, background.overlay, text.primary, text.secondary, text.tertiary, text.disabled, border.default, border.strong
- **Action**: action.primary, action.primary.hover, action.primary.bg, action.secondary, action.destructive, focus.ring
- **Semantic**: status.success (50/500/700), status.warning (50/500/700), status.error (50/500/700), status.info (50/500/700)
- **Categorical**: 8-hue palette for charts/tags (blue, teal, amber, purple, pink, indigo, orange, cyan)

**spacing.ts** — Semantic spacing per density:
- content.gap (compact: 4px, default: 12px, comfortable: 16px)
- section.gap (compact: 12px, default: 24px, comfortable: 32px)
- page.padding, component.padding.x, component.padding.y, inline.gap

**typography.ts** — Semantic type mappings:
- body, caption, label, heading sizes per density

### 3. Component Tokens (Tier 3)

Initial component token files for Phase 3+ components. Start with:
- `button.ts`: background, text, padding per variant and size
- `input.ts`: border, background, text per state
- `table.ts`: header background, row backgrounds, border

### 4. CSS Custom Properties Pipeline

A build utility that generates CSS custom properties from the TypeScript token definitions:

- `styles/tokens.css` — All primitive tokens as `--color-blue-500`, `--spacing-4`, etc.
- `styles/themes/light.css` — Semantic tokens resolved for light theme
- `styles/themes/dark.css` — Semantic tokens resolved for dark theme
- `styles/density/compact.css` — Density-sensitive token overrides for compact
- `styles/density/comfortable.css` — Density-sensitive token overrides for comfortable

Components will reference `var(--color-text-primary)` in their CSS, never raw values.

### 5. CSS Reset

`styles/reset.css` per [design/foundations/spacing-and-density.md](../design/foundations/spacing-and-density.md):
- Box-sizing border-box
- Zero margins/padding
- System font stack
- Antialiased rendering
- `font-variant-numeric: tabular-nums` on elements likely to contain numbers

### 6. ThemeProvider

React context provider that:
- Sets `data-theme="light|dark"` on a container element.
- Defaults to `prefers-color-scheme` media query.
- Exposes `useTheme()` hook returning `{ theme, setTheme, resolvedTheme }`.
- Persists user preference to `localStorage`.

### 7. DensityProvider

React context provider that:
- Sets `data-density="compact|default|comfortable"` on a container element.
- Exposes `useDensity()` hook returning `{ density, setDensity }`.
- Nestable: inner providers override outer ones.
- Components use `useDensity()` to conditionally adjust behavior (not just CSS).

### 8. Test Infrastructure

Extend existing `src/test/setup.ts`:
- Install and configure `vitest-axe` (or `jest-axe` with vitest adapter).
- Create `src/test/test-utils.tsx` with a custom `render` function that wraps components in ThemeProvider and DensityProvider.
- Add test helpers: `renderWithTheme(component, theme)`, `renderWithDensity(component, density)`.

## Development Order

1. Primitive tokens (restructure existing, add missing categories)
2. Semantic tokens (create mappings, light theme values)
3. CSS custom properties generation (tokens.css, light.css)
4. CSS reset
5. Dark theme semantic values (dark.css)
6. Density token variants (compact.css, comfortable.css)
7. ThemeProvider
8. DensityProvider
9. Component tokens (initial set)
10. Test infrastructure (axe-core, custom render)
11. Update dev playground to demonstrate theme/density switching

## Testing

### Token Tests

```typescript
describe("primitive tokens", () => {
  it("defines all color hues with 50-950 steps", () => { ... });
  it("defines spacing scale with expected values", () => { ... });
  it("defines complete font size scale from 2xs to 4xl", () => { ... });
});

describe("semantic tokens", () => {
  it("maps every semantic color to a valid primitive", () => { ... });
  it("defines light and dark values for every semantic token", () => { ... });
  it("defines compact/default/comfortable for density tokens", () => { ... });
});

describe("theme contract", () => {
  it("light theme satisfies the full contract", () => { ... });
  it("dark theme satisfies the full contract", () => { ... });
  it("no semantic token resolves to undefined in either theme", () => { ... });
});
```

### Provider Tests

```typescript
describe("ThemeProvider", () => {
  it("defaults to system preference", () => { ... });
  it("sets data-theme attribute on container", () => { ... });
  it("useTheme returns current theme and setter", () => { ... });
  it("persists preference to localStorage", () => { ... });
  it("switches between light and dark", () => { ... });
});

describe("DensityProvider", () => {
  it("defaults to 'default' density", () => { ... });
  it("sets data-density attribute on container", () => { ... });
  it("useDensity returns current density and setter", () => { ... });
  it("inner provider overrides outer provider", () => { ... });
});
```

### CSS Tests

- Verify `tokens.css` contains a custom property for every primitive token.
- Verify `light.css` and `dark.css` each define every semantic token.
- Verify no raw hex/rem values appear in theme files (all reference primitives).

## Completion Criteria

- [ ] All primitive token categories defined (colors, spacing, typography, radius, shadows, motion, z-index).
- [ ] Semantic tokens defined for light and dark themes.
- [ ] Component tokens defined for button, input, table.
- [ ] CSS custom properties generated and importable.
- [ ] CSS reset in place.
- [ ] ThemeProvider works with light/dark switching and system preference.
- [ ] DensityProvider works with compact/default/comfortable switching and nesting.
- [ ] vitest-axe configured and working in test suite.
- [ ] Custom render utility available for all future component tests.
- [ ] Dev playground demonstrates theme and density switching.
- [ ] `npm run typecheck && npm run lint && npm test` passes.
