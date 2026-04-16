# Spacing & Density

The central tension in data-intensive design: showing as much information as possible while maintaining readability. The system resolves this through a density scale that governs spacing, padding, and gap values — applied at the container level, not per-component.

## Spacing Scale

A base-4 scale (with half-steps at the small end for fine control in dense layouts):

| Token | Value | px at 16px base |
|-------|-------|-----------------|
| `spacing.0` | 0 | 0 |
| `spacing.px` | 1px | 1 |
| `spacing.0.5` | 0.125rem | 2 |
| `spacing.1` | 0.25rem | 4 |
| `spacing.1.5` | 0.375rem | 6 |
| `spacing.2` | 0.5rem | 8 |
| `spacing.2.5` | 0.625rem | 10 |
| `spacing.3` | 0.75rem | 12 |
| `spacing.4` | 1rem | 16 |
| `spacing.5` | 1.25rem | 20 |
| `spacing.6` | 1.5rem | 24 |
| `spacing.8` | 2rem | 32 |
| `spacing.10` | 2.5rem | 40 |
| `spacing.12` | 3rem | 48 |
| `spacing.16` | 4rem | 64 |
| `spacing.20` | 5rem | 80 |
| `spacing.24` | 6rem | 96 |

## Density Scale

Three density levels. Each adjusts spacing, padding, font size, and line height.

### Compact

For power users, data-dense views, trading terminals, and any context where screen real estate is at a premium.

- Body font size: 12px
- Line height: 1.25 (tight)
- Component padding: reduced by ~40%
- Content gap: `spacing.1` (4px)
- Section gap: `spacing.3` (12px)

### Default

The standard density for most views. Balances information density with comfortable readability.

- Body font size: 14-16px
- Line height: 1.5 (normal)
- Component padding: standard
- Content gap: `spacing.3` (12px)
- Section gap: `spacing.6` (24px)

### Comfortable

For content-focused views, onboarding, settings, and any context where users benefit from more white space.

- Body font size: 16px
- Line height: 1.5 (normal)
- Component padding: increased by ~25%
- Content gap: `spacing.4` (16px)
- Section gap: `spacing.8` (32px)

## How Density Is Applied

Density is set on a container (panel, section, page), and all components inside inherit it. A single page can have multiple density zones.

```tsx
<DensityProvider density="compact">
  <DataTable ... />   {/* Renders at compact density */}
</DensityProvider>

<DensityProvider density="comfortable">
  <DetailPanel ... /> {/* Renders at comfortable density */}
</DensityProvider>
```

In CSS, density is expressed via a data attribute on the container, which swaps spacing custom properties:

```css
[data-density="compact"] {
  --spacing-content-gap: var(--spacing-1);
  --spacing-section-gap: var(--spacing-3);
  --spacing-component-padding-y: var(--spacing-1);
  --spacing-component-padding-x: var(--spacing-2);
  --font-size-body: var(--font-size-xs);
}
```

**Rule:** Compact density never sacrifices legibility or minimum interaction target sizes. If a component cannot be made compact while remaining usable and accessible, it does not get a compact variant.

## Spacing Rules

### Semantic spacing tokens

Rather than picking arbitrary spacing values, components use semantic spacing tokens:

| Token | Purpose | Compact | Default | Comfortable |
|-------|---------|---------|---------|-------------|
| `spacing.content.gap` | Gap between related items | 4px | 12px | 16px |
| `spacing.section.gap` | Gap between sections | 12px | 24px | 32px |
| `spacing.page.padding` | Page-level padding | 12px | 24px | 32px |
| `spacing.component.padding.x` | Horizontal component padding | 8px | 16px | 20px |
| `spacing.component.padding.y` | Vertical component padding | 4px | 8px | 10px |
| `spacing.inline.gap` | Gap between inline items (icon + text) | 4px | 8px | 8px |

### Spacing application rules

1. **Consistent gaps within a context.** All items at the same hierarchy level use the same gap. Don't mix 8px and 12px gaps between sibling cards.
2. **Larger gaps between groups, smaller within.** Section gap > content gap > inline gap. This creates visual grouping without borders.
3. **Padding is proportional to content importance.** A page-level container has more padding than a card, which has more padding than a table cell.
4. **No arbitrary spacing.** Every spacing value comes from the scale. If the scale doesn't have what you need, the design should be reconsidered — not the scale.

## Touch Targets

Minimum interactive target size is 44x44px (WCAG 2.2 Success Criterion 2.5.8), even in compact density. If a button's visual presentation is 28px tall, its clickable area extends invisibly to 44px.

Implementation: use `min-height: 44px` on interactive elements with padding, or extend the hit area with `::before`/`::after` pseudo-elements with negative margins.

```css
.ui-button--sm {
  /* Visual size */
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  
  /* Hit area guarantee */
  position: relative;
  min-height: 2.75rem; /* 44px */
}
```
