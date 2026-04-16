---
name: iterate
description: Iterate on existing design system work — fix issues, refine components, improve test coverage, resolve linter/type errors, or address review feedback. Use when something needs to be fixed, improved, or brought into compliance with the design documentation.
when_to_use: When a component has bugs, failing tests, missing states, accessibility issues, or doesn't fully comply with the design docs. Also when test coverage needs expansion, CSS needs token migration, or review feedback needs to be addressed.
argument-hint: "[what-to-iterate-on]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - TodoWrite
effort: high
---

# Iterate on Design System Work

You are iterating on existing work in the design system. The goal is to fix, refine, or improve what's already been built — bringing it into full compliance with the design documentation.

## Understand the request

The user's input describes what needs iteration: $ARGUMENTS

If the request is vague (e.g., "iterate on Button"), perform a comprehensive audit. If specific (e.g., "fix the keyboard navigation in Dropdown"), focus narrowly.

## Audit the current state

### 1. Identify the target

Find the component(s), utility, or system being iterated on:

- Use Glob to locate the files: `src/**/$0*` or similar.
- Read the component implementation, CSS, tests, and barrel exports.

### 2. Load the relevant design documentation

Read the design documents that govern this component:

- **Always read:** `design/standards/api-design.md`, `design/standards/accessibility.md`, `design/patterns/states.md`
- **For visual components:** Read the relevant foundation docs (`design/foundations/color.md`, `design/foundations/typography.md`, `design/foundations/spacing-and-density.md`, etc.)
- **For pattern components:** Read the relevant pattern doc (`design/patterns/data-display.md`, `design/patterns/data-entry.md`, etc.)
- **For tests:** Read `design/standards/testing.md`

### 3. Run the current checks

```bash
npm run typecheck 2>&1 | head -40
npm run lint 2>&1 | head -40
npm test 2>&1 | tail -40
```

Note any existing failures — these are part of the iteration scope.

### 4. Perform the compliance audit

Check the component against these requirements from the design docs:

**API compliance** (design/standards/api-design.md):
- [ ] Props use consistent naming (`variant`, `size`, `disabled`, `loading`, `className`, `onChange`)
- [ ] String unions for multi-option props, booleans only for binary concepts
- [ ] Extends appropriate HTML element attributes
- [ ] Ref forwarded with `forwardRef`
- [ ] Remaining props spread onto root DOM element
- [ ] Named exports only

**Token compliance** (design/foundations/tokens.md):
- [ ] No hardcoded color values in CSS — all use `var(--...)` custom properties
- [ ] No hardcoded spacing values — all from spacing tokens
- [ ] No hardcoded font sizes — all from typography tokens
- [ ] No hardcoded border radius, shadows, or z-index values

**State coverage** (design/patterns/states.md):
- [ ] Default state renders correctly
- [ ] Disabled state: reduced opacity, not-allowed cursor, tooltip explains why
- [ ] Loading state (if applicable): shows spinner, disables interaction
- [ ] Error state (if applicable): error visual + message
- [ ] Empty state (if applicable): appropriate empty state variant

**Accessibility** (design/standards/accessibility.md):
- [ ] Keyboard navigation works for all interactions
- [ ] ARIA roles and attributes are correct
- [ ] Focus management: visible focus ring, logical tab order
- [ ] Color is not the sole indicator of meaning
- [ ] 44x44px minimum hit area for interactive elements
- [ ] axe-core test passes

**Test coverage** (design/standards/testing.md):
- [ ] All prop variations tested
- [ ] All interaction events tested
- [ ] Keyboard interactions tested
- [ ] axe-core accessibility test included
- [ ] Ref forwarding tested
- [ ] className merging tested
- [ ] Edge cases tested (empty strings, long text, null values)
- [ ] Density variants tested (if applicable)

**CSS compliance**:
- [ ] All classes use `ui-` prefix with BEM modifiers
- [ ] Density-responsive via `[data-density]` selectors (if applicable)
- [ ] Theme-responsive via CSS custom properties

## Plan the fixes

Create a TodoWrite task list with every issue found in the audit. Order tasks by dependency — fix foundational issues (token compliance, API shape) before surface issues (missing test cases).

## Execute the fixes

For each issue:

1. Make the fix.
2. Run `npm run typecheck` to verify no type regressions.
3. Run `npm test` to verify no test regressions.
4. Mark the task complete.

If fixing one issue reveals another, add it to the task list.

## Final verification

After all fixes:

```bash
npm run typecheck && npm run lint && npm test
```

All must pass. Report what was changed and what remains (if anything is out of scope).

## Iteration modes

### Bug fix mode
When the user reports a specific bug:
1. Reproduce the issue (write a failing test first if possible).
2. Fix the root cause.
3. Verify the fix doesn't regress other behavior.

### Review feedback mode
When the user provides review comments:
1. Read each comment.
2. Address each one as a separate task.
3. Re-run checks after each change.

### Comprehensive audit mode
When the user says "iterate on [component]" without specifics:
1. Run the full compliance audit above.
2. Fix everything that doesn't meet the design doc requirements.
3. This is the most thorough mode — leave no stone unturned.

### Test expansion mode
When the user asks to improve test coverage:
1. Read the existing tests.
2. Compare against the testing strategy in `design/standards/testing.md`.
3. Add missing test cases: edge cases, states, keyboard interactions, density, accessibility.
