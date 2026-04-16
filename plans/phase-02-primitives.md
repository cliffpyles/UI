# Phase 2: Primitives

**Architecture Level:** Level 2 (Atoms)
**Dependencies:** Phase 1 (Token System & Infrastructure)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 2 rules), [design/standards/api-design.md](../design/standards/api-design.md), [design/foundations/typography.md](../design/foundations/typography.md), [design/foundations/iconography.md](../design/foundations/iconography.md)

## Objective

Build the smallest possible UI units — the atoms that every higher-level component composes. Primitives accept only styling and content props, reference design tokens directly via CSS custom properties, and have no behavior of their own.

## Directory Structure

```
src/
  primitives/               # New directory
    Text/
      Text.tsx
      Text.css
      Text.test.tsx
      index.ts
    Box/
      Box.tsx
      Box.css
      Box.test.tsx
      index.ts
    Icon/
      Icon.tsx
      Icon.css
      Icon.test.tsx
      index.ts
      icons/                # Individual icon SVGs as components
    Divider/
    Badge/
    Dot/
    Spinner/
    VisuallyHidden/
    index.ts                # Barrel export for all primitives
```

## Components

### Text

A polymorphic text rendering primitive. The only component that directly applies typography tokens.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"span" \| "p" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "label" \| "legend"` | `"span"` | HTML element to render |
| `size` | `"2xs" \| "xs" \| "sm" \| "base" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl"` | `"base"` | Font size token |
| `weight` | `"normal" \| "medium" \| "semibold" \| "bold"` | `"normal"` | Font weight |
| `color` | `"primary" \| "secondary" \| "tertiary" \| "disabled" \| "success" \| "warning" \| "error" \| "inherit"` | `"primary"` | Text color semantic token |
| `truncate` | `boolean` | `false` | Single-line truncation with ellipsis |
| `tabularNums` | `boolean` | `false` | Enable tabular (monospaced) numerals |
| `align` | `"start" \| "center" \| "end"` | — | Text alignment (logical properties) |
| `family` | `"sans" \| "mono"` | `"sans"` | Font family |

**CSS:** All values reference CSS custom properties. BEM class: `ui-text`, modifiers: `ui-text--sm`, `ui-text--bold`, `ui-text--truncate`.

**Tests:**
- Renders as the correct HTML element for each `as` value.
- Applies the correct CSS class for each size, weight, color.
- Truncation adds ellipsis class and `title` attribute.
- `tabularNums` applies `font-variant-numeric: tabular-nums`.
- Forwards ref. Spreads remaining props.
- Has no a11y violations.

### Box

A generic layout primitive — a styled `div` with token-driven spacing and background.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `"div" \| "section" \| "article" \| "aside" \| "main" \| "nav" \| "header" \| "footer"` | `"div"` | HTML element |
| `padding` | spacing token key | — | All-sides padding |
| `paddingX` | spacing token key | — | Horizontal padding |
| `paddingY` | spacing token key | — | Vertical padding |
| `gap` | spacing token key | — | Flex/grid gap |
| `display` | `"flex" \| "grid" \| "block" \| "inline-flex"` | — | Display mode |
| `direction` | `"row" \| "column"` | — | Flex direction |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | — | Align items |
| `justify` | `"start" \| "center" \| "end" \| "between"` | — | Justify content |
| `background` | `"surface" \| "raised" \| "sunken"` | — | Background color token |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | — | Border radius |
| `shadow` | `"none" \| "sm" \| "md" \| "lg"` | — | Box shadow |

**Tests:**
- Renders as the correct HTML element for each `as` value.
- Applies correct CSS custom properties for each spacing/color/radius prop.
- Forwards ref. Spreads remaining props.
- Has no a11y violations.

### Icon

Renders SVG icons at a consistent size with `currentColor` inheritance.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string (from available icons) | required | Icon identifier |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"sm"` | Icon size (12/16/20/24/32px) |
| `color` | semantic color key or `"currentColor"` | `"currentColor"` | Icon color |
| `label` | `string` | — | Accessible label. If omitted, icon is `aria-hidden="true"`. |

Per [design/foundations/iconography.md](../design/foundations/iconography.md), icons are inline SVGs. Start with a minimal set of required icons:

**Initial icon set:** `chevron-down`, `chevron-right`, `chevron-up`, `chevron-left`, `x`, `check`, `search`, `plus`, `minus`, `info`, `alert-triangle`, `alert-circle`, `loader`, `external-link`, `edit`, `trash`, `copy`, `download`, `upload`, `filter`, `sort-asc`, `sort-desc`, `more-horizontal`, `eye`, `eye-off`, `calendar`, `clock`, `user`, `settings`, `refresh`

**Tests:**
- Renders SVG element at correct dimensions for each size.
- Uses `currentColor` by default. Applies override color correctly.
- Sets `aria-hidden="true"` when no label.
- Sets `aria-label` when label is provided.
- Sets `role="img"` when label is provided.
- Has no a11y violations.

### Divider

A horizontal or vertical separator line.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `spacing` | spacing token key | `"4"` |

**CSS:** `border-top` (horizontal) or `border-left` (vertical) using `var(--color-border-default)`.

**Tests:**
- Renders `<hr>` for horizontal, `<div role="separator">` for vertical.
- Applies correct orientation class.
- Uses `aria-orientation` attribute.

### Badge

A small label for counts, statuses, or categories.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `variant` | `"neutral" \| "success" \| "warning" \| "error" \| "info"` | `"neutral"` |
| `size` | `"sm" \| "md"` | `"md"` |

**Tests:**
- Renders with correct semantic color for each variant.
- Applies correct size class.
- Renders children as badge content.
- Handles empty string children gracefully.
- Has no a11y violations.

### Dot

A small colored indicator circle, used inline with text for status.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `color` | `"success" \| "warning" \| "error" \| "info" \| "neutral"` | `"neutral"` |
| `size` | `"sm" \| "md"` | `"sm"` |
| `label` | `string` | — | Accessible label (required if Dot is the sole status indicator) |

**Tests:**
- Renders at correct size (6px sm, 8px md).
- Applies correct semantic color.
- `aria-label` applied when `label` provided.
- `aria-hidden="true"` when no label (used alongside text).

### Spinner

A loading indicator.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `label` | `string` | `"Loading"` | Screen reader text |

Per [design/foundations/motion.md](../design/foundations/motion.md): uses rotation animation, replaced with opacity pulse when `prefers-reduced-motion: reduce`.

**Tests:**
- Renders with `role="status"` and `aria-label`.
- Correct size dimensions.
- Animation uses CSS (not JS).
- Reduced motion: animation style changes.

### VisuallyHidden

Hides content visually but keeps it accessible to screen readers.

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `as` | `"span" \| "div"` | `"span"` |

No visual output. Uses the standard visually-hidden CSS clip technique.

**Tests:**
- Content is not visible (zero dimensions, overflow hidden).
- Content is present in the accessibility tree.
- Correct HTML element rendered.

## Development Order

1. VisuallyHidden (simplest, needed by other primitives for a11y)
2. Text (foundational typography primitive)
3. Box (foundational layout primitive)
4. Icon (start with 5-10 core icons, expand as needed)
5. Divider
6. Dot
7. Badge
8. Spinner
9. Barrel exports + dev playground updates

## Testing Strategy

Every primitive test file follows this pattern:

```typescript
describe("ComponentName", () => {
  // Rendering
  it("renders with default props", () => { ... });
  it("renders as correct HTML element", () => { ... });

  // Props
  it("applies [prop] correctly", () => { ... }); // one per prop

  // Accessibility
  it("has no accessibility violations", async () => {
    const { container } = render(<Component>...</Component>);
    expect(await axe(container)).toHaveNoViolations();
  });

  // API contract
  it("forwards ref to DOM element", () => { ... });
  it("spreads additional props onto root element", () => { ... });

  // Edge cases
  it("handles empty children", () => { ... });
  it("applies className alongside component classes", () => { ... });

  // Density (if applicable)
  it("renders correctly at compact density", () => { ... });
  it("renders correctly at comfortable density", () => { ... });
});
```

## Completion Criteria

- [x] All 8 primitives implemented with full props.
- [x] All primitives use CSS custom properties — zero hardcoded values.
- [x] All primitives forward refs and spread remaining props.
- [x] All primitives have colocated tests with axe-core a11y checks.
- [x] Icon component includes the initial icon set (30+ icons).
- [x] Primitives exported from `src/primitives/index.ts`.
- [x] Dev playground updated with a Primitives section.
- [x] All tests pass: `npm run typecheck && npm run lint && npm test`.
