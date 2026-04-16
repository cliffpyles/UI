# Accessibility

Dense UIs are inherently hostile to accessibility. This system actively works against that tendency. Accessibility requirements shape the design from the beginning — they are constraints, not a checklist applied at the end.

**Target conformance:** WCAG 2.1 AA across all components and patterns.

## Core Requirements

### Color and Contrast

- All text meets 4.5:1 contrast ratio against its background (3:1 for large text ≥ 18px).
- UI components (borders, icons, form controls) meet 3:1 against adjacent colors.
- **Color is never the sole indicator of meaning.** Status, severity, trends, and categories always have a secondary signal: icon, text label, or pattern.
- All designs are tested against protanopia, deuteranopia, and tritanopia simulations.

### Touch and Click Targets

Minimum interactive target size: **44x44px** (WCAG 2.2, 2.5.8).

This applies even in compact density. If a button's visual presentation is 28px tall, its hit area extends to 44px via padding or pseudo-element expansion.

```css
/* Small button with accessible hit area */
.ui-button--sm {
  padding: 6px 12px; /* Visual size */
  position: relative;
}
.ui-button--sm::before {
  content: '';
  position: absolute;
  inset: -8px; /* Expand hit area */
}
```

Adjacent interactive targets must have at least 8px spacing between their hit areas (not just their visual bounds).

### Focus Management

- All interactive elements are focusable via keyboard.
- Focus indicators are visible and meet 3:1 contrast: 2px outline in `color.focus.ring`.
- Focus is never trapped (except in modals, where focus is contained within the modal until dismissed).
- Focus follows a logical tab order that matches visual reading order.
- When content changes dynamically (modal opens, panel expands), focus moves to the new content.
- When dynamic content is dismissed, focus returns to the triggering element.

### Keyboard Navigation

Every component supports full keyboard interaction:

| Component | Keyboard |
|-----------|----------|
| **Button** | Enter/Space to activate |
| **Dropdown** | Enter/Space to open, arrows to navigate, Enter to select, Escape to close |
| **Modal** | Tab to cycle focus within, Escape to close |
| **Tabs** | Arrow keys to switch tabs, Tab to enter tab panel content |
| **Table** | Arrow keys to navigate cells, Enter to activate, Space to select |
| **Tree** | Arrow keys up/down between nodes, Right to expand, Left to collapse |
| **Date picker** | Arrow keys to navigate calendar, Enter to select, Escape to close |
| **Slider** | Arrow keys to adjust value, Home/End for min/max |

### Screen Readers

- All images have `alt` text (or `alt=""` if decorative).
- Form inputs are linked to labels via `htmlFor`/`id`.
- Error messages are linked to fields via `aria-describedby`.
- Table headers use proper `scope` attributes.
- Dynamic content updates use ARIA live regions (see below).
- Icons used as the sole content of interactive elements have `aria-label`.
- Decorative icons have `aria-hidden="true"`.

## Dense UI Strategies

### ARIA Live Regions

Data apps have frequently updating content. Screen reader announcements must be carefully managed:

| Update type | ARIA | Politeness |
|-------------|------|------------|
| Critical alerts | `role="alert"` | Assertive (interrupts) |
| Connection state changes | `aria-live="assertive"` | Assertive |
| Filter result counts | `aria-live="polite"` | Polite (announced at pause) |
| Data value updates | None by default | Not announced unless user opts in |
| Loading/progress | `aria-live="polite"` or `role="status"` | Polite |

**Rule:** Never announce every cell update in a live data table. This makes the screen reader unusable. Only announce user-initiated changes and critical alerts.

### Complex Component Patterns

Refer to [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) for detailed patterns. Components in this system follow these patterns:

| Component | ARIA Pattern |
|-----------|-------------|
| Dropdown | Listbox or Menu |
| Tabs | Tabs |
| Modal | Dialog (modal) |
| Data table | Grid (interactive) or Table (read-only) |
| Tree view | Tree View |
| Accordion | Accordion |
| Combobox | Combobox |
| Date picker | Dialog with Grid |
| Toast | Alert or Status |
| Tooltip | Tooltip |

### Reduced Motion

`prefers-reduced-motion: reduce` is respected globally. See [Motion](../foundations/motion.md) for details. When active:
- Transitions use 0ms duration (instant changes).
- Loading spinners use opacity pulse instead of rotation.
- Chart animations are disabled.

### High Contrast

`prefers-contrast: more` support:
- Border widths increase from 1px to 2px.
- Focus outlines increase from 2px to 3px.
- Background color differences between surface levels become more pronounced.
- Text contrast ratios exceed 7:1 (AAA level).

## Testing Protocol

### Automated Testing

Run on every component, every PR:
- axe-core: Catches ~30-40% of accessibility issues.
- Checks: color contrast, label association, ARIA attribute validity, heading hierarchy, landmark structure.

### Manual Testing Checklist

Required before a component is considered complete:

- [ ] Navigate the entire component using only keyboard. All interactions work.
- [ ] Tab through the component. Focus order is logical.
- [ ] Test with VoiceOver (macOS) or NVDA (Windows). All content and state changes are announced.
- [ ] Test with browser zoom at 200%. Layout remains usable.
- [ ] Test with `prefers-reduced-motion: reduce`. No required information is lost.
- [ ] Test with high contrast mode. All information remains visible.
- [ ] Verify all interactive elements have 44x44px minimum target size.
- [ ] Verify color is not the sole differentiator for any information.

### Accessibility Review Gates

- **Component level**: Every new component passes automated + manual testing before merge.
- **Pattern level**: Every new pattern doc includes accessibility considerations.
- **Release level**: Each release includes a representative accessibility audit of assembled views.
