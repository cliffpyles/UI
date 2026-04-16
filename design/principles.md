# Design Principles

These principles guide every design decision in the system. When requirements conflict — and in data-intensive applications they always will — use these principles as the framework for resolving trade-offs.

## 1. Data First, Decoration Never

Every visual element must serve the data. Decoration that doesn't help a user read, compare, or act on information has no place in a data-intensive interface.

**Implications:**
- No ornamental borders, shadows, or gradients unless they create meaningful visual hierarchy.
- Animation is only justified when it helps the user track a state change or understand a transition. Decorative motion is removed.
- White space is a tool for grouping and readability, not aesthetics.

## 2. Density Is a Spectrum, Not a Setting

Different contexts within the same application demand different information densities. A trading terminal needs extreme density. An executive summary needs breathing room. The system must support both without feeling like two different products.

**Implications:**
- Every spacing, font-size, and padding value exists at three density levels: compact, default, and comfortable.
- Density is applied at the container level, not the individual component level. A panel is compact or comfortable — the components inside it inherit the density context.
- Compact density never sacrifices legibility or minimum interaction target sizes. If a component can't be made compact and remain usable, it doesn't get a compact variant.

## 3. Every State Is a Design Decision

Data applications have more states than marketing sites. A component that handles the happy path but breaks on empty data, loading failures, or stale information is incomplete. "It works when there's data" is not a shippable state.

**Implications:**
- Every component design includes: loading, empty, error, partial data, and stale states.
- Empty states are distinguished by cause: no data exists, no results match, an error occurred, or the user hasn't started yet. Each gets a different treatment.
- Stale and loading states are designed explicitly — they are not merely the absence of fresh data.

## 4. Accessibility Is a Constraint, Not a Feature

Accessibility requirements shape the design from the beginning. They are not a checklist applied at the end. Dense UIs are inherently hostile to accessibility, which means this system must actively work against that tendency.

**Implications:**
- Minimum touch/click targets of 44x44px are enforced even in compact density. If a component's visual presentation is smaller, its hit area must extend invisibly to meet the minimum.
- Color is never the only indicator of meaning. Status, severity, and category always have a secondary signal (icon, text, pattern).
- Keyboard navigation works for every component, including complex ones like data grids and date pickers.
- Screen reader announcements for live data updates use appropriate ARIA live regions and politeness levels.

## 5. Composition Over Configuration

Complex UI is built by composing simple components, not by passing fifty props to a monolithic one. When a component becomes too flexible, it becomes unpredictable.

**Implications:**
- Favor small, focused component APIs over large, configurable ones.
- Complex views (filter bars, toolbars, detail panels) are assembled from composable primitives, not provided as all-in-one components with extensive configuration.
- Render props and slots are preferred over boolean flags for conditional content.
- If a prop only makes sense in one context, it belongs on a domain wrapper component, not the base component.

## 6. Performance Is a Feature

Rendering 10,000 rows or 50 charts on a dashboard is a core use case, not an edge case. Components that work at small scale but degrade at data-realistic scale are broken.

**Implications:**
- Virtualization is designed in from the start for lists, tables, and trees — not retrofitted.
- Components avoid unnecessary re-renders. Memoization strategies are defined at the component level.
- Animations and transitions are disabled or simplified at high data volumes.
- Bundle size impact is considered for every dependency.

## 7. Tokens Are the Source of Truth

No component hardcodes a color, spacing value, or font size. Every visual decision is expressed as a token, and tokens flow through a tiered system (primitive → semantic → component) that makes theming, dark mode, and white-labeling possible by design.

**Implications:**
- Changing a semantic token changes every component that uses it, consistently.
- Component-level tokens exist to handle cases where a semantic token applies to most contexts but needs a specific override.
- Raw CSS values in component styles are treated as bugs.

## 8. Convention Eliminates Decisions

Where a pattern is used more than once, it is codified. Developers should not need to decide how to show a loading state, how to format a number, or how to lay out a detail panel. The system makes these decisions once, and everyone inherits the answer.

**Implications:**
- Domain components (MetricCard, StatusBadge, DataTable) encode product-level conventions so that every instance is consistent.
- Layout templates (DashboardLayout, DetailView) provide the answer to "how should this page be structured" without per-page decisions.
- Data formatting (numbers, dates, currencies) has a single, centralized strategy.

## Trade-Off Resolution

When principles conflict, resolve in this priority order:

1. **Accessibility** — never compromised.
2. **Data integrity** — the user must always be able to trust what they see.
3. **Performance** — a correct but unusable interface serves no one.
4. **Consistency** — similar things look and work the same way.
5. **Density** — show as much as the user needs, but no more than they can process.
6. **Aesthetics** — the interface should be clean and professional, but this is the first thing that yields.

This ordering means, for example: if showing a tooltip requires a larger hit target that reduces density, density yields to accessibility. If a live-updating animation causes performance jank at high data volumes, aesthetics yield to performance.
