# UI Component Library

A design system and React component library built with Vite + TypeScript, purpose-built for **data-intensive web applications** (dashboards, analytics tools, admin panels, enterprise SaaS).

## Design Documentation

The `design/` directory contains the authoritative documentation for the design system. Start with [design/README.md](./design/README.md) for navigation.

Key documents to read before building components:
- [Principles](./design/principles.md) — trade-off resolution framework
- [Architecture](./design/architecture.md) — 7-level component hierarchy and dependency rules
- [Tokens](./design/foundations/tokens.md) — 3-tier token architecture
- [API Design](./design/standards/api-design.md) — component API conventions

## Quick Reference

```bash
npm run dev          # Dev server (component playground)
npm run build        # Type-check + production build
npm run typecheck    # TypeScript only
npm run lint         # ESLint
npm test             # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

## Project Structure

```
src/
  components/        # UI components — each in its own directory
    Button/
      Button.tsx     # Component implementation
      Button.css     # Component styles
      Button.test.tsx# Tests (colocated)
      index.ts       # Public exports
    index.ts         # Barrel file for all components
  tokens/            # Design tokens (colors, spacing, typography)
  test/              # Test setup and utilities
  index.ts           # Library entry point
```

## Component Conventions

### Creating a New Component

Every component lives in `src/components/<Name>/` with these files:

- `<Name>.tsx` — component implementation
- `<Name>.css` — styles using the `ui-` prefix for all class names
- `<Name>.test.tsx` — tests using React Testing Library
- `index.ts` — re-exports the component and its props type

Then add the export to `src/components/index.ts` and `src/index.ts`.

### Naming & Style Rules

- **CSS classes**: Always prefix with `ui-` (e.g., `ui-button`, `ui-button--primary`). Use BEM-style modifiers: `ui-{component}--{variant}`.
- **Props interfaces**: Named `<Component>Props`, extending the appropriate HTML element attributes.
- **Exports**: Named exports only, no default exports for components.
- **Variants/sizes**: Use string literal unions, not booleans. Example: `variant: "primary" | "secondary"`, not `isPrimary: boolean`.

### Testing

- Test behavior, not implementation details.
- Use `screen.getByRole()` over `getByTestId()`.
- Test all variants, disabled states, and user interactions.
- Import from `vitest` for `describe`, `it`, `expect`, `vi`.

### Design Tokens

Tokens are the source of truth for the design system's visual language. When building components:

- Reference token values from `src/tokens/` when choosing colors, spacing, and typography.
- CSS component styles should use the same values defined in tokens for consistency.

## Code Quality

- TypeScript strict mode is enabled. No `any` types. No `@ts-ignore`.
- All components must pass `npm run typecheck`, `npm run lint`, and `npm test`.
- Path alias `@/` maps to `src/`.

## Architecture Decisions

- **CSS approach**: Plain CSS with `ui-` prefixed BEM classes. No CSS-in-JS, no Tailwind. Each component owns its styles.
- **No default exports**: All components use named exports for better refactoring and IDE support.
- **Colocated tests**: Tests live next to the component they test, not in a separate `__tests__` directory.
- **Flat token structure**: Tokens are plain TypeScript objects, not CSS custom properties. Components reference them for consistency.

## Claude Code Hooks

All hooks live in `.claude/hooks/` and are configured in `.claude/settings.json`. They read tool input from stdin (JSON) and exit 2 to feed errors back to Claude for self-correction.

| Hook | Trigger | What it does |
|------|---------|-------------|
| `typecheck.sh` | PostToolUse (Write/Edit) | Runs `tsc -b` on .ts/.tsx edits. Type errors are fed back to Claude. |
| `lint.sh` | PostToolUse (Write/Edit) | Runs ESLint on the changed .ts/.tsx file. Lint errors are fed back to Claude. |
| `test-changed.sh` | PostToolUse (Write/Edit) | Runs Vitest on the changed file when it's a `.test.tsx` file. Failures are fed back to Claude. |

Git pre-commit hook (`.githooks/pre-commit`) runs typecheck + lint + test as a final gate.

## Subagent Patterns

Use subagents for parallelizable or scoped work. Common patterns for this project:

- **New component scaffold**: When creating a new component, use a subagent to generate the full component directory (`<Name>.tsx`, `<Name>.css`, `<Name>.test.tsx`, `index.ts`) following the conventions above, while continuing other work in the main context.
- **Design review**: Use the `design:design-critique` or `design:accessibility-review` skills to audit a component's visual design or accessibility.
- **Test coverage**: Spawn a subagent to write tests for an existing component while continuing to build the next component.
- **Cross-component refactor**: When changing tokens or shared patterns, use an Explore subagent to find all affected components before making changes.

## Skills Reference

Relevant skills for this project:

- `/simplify` — Review changed code for reuse, quality, and efficiency.
- `design:design-system` — Audit naming consistency and hardcoded values.
- `design:accessibility-review` — WCAG 2.1 AA audit on a component or page.
- `engineering:code-review` — Review changes for security, performance, and correctness.
- `engineering:testing-strategy` — Design test strategies for complex components.
