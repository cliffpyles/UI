---
name: new-component
description: Add a new component to the design system following the architecture, API conventions, and testing standards defined in the design documentation. Handles the full lifecycle from proposal evaluation through implementation and testing.
when_to_use: When the user wants to add a new component, primitive, or domain component to the design system. Also when extending an existing component with a new variant or significant new functionality.
argument-hint: "[component-name] [level?]"
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
effort: high
---

# Add a New Component to the Design System

You are adding a new component to the design system. The component must follow the architecture, conventions, and standards defined in the design documentation. The design docs are the **source of truth** for every decision.

**Component:** $ARGUMENTS

## Step 1: Determine the architecture level

Read `design/architecture.md` and classify the component into one of the six library levels:

| Level | Directory | Description |
|-------|-----------|-------------|
| 2 — Primitive | `src/primitives/` | Smallest UI unit, no behavior, directly references tokens |
| 3 — Base | `src/components/` | Single-purpose, context-agnostic, handles own accessibility |
| 4 — Composite | `src/components/` | Combines base components, manages internal state |
| 5 — Domain | `src/domain/` | Aware of data shapes and business concepts |
| 6 — Pattern | `src/layouts/` | Full layout arrangements, slots-based |

If the user specified a level (e.g., "Button base" or "MetricCard domain"), use that. Otherwise, determine the level based on:
- Does it have behavior? If no → Level 2 (Primitive).
- Does it combine other components? If no → Level 3 (Base).
- Does it manage internal state and coordinate children? If yes → Level 4 (Composite).
- Does it know about data shapes or business concepts? If yes → Level 5 (Domain).
- Does it define page/view structure with slots? If yes → Level 6 (Pattern).

## Step 2: Evaluate against contribution criteria

Read `design/standards/contribution.md` and verify the component meets the inclusion criteria:

- **Reusability**: Will at least 2-3 features use this? If it's single-use, it belongs in the application code.
- **Overlap**: Does something close already exist? Search the codebase:
  ```
  Glob: src/**/*.tsx
  Grep: similar component names or functionality
  ```
  If an existing component can be extended instead, recommend that.
- **Level correctness**: Is this the right abstraction level? A component that needs domain knowledge shouldn't be at Level 3.

If the component doesn't meet the criteria, explain why and suggest alternatives (wrapper component in the application, extension of an existing component, etc.).

## Step 3: Load design documentation

Read the design documents relevant to this component's level and function:

**Always read:**
- `design/standards/api-design.md` — Prop naming, composition patterns, ref forwarding
- `design/standards/accessibility.md` — ARIA patterns, keyboard interaction, focus management
- `design/standards/testing.md` — Testing strategy, edge cases, test organization
- `design/patterns/states.md` — State coverage requirements

**Read based on component type:**
- Form inputs → `design/patterns/data-entry.md`
- Data display → `design/patterns/data-display.md`
- Navigation → `design/patterns/navigation-and-hierarchy.md`
- Layout → `design/foundations/layout.md`
- Any visual component → `design/foundations/color.md`, `design/foundations/typography.md`, `design/foundations/spacing-and-density.md`

## Step 4: Design the component API

Based on the design docs and the component's purpose, define:

### Props interface

Follow these rules from `design/standards/api-design.md`:
- Extend the appropriate HTML element attributes.
- Use consistent prop names: `variant`, `size`, `disabled`, `loading`, `className`, `onChange`.
- String literal unions for multi-option props.
- Booleans only for genuinely binary concepts.

### Composition pattern

Determine which pattern fits:
- **Simple component**: Props-based, single root element.
- **Compound component**: `Component.SubComponent` pattern for tightly coupled groups.
- **Slots**: Named slots (header, footer, etc.) for flexible content areas.

### States

List every state this component needs per `design/patterns/states.md`:
- Default, hover, focus, active, disabled
- Loading, error, empty (if data-displaying)
- Read-only, restricted (if applicable per `design/patterns/permissions-and-access.md`)

Present the proposed API to the user before implementing. Example:

```
Proposed API for [ComponentName]:
- Level: [N] ([directory])
- Props: [list with types]
- States: [list]
- Composition: [pattern]
- ARIA: [pattern reference]
```

## Step 5: Implement

Create the task list and build the component:

### Directory structure

```
src/[directory]/[ComponentName]/
  [ComponentName].tsx
  [ComponentName].css
  [ComponentName].test.tsx
  index.ts
```

### Component file (`[ComponentName].tsx`)

```tsx
import { forwardRef, type [Element]HTMLAttributes, type ReactNode } from "react";
import "./[ComponentName].css";

export interface [ComponentName]Props extends [Element]HTMLAttributes<HTML[Element]Element> {
  // Component-specific props with JSDoc comments
}

export const [ComponentName] = forwardRef<HTML[Element]Element, [ComponentName]Props>(
  ({ variant = "default", size = "md", className = "", children, ...props }, ref) => {
    const classes = [
      "ui-[component-name]",
      `ui-[component-name]--${variant}`,
      `ui-[component-name]--${size}`,
      className,
    ].filter(Boolean).join(" ");

    return (
      <[element] ref={ref} className={classes} {...props}>
        {children}
      </[element]>
    );
  }
);

[ComponentName].displayName = "[ComponentName]";
```

### Styles file (`[ComponentName].css`)

- All classes prefixed with `ui-[component-name]`.
- BEM modifiers: `ui-[component-name]--[variant]`, `ui-[component-name]__[element]`.
- All values via CSS custom properties: `var(--color-...)`, `var(--spacing-...)`, `var(--font-...)`.
- Density support via `[data-density="compact"]` selectors.
- No hardcoded values — this is enforced.

### Test file (`[ComponentName].test.tsx`)

Follow the structure from `design/standards/testing.md`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe"; // or jest-axe adapter
import { describe, expect, it, vi } from "vitest";
import { [ComponentName] } from "./[ComponentName]";

describe("[ComponentName]", () => {
  // Rendering
  it("renders with default props", () => { ... });
  it("renders children", () => { ... });

  // Props — one test per prop
  it("applies [variant] class", () => { ... });
  it("applies [size] class", () => { ... });

  // Interactions
  it("[interaction description]", async () => { ... });

  // Keyboard
  it("handles [key] key", async () => { ... });

  // States
  it("renders disabled state", () => { ... });
  it("renders loading state", () => { ... });

  // API contract
  it("forwards ref to DOM element", () => { ... });
  it("spreads additional props", () => { ... });
  it("merges className with component classes", () => { ... });

  // Accessibility
  it("has no accessibility violations", async () => {
    const { container } = render(<[ComponentName]>...</[ComponentName]>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Edge cases
  it("handles empty children", () => { ... });
  it("handles very long text content", () => { ... });
});
```

### Barrel exports

1. Create `index.ts` in the component directory:
   ```tsx
   export { [ComponentName] } from "./[ComponentName]";
   export type { [ComponentName]Props } from "./[ComponentName]";
   ```

2. Add to the parent directory's `index.ts` (e.g., `src/components/index.ts`).

3. Add to `src/index.ts` (the library entry point).

## Step 6: Verify

```bash
npm run typecheck && npm run lint && npm test
```

All must pass.

## Step 7: Update the dev playground

Add the new component to `src/App.tsx` with examples showing:
- All variants
- All sizes
- Key states (disabled, loading, error)
- Composition patterns (if compound component)

## Step 8: Review against the contribution checklist

Read the **Review Checklist** in `design/standards/contribution.md` and verify every item:

- [ ] Props follow API design conventions
- [ ] Component extends appropriate HTML element attributes
- [ ] Ref forwarded, remaining props spread
- [ ] All states implemented
- [ ] Accessibility: axe-core passes, keyboard navigation works
- [ ] Tests cover props, events, keyboard, accessibility
- [ ] CSS uses `ui-` prefix, BEM modifiers, token-based values
- [ ] Works at all three density levels (if applicable)
- [ ] Works in light and dark themes
- [ ] Handles edge-case data
- [ ] Exported from barrel files

Report any items that couldn't be satisfied and why.
