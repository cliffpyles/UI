# Testing Strategy

Testing a design system has unique challenges beyond normal application testing. Components must be correct across visual states, screen sizes, browsers, assistive technologies, and data edge cases.

## Testing Layers

### Unit Tests

Test component logic, state management, and API contracts using Vitest and React Testing Library.

**What to test:**
- Props produce expected output (variants, sizes, states).
- Event handlers fire correctly (onClick, onChange, onSubmit).
- Keyboard interactions work (Enter, Escape, Arrow keys).
- ARIA attributes are correctly applied (roles, labels, live regions).
- Controlled vs. uncontrolled component behavior.

**What not to test:**
- Visual styling (that's what visual regression tests are for).
- Internal implementation details (don't test private state or internal method calls).

**Rules:**
- Use `screen.getByRole()` over `getByTestId()`. Test what the user sees, not DOM structure.
- Test all component states: default, hover, focus, active, disabled, loading, error.
- Test with realistic data: long strings, large numbers, empty strings, null values, special characters.
- Test at all density levels if the component supports density.

### Visual Regression Testing

Catch unintended pixel-level changes across components and states.

**Tool:** Chromatic, Percy, or similar screenshot comparison service.

**What to capture:**
- Every component variant at every state (default, hover, focus, disabled, error, loading).
- Every component at all three density levels.
- Key composed patterns (FormField with error, DataTable with selection, Modal with form).
- Light mode and dark mode versions of every component.
- At least two viewport widths: desktop (1280px) and mobile (375px).

**Review process:**
- Visual diffs are reviewed on every PR that changes component code or CSS.
- Intentional changes are approved explicitly — no auto-approve.
- Baseline snapshots are updated when a change is intentional and approved.

### Accessibility Testing

**Automated (every PR):**
- axe-core integrated into the test suite: every component test includes an axe check.
- jest-axe or vitest-axe for assertion: `expect(container).toHaveNoViolations()`.
- Checks: contrast ratios, label associations, ARIA validity, heading hierarchy, landmark structure.
- Catches ~30-40% of accessibility issues.

**Manual (per component, pre-release):**
- Keyboard navigation: tab through, interact, confirm focus management.
- Screen reader: test with VoiceOver and/or NVDA. Confirm announcements and navigation.
- Zoom: test at 200% browser zoom.
- Motion: test with `prefers-reduced-motion: reduce`.
- High contrast: test with `prefers-contrast: more`.

See [Accessibility](./accessibility.md) for the full manual testing checklist.

### Cross-Browser Testing

Components must render correctly in:

| Browser | Versions | Priority |
|---------|----------|----------|
| Chrome | Latest 2 | Primary |
| Firefox | Latest 2 | Primary |
| Safari | Latest 2 | Primary |
| Edge | Latest 2 | Secondary |

**Known cross-browser issues to watch for:**
- Font rendering differences (subpixel rendering, font metrics).
- Scrollbar width and styling (affects layout in dense views).
- Focus outline rendering (varies by browser).
- Date input behavior (native date pickers differ significantly).
- CSS subgrid and container query support.

### Consumer Contract Testing

When a primitive or base component changes, ensure composed components that depend on it still work.

**Approach:**
- Each composite and domain component has integration tests that use the real base components (not mocks).
- When a base component's API changes, the test suite catches breakage in consumers.
- Breaking changes to base components require a migration path — the old API must remain functional (deprecated) for at least one minor version.

## Data Edge Cases

Components must be tested with edge-case data that only appears in production:

| Edge case | Components affected | Test |
|-----------|-------------------|------|
| **Empty string** | Input, Table cell, Badge, Tag | Renders without crashing, shows placeholder or empty state |
| **Very long string** (500+ chars) | Table cell, Card title, Badge | Truncates correctly with tooltip |
| **Very large number** (1,000,000,000+) | Metric, Table cell, Chart axis | Formats with compact notation, doesn't overflow |
| **Negative number** | Metric, Table cell | Displays sign correctly, trend direction is correct |
| **Zero** | Metric, Chart, Progress | Renders as "0", not empty or hidden |
| **Null / undefined** | All data-displaying components | Shows "—" or appropriate empty indicator, doesn't crash |
| **HTML/script in strings** | All text-rendering components | Escaped correctly, never rendered as HTML |
| **Unicode / emoji** | Input, Table, Badge | Renders correctly, doesn't break layout |
| **RTL text** | All text components | Renders in correct direction |
| **Mixed LTR/RTL** | Table with mixed-locale data | Each cell renders its content correctly |
| **Date edge cases** | Date picker, Table | Leap years, timezone boundaries, DST transitions |
| **Thousands of items** | Table, List, Select, Tree | Virtualizes correctly, doesn't crash browser |

## Test Organization

Tests are colocated with their components:

```
src/components/Button/
  Button.tsx
  Button.css
  Button.test.tsx          # Unit + accessibility tests
  Button.stories.tsx       # Visual regression stories (if using Storybook)
```

### Test Naming

```typescript
describe("Button", () => {
  it("renders children as button text", () => { ... });
  it("applies variant class for secondary", () => { ... });
  it("calls onClick when clicked", () => { ... });
  it("does not call onClick when disabled", () => { ... });
  it("is keyboard accessible via Enter and Space", () => { ... });
  it("has no accessibility violations", () => { ... });
});
```

## CI Pipeline

1. **Typecheck**: `tsc -b` — all TypeScript compiles without errors.
2. **Lint**: `eslint .` — no lint violations.
3. **Unit + a11y tests**: `vitest run` — all tests pass.
4. **Visual regression**: Screenshot comparison — no unreviewed visual changes.
5. **Build**: `vite build` — production build succeeds.

All five gates must pass before a PR can be merged.
