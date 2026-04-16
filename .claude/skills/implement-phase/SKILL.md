---
name: implement-phase
description: Implement a phase from the design system roadmap. Builds components, tokens, utilities, and tests according to the phase plan files in plans/ and the design documentation in design/.
argument-hint: "[phase-number]"
disable-model-invocation: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - TodoWrite
effort: max
---

# Implement Design System Phase

You are implementing **Phase $ARGUMENTS** of the design system roadmap.

## Step 1: Load the plan

Read the phase plan file:

```
plans/phase-$ARGUMENTS-*.md
```

Use Glob to find the exact filename if the number alone doesn't match. Read the entire plan file — it contains the component list, prop specifications, directory structure, development order, testing strategy, and completion criteria.

## Step 2: Load relevant design documentation

The `design/` directory is the **source of truth**. The phase plan references specific design documents. Read every document referenced in the plan's "Source of truth" section before writing any code. These documents define:

- Exact prop names, types, and defaults (design/standards/api-design.md)
- Accessibility requirements (design/standards/accessibility.md)
- State coverage requirements (design/patterns/states.md)
- Token usage rules (design/foundations/tokens.md)
- Testing requirements (design/standards/testing.md)

Cross-reference the design docs throughout implementation — do not rely solely on the plan file's summary of them.

## Step 3: Check current state

Before building anything, understand what already exists:

1. Read `src/index.ts` and any barrel files to see what's already exported.
2. Check `src/tokens/`, `src/primitives/`, `src/components/`, `src/domain/`, `src/layouts/` for existing work.
3. Read `plans/ROADMAP.md` to confirm dependencies — verify that prerequisite phases are complete.
4. If prerequisite phases are not complete, stop and report what's missing.

## Step 4: Set up the task list

Create a TodoWrite task list based on the plan's **Development Order** section. Each component or deliverable in the development order becomes a task. Add a final task for barrel exports and dev playground updates.

## Step 5: Build each deliverable

For each item in the development order:

### Component implementation

1. **Create the directory**: `<ComponentName>/` in the correct parent (`primitives/`, `components/`, `domain/`, or `layouts/`).
2. **Write the component** (`<Name>.tsx`):
   - Follow the prop specification from the plan.
   - Extend the appropriate HTML element attributes per design/standards/api-design.md.
   - Forward ref with `forwardRef`.
   - Spread remaining props onto the root DOM element.
   - Use named exports only — no default exports.
   - Use string literal unions for variants/sizes, never booleans.
3. **Write the styles** (`<Name>.css`):
   - All class names prefixed with `ui-` using BEM modifiers.
   - All values reference CSS custom properties from the token system — zero hardcoded colors, spacing, or font values.
   - Support density via `[data-density]` selectors where applicable.
   - Support theming via CSS custom properties that swap per `[data-theme]`.
4. **Write the barrel** (`index.ts`):
   - Re-export the component and its props type.
5. **Write tests** (`<Name>.test.tsx`):
   - Follow the testing strategy specified in the plan.
   - Include: rendering tests, prop variation tests, interaction tests, keyboard tests, accessibility (axe-core) tests, ref forwarding test, className merging test, edge case tests.
   - Use `screen.getByRole()` over `getByTestId()`.
   - Import from `vitest` for `describe`, `it`, `expect`, `vi`.
   - Test all states specified in design/patterns/states.md that apply to this component.
6. **Update barrel exports**: Add the component to the parent directory's `index.ts` and to `src/index.ts`.

### Utility implementation (formatters, hooks, providers)

1. Write the utility with full TypeScript types.
2. Write comprehensive tests covering standard values, edge cases, and locale variations.
3. Export from the appropriate barrel file.

### After each component

- Mark the task as completed in TodoWrite.
- Run `npm run typecheck` to catch any type errors immediately.
- Run `npm test` to verify all tests pass.
- Fix any failures before moving to the next component.

## Step 6: Update the dev playground

Update `src/App.tsx` to showcase the new components from this phase. Add a section for the phase with examples of each component in various states and variants.

## Step 7: Final verification

Run the full check suite:

```bash
npm run typecheck && npm run lint && npm test
```

All must pass. Fix any failures.

## Step 8: Review against completion criteria

Re-read the **Completion Criteria** section at the bottom of the phase plan. Verify every checkbox item is satisfied. If any are not, address them before considering the phase complete.

## Rules

- **Design docs are the source of truth.** If the plan says one thing and a design doc says another, the design doc wins.
- **No hardcoded values.** Every color, spacing, font size, radius, shadow, duration, and z-index must come from the token system via CSS custom properties.
- **Every component gets tests.** No exceptions. Tests include axe-core accessibility checks.
- **Build in dependency order.** Follow the development order in the plan — earlier items may be needed by later ones.
- **One component at a time.** Finish and verify each component before starting the next.
