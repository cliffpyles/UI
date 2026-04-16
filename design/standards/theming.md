# Theming

The design system supports theming at two levels: product themes (dark mode, high contrast) and customer branding (white-labeling). These are architecturally distinct concerns with different customization boundaries.

## Product Themes

### Light Theme (Default)

The standard theme. Light backgrounds, dark text.

### Dark Theme

Inverted color scheme for low-light environments and user preference.

**Not a simple inversion.** Each semantic token has an explicitly chosen dark-mode value:
- Backgrounds get darker. Elevated surfaces are lighter than base (opposite of light mode).
- Text lightens, maintaining the primary/secondary/tertiary hierarchy.
- Semantic colors shift to lighter variants for contrast on dark backgrounds.
- Borders lighten to remain visible.
- Shadows are darker and more diffused.

**Implementation:** Theme is set via `data-theme` attribute on the root element. CSS custom properties swap values.

```css
:root, :root[data-theme="light"] {
  --color-background-surface: #ffffff;
  --color-text-primary: #111827;
}

:root[data-theme="dark"] {
  --color-background-surface: #111827;
  --color-text-primary: #f3f4f6;
}
```

**Matching system preference:** Default to `prefers-color-scheme` media query. User override (explicit light/dark selection) takes precedence and is persisted.

### High Contrast Theme

For users with low vision. Extends either light or dark theme.

- Contrast ratios exceed 7:1 (AAA) for all text.
- Borders increase from 1px to 2px.
- Focus rings increase from 2px to 3px.
- Background color differences between elevation levels become more pronounced.
- Activated via `prefers-contrast: more` or explicit user setting.

## White-Labeling

For SaaS products embedded in customer environments or branded per-customer.

### Theme Contract

The theme contract defines what is customizable and what is off-limits.

**Customizable (component token tier):**

| Token | Description | Constraints |
|-------|-------------|-------------|
| `brand.primary` | Primary brand color | Must meet 4.5:1 contrast on white/dark backgrounds |
| `brand.primary.hover` | Primary hover state | Must be a darker/lighter variant of `brand.primary` |
| `brand.accent` | Accent/secondary brand color | Must meet 3:1 contrast for UI elements |
| `brand.font.family` | Brand font family | Must include tabular numeral support; system fallback stack required |
| `brand.logo` | Logo asset URL | SVG preferred; max dimensions specified |
| `brand.favicon` | Favicon asset URL | Standard sizes (16, 32, 180, 192, 512) |

**Not customizable:**

| Category | Reason |
|----------|--------|
| Spacing and padding | Changing spacing breaks component layouts and density system |
| Typography scale | Scale ratios are carefully calibrated for data readability |
| Semantic colors | Status colors (success/warning/error) are functional, not brand |
| Component structure | Internal component layout is not a branding concern |
| Animation timing | Motion is tuned for usability, not brand expression |
| Border radius | Changing radius inconsistently breaks visual coherence |

### Implementation Strategy

**Runtime theming** (preferred for SaaS): CSS custom properties swapped at load time based on customer configuration.

```javascript
// Load customer theme at app initialization
function applyCustomerTheme(config) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', config.primaryColor);
  root.style.setProperty('--brand-primary-hover', config.primaryColorHover);
  root.style.setProperty('--brand-font-family', config.fontFamily);
}
```

**Build-time theming** (for fully isolated deployments): Separate CSS builds per customer with different token values. Used when customers require complete visual separation.

### Guardrails

Theming has guardrails to prevent customers from breaking accessibility or usability:

1. **Contrast validation**: When a brand color is set, the system validates it meets minimum contrast ratios. If it doesn't, a warning is shown and a fallback is used.
2. **Font fallback**: If a brand font fails to load, the system font stack is used automatically.
3. **Color generation**: From a single brand color, the system generates hover, active, and background variants algorithmically, ensuring they maintain proper contrast relationships.
4. **Preview**: Theme changes are shown in a preview panel before being applied to the live product.

## Theme Switching

### User Controls

- Theme toggle in user settings: Light / Dark / System (auto).
- Quick toggle accessible from the user menu (one click, not buried in settings).
- Theme preference persisted to user account (synced across devices).

### Transition

- Theme switches use a 200ms CSS transition on custom properties: `transition: background-color 200ms, color 200ms`.
- No jarring full-page flash. The transition is smooth.
- Reduced motion users see an instant switch (0ms transition).

### Nesting

A page can contain elements with a forced theme (e.g., a code block always uses dark theme, regardless of the page theme):

```html
<div data-theme="dark">
  <CodeBlock>...</CodeBlock>
</div>
```

Theme context can be nested, and components resolve their tokens from the nearest theme ancestor.
