# Iconography

Data-intensive applications use icons heavily — in toolbars, table headers, status indicators, navigation, and inline actions. The icon system must be consistent, performant at scale, and clear at small sizes.

## Icon Sizes

| Token | Size | Use |
|-------|------|-----|
| `size.icon.xs` | 12px | Inline with small text, sort indicators in compact tables |
| `size.icon.sm` | 16px | Inline with body text, table cell icons, form input icons |
| `size.icon.md` | 20px | Buttons, navigation, primary actions |
| `size.icon.lg` | 24px | Section headers, standalone actions |
| `size.icon.xl` | 32px | Empty states, feature illustrations |

The default icon size is `size.icon.sm` (16px) for most UI contexts. Icons scale with density — compact density uses `xs` where default uses `sm`.

## Icon Style

All icons in the system share these properties:

- **Stroke-based** (not filled) at 1.5px stroke width for `sm`/`md`, 2px for `lg`/`xl`.
- **Rounded end caps and joins** for a consistent, approachable feel.
- **Designed on a 24px grid** with 2px padding (20px active area), then exported at all target sizes.
- **Optically balanced** within their bounding box — a play triangle is not geometrically centered, it's visually centered.

## Color

Icons inherit the color of their surrounding text by default via `currentColor`. Override colors are used for:

- **Semantic icons:** Status icons use their semantic color (`color.status.success`, `color.status.error`, etc.).
- **Action icons:** Interactive icon-only buttons use `color.action.primary` on hover/active.
- **Decorative icons:** Use `color.text.tertiary` for non-interactive, supplementary icons.

## Rendering Strategy

Icons are rendered as **inline SVGs** for:
- Color flexibility (`currentColor` inheritance, semantic color overrides).
- Crisp rendering at all sizes (no scaling artifacts).
- Animation capability (hover effects, loading states).

Icons are provided as a React component library:

```tsx
import { IconSearch, IconFilter, IconChevronDown } from "@/primitives/icons";

<IconSearch size="sm" />
<IconFilter size="md" className="text-secondary" />
```

### Performance at Scale

Dense layouts can have hundreds of icons visible simultaneously. Performance considerations:

- SVG icons are inlined at build time, not fetched as separate assets.
- Icons that repeat extensively (table sort arrows, status dots) may use a shared SVG sprite with `<use>` references to reduce DOM weight.
- Icons are memoized — re-rendering a parent should not re-render all its icon children.

## Usage Rules

| Do | Don't |
|----|-------|
| Use icons to supplement text labels | Use icons as the sole affordance without a tooltip |
| Use consistent sizes within a context | Mix icon sizes in the same toolbar or row |
| Use semantic colors for status icons | Use decorative color that implies meaning |
| Provide `aria-label` on icon-only buttons | Use icons in icon-only buttons without accessible names |
| Use the system icon set | Import icons from multiple different libraries |

## Required Icons

The system must provide icons for these categories at minimum:

- **Navigation:** Home, back, forward, menu, close, expand, collapse, external link
- **Actions:** Add, edit, delete, save, cancel, copy, download, upload, share, print, refresh, search, filter, sort
- **Status:** Success, warning, error, info, pending, loading
- **Data:** Chart, table, list, grid, calendar, clock, user, group, settings, notification
- **Arrows & Chevrons:** Up, down, left, right, expand, collapse, sort ascending, sort descending
- **Formatting:** Bold, italic, code, link, attachment

New icons follow the same grid, stroke, and style rules. They are added to the system through the contribution process — teams do not add one-off icons to individual features.
