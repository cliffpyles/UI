# Color System

In data-intensive applications, color carries meaning — status, trend direction, severity, category. The color system must serve three distinct functions simultaneously: semantic indication, data visualization, and UI structure. All while meeting accessibility requirements across multiple backgrounds and in dark mode.

## Color Roles

### Structural Colors

Define the visual hierarchy of the interface itself — backgrounds, borders, text.

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `color.background.surface` | white | gray.900 | Primary content area |
| `color.background.surface.raised` | gray.50 | gray.800 | Cards, panels above surface |
| `color.background.surface.sunken` | gray.100 | gray.950 | Inset areas, wells |
| `color.background.overlay` | black/50% | black/70% | Behind modals and drawers |
| `color.text.primary` | gray.900 | gray.100 | Primary content text |
| `color.text.secondary` | gray.500 | gray.400 | Supporting text, descriptions |
| `color.text.tertiary` | gray.400 | gray.500 | Metadata, timestamps, hints |
| `color.text.disabled` | gray.300 | gray.600 | Disabled text |
| `color.border.default` | gray.200 | gray.700 | Structural borders |
| `color.border.strong` | gray.300 | gray.600 | Emphasized borders |

### Action Colors

The interactive palette — what users click, focus, and activate.

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `color.action.primary` | blue.600 | blue.400 | Primary buttons, links |
| `color.action.primary.hover` | blue.700 | blue.300 | Primary hover state |
| `color.action.primary.bg` | blue.50 | blue.950 | Subtle primary background |
| `color.action.secondary` | gray.600 | gray.300 | Secondary actions |
| `color.action.destructive` | red.600 | red.400 | Delete, remove actions |
| `color.focus.ring` | blue.500/50% | blue.400/50% | Focus indicator |

### Semantic Colors

Carry specific meaning — status, severity, outcome.

| Semantic | Light values | Dark values | Use |
|----------|-------------|-------------|-----|
| **Success** | green.50 bg, green.600 text, green.500 icon | green.950 bg, green.400 text/icon | Completed, healthy, positive change |
| **Warning** | amber.50 bg, amber.700 text, amber.500 icon | amber.950 bg, amber.400 text/icon | Attention needed, degraded, approaching threshold |
| **Error** | red.50 bg, red.700 text, red.500 icon | red.950 bg, red.400 text/icon | Failed, critical, negative |
| **Info** | blue.50 bg, blue.700 text, blue.500 icon | blue.950 bg, blue.400 text/icon | Informational, neutral callout |

**Critical rule:** Color is never the sole indicator of meaning. Every semantic use of color must have a secondary signal — an icon, a text label, or a pattern. This is non-negotiable for accessibility.

### Categorical Colors

Used in charts, tags, and any context where items need to be visually distinguished by category without implying order or severity.

The categorical palette provides 8 distinct hues, chosen for:
- Mutual distinguishability (no two look similar at a glance)
- Colorblind safety (the 8 colors are distinguishable under protanopia, deuteranopia, and tritanopia)
- Adequate contrast on both light and dark backgrounds

| Index | Hue | Light | Dark |
|-------|-----|-------|------|
| 1 | Blue | blue.500 | blue.400 |
| 2 | Teal | teal.500 | teal.400 |
| 3 | Amber | amber.500 | amber.400 |
| 4 | Purple | purple.500 | purple.400 |
| 5 | Pink | pink.500 | pink.400 |
| 6 | Indigo | indigo.500 | indigo.400 |
| 7 | Orange | orange.500 | orange.400 |
| 8 | Cyan | cyan.500 | cyan.400 |

When more than 8 categories exist, use a combination of color and pattern (striped, dotted, dashed) for chart series, or group categories with a "top 7 + other" strategy.

## Contrast Requirements

All text must meet WCAG 2.1 AA contrast ratios:

| Text size | Minimum ratio |
|-----------|---------------|
| Body text (< 18px normal, < 14px bold) | 4.5:1 |
| Large text (≥ 18px normal, ≥ 14px bold) | 3:1 |
| UI components and graphical objects | 3:1 |

**Dense UI implication:** At 12px body text (common in compact density), the 4.5:1 ratio applies. This constrains color choices for secondary/tertiary text. `color.text.secondary` must meet 4.5:1 against `color.background.surface`.

## Colorblind Safety

The system avoids relying on red/green distinction alone:

- **Success/Error:** Distinguished by icon (checkmark vs. X) and text label, not just green vs. red.
- **Trend indicators:** Up/down arrows plus "+"/"-" prefix, not just green/red coloring.
- **Charts:** Categorical palette is tested against all three forms of color vision deficiency. Patterns (dashed, dotted) supplement color when needed.
- **Heatmaps and gradients:** Use sequential single-hue ramps (light blue → dark blue) rather than diverging red → green ramps. When diverging scales are necessary, use blue → red (distinguishable under deuteranopia) or blue → orange.

## Dark Mode

Dark mode is not a simple inversion. Each semantic token has an explicitly chosen dark-mode value.

**Principles:**
- Backgrounds get darker, text gets lighter, but the hierarchy is preserved (primary still stands out from secondary).
- Semantic colors shift: on dark backgrounds, lighter shades of green/red/amber/blue are needed to maintain contrast.
- Raised surfaces are lighter than the base surface (opposite of light mode). Elevation = lightness in dark mode.
- Borders are lighter (gray.700) to remain visible against dark backgrounds.
- Categorical colors shift to lighter variants to maintain contrast on dark surfaces.

## Implementation

Colors are implemented as CSS custom properties derived from the token definitions. Theme switching swaps the custom property values at the `:root` level.

```css
:root {
  --color-background-surface: #ffffff;
  --color-text-primary: #111827;
}

:root[data-theme="dark"] {
  --color-background-surface: #111827;
  --color-text-primary: #f3f4f6;
}
```

Components reference custom properties, never literal color values:

```css
.ui-card {
  background: var(--color-background-surface-raised);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}
```
