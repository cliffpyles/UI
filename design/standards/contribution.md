# Contribution Model

This document defines how components, patterns, and tokens are proposed, evaluated, and added to the design system. The goal is to balance quality and consistency with the speed teams need to ship.

## Component Lifecycle

### 1. Proposal

Anyone can propose a new component or pattern. A proposal includes:

- **Name**: What the component is called.
- **Problem statement**: What user need does this solve? What are teams doing today without it?
- **Level**: Where does it sit in the architecture hierarchy? (Primitive, Base, Composite, Domain, Pattern)
- **Usage evidence**: At least two distinct use cases across different features. Single-use components belong in the application, not the design system.
- **Similar components**: Does something close already exist? Can an existing component be extended instead?

### 2. Evaluation

Proposals are evaluated against these criteria:

| Criterion | Question |
|-----------|----------|
| **Reusability** | Will at least 2-3 teams/features use this? |
| **Scope** | Is this the right level of abstraction? |
| **Overlap** | Does this duplicate or conflict with an existing component? |
| **Complexity** | Can the API be kept simple? Is the maintenance burden justified? |
| **Accessibility** | Can this meet WCAG AA out of the box? |

A proposal is accepted, sent back for revision, or declined with explanation.

### 3. Design

The accepted component is designed with full specification:

- **Props interface**: All props, types, and defaults.
- **States**: Default, hover, focus, active, disabled, loading, error (as applicable).
- **Variants**: All visual variants with rationale for each.
- **Density**: Compact, default, and comfortable variants (if applicable).
- **Responsive behavior**: How the component adapts at different viewport sizes.
- **Accessibility**: ARIA pattern, keyboard interaction, screen reader behavior.
- **Edge cases**: Long text, empty data, large numbers, RTL text.
- **Composition**: How the component works with other components.

### 4. Implementation

Building the component follows these steps:

1. **Component code** (`<Name>.tsx`): Implementation following the API design spec.
2. **Styles** (`<Name>.css`): BEM-style classes with `ui-` prefix, token-based values.
3. **Tests** (`<Name>.test.tsx`): Unit tests covering all states, interactions, and accessibility.
4. **Documentation**: Usage examples, prop documentation, do/don't guidance.
5. **Review**: Code review covering correctness, API consistency, accessibility, and performance.

### 5. Release

- Component is added to the barrel exports (`src/components/index.ts`, `src/index.ts`).
- Changelog entry describes the new component.
- Announcement to consuming teams.

## Contribution Types

### New Component

Follow the full lifecycle above. New components are the highest-effort contribution.

### Component Enhancement

Adding a new variant, prop, or behavior to an existing component.

- File an issue describing the enhancement and its use case.
- Ensure backward compatibility — existing usage must not break.
- Update tests and documentation.

### Bug Fix

- Identify the component and the expected vs. actual behavior.
- Write a failing test that demonstrates the bug.
- Fix the bug. Ensure the test passes.
- Verify no visual regressions (check visual regression test results).

### Token Addition or Change

- Propose the token with its name, tier, and value.
- Justify why existing tokens don't cover the need.
- If changing a semantic or component token: audit all components that reference it.
- Token removal requires a deprecation period.

### Documentation Improvement

- Anyone can improve documentation at any time.
- Corrections, additional examples, and do/don't guidance are always welcome.
- Architecture-level documentation changes (principles, architecture, token structure) require review.

## What Doesn't Belong in the Design System

| Category | Belongs in | Reason |
|----------|-----------|--------|
| Single-use layouts | Application code | Not reusable |
| Business logic | Application code | Domain-specific |
| API-specific data fetching | Application code | Tied to specific backend |
| Feature flags | Application code | Deployment-specific |
| One-off visual treatments | Application code | Not systematic |
| Components used by only one feature | Application code (or promoted later if usage grows) | Reusability threshold not met |

## Review Checklist

Before merging any design system contribution:

- [ ] Props follow the API design conventions (naming, types, defaults).
- [ ] Component extends appropriate HTML element attributes.
- [ ] Ref is forwarded. Remaining props are spread.
- [ ] All states are implemented (default, hover, focus, disabled, loading, error).
- [ ] Accessibility: axe-core passes, keyboard navigation works, screen reader tested.
- [ ] Tests cover props, events, keyboard interaction, and accessibility.
- [ ] CSS uses `ui-` prefix, BEM modifiers, and token-based values (no hardcoded colors/spacing).
- [ ] Works at all three density levels (if applicable).
- [ ] Works in light and dark themes.
- [ ] Handles edge-case data (long strings, large numbers, null values).
- [ ] Exported from barrel files.
- [ ] Documentation is complete.

## Design/Code Sync

A Figma component that doesn't match the React implementation is worse than useless:

- Every component in the code has a corresponding Figma component.
- Prop variants in code map to Figma component properties.
- When either side changes, the other is updated before the next release.
- Code Connect (or equivalent) links Figma components to their code counterparts.
- Discrepancies between Figma and code are treated as bugs.
