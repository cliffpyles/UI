# UI Component Library

A design system and React component library built with Vite + TypeScript, purpose-built for **data-intensive web applications** (dashboards, analytics tools, admin panels, enterprise SaaS).

## Design Documentation

The `design/` directory contains the authoritative documentation for the design system. It is the **source of truth** for all implementation decisions. Start with [design/README.md](./design/README.md) for navigation.

Key documents to read before building components:
- [Principles](./design/principles.md) — trade-off resolution framework
- [Architecture](./design/architecture.md) — 7-level component hierarchy and dependency rules
- [Tokens](./design/foundations/tokens.md) — 3-tier token architecture
- [API Design](./design/standards/api-design.md) — component API conventions
- [Testing](./design/standards/testing.md) — testing strategy and edge cases

## Implementation Roadmap

The `plans/` directory contains the phased build plan. See [plans/ROADMAP.md](./plans/ROADMAP.md) for the overview and phase dependency graph.

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
  tokens/              # Level 1: Design tokens (3-tier)
    primitives/        #   Tier 1: Raw values (colors, spacing, typography, etc.)
    semantic/          #   Tier 2: Meaningful mappings (light/dark, density variants)
    component/         #   Tier 3: Component-specific overrides
    contract.ts        #   Theme contract type definition
  providers/           # ThemeProvider + DensityProvider
  styles/              # Generated CSS custom properties, themes, density, reset
    themes/            #   light.css, dark.css
    density/           #   compact.css, comfortable.css
    tokens.css         #   All primitive tokens as CSS custom properties
    reset.css          #   CSS reset / normalize
  primitives/          # Level 2: Atoms (Text, Icon, Box, etc.) — Phase 2
  components/          # Level 3-4: Base and composite components — Phase 3-4
  domain/              # Level 5: Domain-aware components — Phase 6
  layouts/             # Level 6: Pattern/template components — Phase 7
  utils/               # Formatting utilities — Phase 5
  test/                # Test setup (vitest-axe, custom render helpers)
  index.ts             # Library entry point
```

## Component Conventions

### Creating a New Component

Use the `/new-component` skill or follow these conventions manually. Every component lives in its own directory with these files:

- `<Name>.tsx` — component implementation with `forwardRef`, spread props
- `<Name>.css` — styles using `ui-` prefixed BEM classes and CSS custom properties only
- `<Name>.test.tsx` — tests with axe-core accessibility checks
- `index.ts` — re-exports the component and its props type

Then add the export to the parent directory's `index.ts` and to `src/index.ts`.

### API Rules (from design/standards/api-design.md)

- **Props naming**: `variant`, `size`, `disabled`, `loading`, `className`, `onChange` — consistent across all components.
- **String unions over booleans**: `variant: "primary" | "secondary"`, not `isPrimary: boolean`.
- **Extend HTML attributes**: `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>`.
- **Forward refs**: Every component uses `forwardRef`.
- **Spread remaining props**: After extracting component props, spread the rest onto the root DOM element.
- **Named exports only**: No default exports for components.

### CSS Rules (from design/foundations/tokens.md)

- **All values from tokens**: Colors, spacing, font sizes, radii, shadows, durations, z-indexes — all via `var(--...)` CSS custom properties. Zero hardcoded values.
- **BEM with `ui-` prefix**: `.ui-button`, `.ui-button--primary`, `.ui-button__icon`.
- **Density support**: Use `[data-density="compact"]` selectors where applicable.
- **Theme support**: All colors via semantic custom properties that swap per `[data-theme]`.

### Testing Rules (from design/standards/testing.md)

- Test behavior, not implementation details.
- Use `screen.getByRole()` over `getByTestId()`.
- Every test file includes an axe-core accessibility check.
- Test all states: default, disabled, loading, error, empty (as applicable).
- Test keyboard interactions for all interactive components.
- Test ref forwarding and className merging.
- Test edge cases: empty strings, long text, null values.

## Code Quality

- TypeScript strict mode is enabled. No `any` types. No `@ts-ignore`.
- All components must pass `npm run typecheck`, `npm run lint`, and `npm test`.
- Path alias `@/` maps to `src/`.

## Architecture Decisions

- **CSS approach**: Plain CSS with `ui-` prefixed BEM classes and CSS custom properties. No CSS-in-JS, no Tailwind. Each component owns its styles.
- **3-tier token system**: Primitive → Semantic → Component tokens. Theming swaps semantic token values. See design/foundations/tokens.md.
- **No default exports**: All components use named exports for better refactoring and IDE support.
- **Colocated tests**: Tests live next to the component they test.
- **7-level component hierarchy**: Tokens → Primitives → Base → Composite → Domain → Pattern → Feature. Dependencies flow downward only. See design/architecture.md.
- **Density as a container concern**: Applied via `DensityProvider`, not per-component props. Components inherit density from their container.

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

- **New component scaffold**: Use a subagent to generate the full component directory following the conventions above, while continuing other work in the main context.
- **Design review**: Use the `design:design-critique` or `design:accessibility-review` skills to audit a component's visual design or accessibility.
- **Test coverage**: Spawn a subagent to write tests for an existing component while continuing to build the next component.
- **Cross-component refactor**: When changing tokens or shared patterns, use an Explore subagent to find all affected components before making changes.

## Project Skills

Custom skills for this design system (`.claude/skills/`):

| Skill | Invocation | Purpose |
|-------|-----------|---------|
| `/implement-phase` | `/implement-phase 1` | Build a roadmap phase end-to-end: reads the plan, loads design docs, implements components with tests, verifies completion criteria |
| `/iterate` | `/iterate Button` or `/iterate fix keyboard nav in Dropdown` | Audit and fix existing work — compliance checks against design docs, bug fixes, test expansion, review feedback |
| `/new-component` | `/new-component Popover` or `/new-component MetricCard domain` | Add a new component following the full lifecycle: level classification, API design, implementation, tests, barrel exports |

### Bundled skills also useful here

- `/simplify` — Review changed code for reuse, quality, and efficiency.
- `design:design-system` — Audit naming consistency and hardcoded values.
- `design:accessibility-review` — WCAG 2.1 AA audit on a component or page.
- `engineering:code-review` — Review changes for security, performance, and correctness.
- `engineering:testing-strategy` — Design test strategies for complex components.
