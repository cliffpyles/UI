# Implementation Roadmap

This roadmap defines the phased build plan for the UI design system. Each phase is modular, independently testable, and builds on the output of the previous phase — following the architectural principle that dependencies flow downward through the 7-level hierarchy.

The design documents in `design/` are the source of truth for every specification, convention, and decision referenced here.

## Phase Overview

| Phase | Name | Architecture Level | Key Deliverables |
|-------|------|-------------------|------------------|
| 1 | [Token System & Infrastructure](./phase-01-tokens-and-infrastructure.md) | Level 1 | 3-tier token system, CSS custom properties, theme engine, density provider, a11y test setup, global reset |
| 2 | [Primitives](./phase-02-primitives.md) | Level 2 | Text, Box, Icon, Divider, Badge, Dot, Spinner, VisuallyHidden |
| 3 | [Base Components](./phase-03-base-components.md) | Level 3 | Button, Input, Checkbox, Radio, Toggle, Select, Tag, Avatar, Tooltip, Skeleton |
| 4 | [Composite Components](./phase-04-composite-components.md) | Level 4 | FormField, Dropdown, Modal, Card, Tabs, Accordion, Pagination, SearchInput |
| 5 | [Data Utilities & Display](./phase-05-data-utilities-and-display.md) | Level 3-4 | Formatting utilities, Table, EmptyState, ErrorState, ProgressBar |
| 6 | [Domain Components](./phase-06-domain-components.md) | Level 5 | DataTable, MetricCard, StatusBadge, FilterBar, DateRangePicker |
| 7 | [Layout & Patterns](./phase-07-layouts-and-patterns.md) | Level 6 | DashboardLayout, DetailView, SplitView, ReportLayout, AppShell |
| 8 | [Advanced Features](./phase-08-advanced-features.md) | Cross-cutting | Real-time data, export/sharing, help/onboarding, keyboard shortcut system |

## Dependency Graph

```
Phase 1: Tokens & Infrastructure
    ↓
Phase 2: Primitives
    ↓
Phase 3: Base Components
    ↓
Phase 4: Composite Components ← Phase 5: Data Utilities & Display
    ↓                                ↓
Phase 6: Domain Components ←────────┘
    ↓
Phase 7: Layout & Patterns
    ↓
Phase 8: Advanced Features
```

Phases 4 and 5 can be worked on in parallel — they share a dependency on Phase 3 but not on each other. All other phases are sequential.

## Cross-Cutting Concerns

These are not standalone phases. They are baked into every phase:

### Accessibility (every phase)
- Every component includes axe-core automated tests.
- Every interactive component includes keyboard navigation tests.
- ARIA attributes verified per the patterns in [design/standards/accessibility.md](../design/standards/accessibility.md).
- Manual testing checklist completed before a component is considered done.

### Density (phases 1-6)
- Token system defines density variants in Phase 1.
- Every component from Phase 2 onward supports all three density levels via DensityProvider.
- Density tests are included in every component's test suite.

### Theming (phases 1-6)
- Theme engine and CSS custom properties are established in Phase 1.
- Every component from Phase 2 onward works in both light and dark themes.
- Theme tests are included in every component's test suite.

### Performance (phases 5-8)
- Virtualization support is built into data-rendering components from the start.
- Components avoid unnecessary re-renders via memo/callback strategies.
- Bundle size impact is evaluated for every dependency.

## Per-Phase Deliverable Checklist

Every phase is complete when:

- [ ] All components implemented with full prop API per [design/standards/api-design.md](../design/standards/api-design.md).
- [ ] All components have colocated unit tests covering states, interactions, and a11y.
- [ ] All components use token-based CSS (no hardcoded values).
- [ ] All components support density context (where applicable).
- [ ] All components work in light and dark themes.
- [ ] All components exported from barrel files (`index.ts`).
- [ ] `npm run typecheck`, `npm run lint`, and `npm test` all pass.
- [ ] Dev playground (`src/App.tsx`) updated to showcase new components.

## Current Status

- **Phase 1**: Complete. 3-tier token system (primitives → semantic → component), CSS custom properties pipeline with generation utility, ThemeProvider (light/dark/system), DensityProvider (compact/default/comfortable), CSS reset, vitest-axe test infrastructure, dev playground with theme/density switching.
- **Phase 2**: Complete. All 8 primitives (VisuallyHidden, Text, Box, Icon, Divider, Dot, Badge, Spinner) implemented with full prop APIs, token-based CSS, forwardRef, colocated tests (230 total with axe-core a11y checks), 30 inline SVG icons, barrel exports, and dev playground section.
- **Phases 3-8**: Not started.
