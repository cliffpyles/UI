# Component Architecture

The system organizes components into seven levels of abstraction. Each level has a distinct role, a defined relationship to the levels above and below it, and clear rules about what it knows and doesn't know.

## The Seven Levels

### Level 1: Design Tokens

Tokens encode design decisions as named values. They are the foundation everything else references. See [Tokens](./foundations/tokens.md) for the full specification.

Tokens have their own internal hierarchy:
- **Primitive tokens** — raw values: `color.blue.500: #3B82F6`
- **Semantic tokens** — meaning: `color.action.primary: {color.blue.500}`
- **Component tokens** — overrides: `button.background.primary: {color.action.primary}`

### Level 2: Primitives (Atoms)

The smallest UI units. They map close to HTML elements but with token-driven styling. They have no meaningful standalone purpose — they exist to be composed.

**Examples:** `Text`, `Icon`, `Divider`, `Box`, `Badge`, `Dot`, `Spinner`

**Rules:**
- Accept only styling and content props. No behavior.
- The only level that directly references design tokens.
- Should almost never be used directly in application code.
- Changes at this level propagate everywhere — primitives must be extremely stable.

### Level 3: Base Components (Molecules)

Combine primitives into units with a single, coherent purpose. They may have limited behavior (hover, focus, controlled/uncontrolled state) but have no opinion about the data they display or the context they're used in.

**Examples:** `Button`, `Input`, `Checkbox`, `Select`, `Tag`, `Avatar`, `Tooltip`, `Skeleton`

**Rules:**
- Context-agnostic: a `Button` doesn't know if it's in a toolbar or a form.
- API surface is small and stable.
- Handle their own internal accessibility (ARIA roles, keyboard interaction, focus management).
- Primary building blocks for application developers in simple contexts.

### Level 4: Composite Components (Organisms)

Combine base components to solve a specific, recognizable UI problem. They have opinions about layout and interaction flow.

**Examples:** `FormField` (label + input + error + hint), `SearchInput` (input + icon + clear button), `Pagination`, `DateRangePicker`, `Modal`, `Dropdown`, `Card`, `Tabs`

**Rules:**
- Manage internal state (a `Dropdown` knows if it's open or closed).
- Coordinate child behavior (a `FormField` links its label to its input via `htmlFor`/`id` automatically).
- Their API hides internal complexity — you pass `label` and `error` as props, not individual `Text` components.
- No knowledge of application domain or data model.

### Level 5: Domain Components

Aware of the application's data shapes and business concepts, but still reusable across features. This is the level most design systems omit, but it's critical for data-intensive applications.

**Examples:** `MetricCard` (value + label + trend + sparkline), `StatusBadge` (maps status enum to colors/labels), `UserAvatar` (knows how to fetch/display user data), `DataTable` (understands pagination, sorting, filtering as first-class concerns)

**Rules:**
- Encode conventions specific to the product.
- Accept typed domain objects as props or import from the data layer.
- Enforce product-wide consistency for high-frequency patterns.
- The primary productivity multiplier for feature teams.

**The Level 4 / Level 5 boundary** is the most important and most commonly blurred line. A generic `Table` (Level 4) takes generic columns and rows. A `DataTable` (Level 5) knows about sort state, filter state, loading states, empty states, and pagination — it might accept a typed query object rather than raw data.

### Level 6: Pattern Components (Templates)

Full layout arrangements that define structure but don't render content. They answer: "how is this type of page or view organized?"

**Examples:** `DashboardLayout` (sidebar + header + main + detail panel), `DetailView` (breadcrumb + title + actions + tabbed content), `ReportLayout` (filter bar + results + export toolbar), `SplitView` (master list + detail, resizable)

**Rules:**
- Slots-based: define regions, consumers fill them.
- Handle hard layout problems: sticky headers, resizable panels, overflow, responsive reflow.
- Encode navigation and wayfinding conventions.
- The answer to "20 different pages that all need to feel like the same product."

### Level 7: Feature Components (Pages)

Fully assembled UI surfaces wired to real data. These live in the consuming application, not the design system. Named here to define the boundary.

**Examples:** `UserManagementPage`, `RevenueAnalyticsDashboard`, `AuditLogViewer`

**Rules:**
- Own data fetching, routing, and application state.
- Should be thin — significant layout or styling logic belongs one level up.
- Not reusable, but assembable quickly because the building blocks are already solved.

## Dependency Rules

### Dependency flows downward only

A domain component can use a base component. A base component must never import from a domain component. Circular dependencies between levels are a sign the boundary is wrong.

```
Level 7 → Level 6 → Level 5 → Level 4 → Level 3 → Level 2 → Level 1
  (can import from any lower level, never from a higher level)
```

### Each level owns its own API contract

A composite component's API must not leak its internal primitives. If the internal implementation changes from one primitive to another, the consumer must not need to change.

### Customization escapes upward

If a base component needs domain-specific behavior, create a domain component that wraps it. Do not add domain-specific props to the base component.

### Composition-first rule

Components at any level must compose from existing components that already encapsulate the need — primitives for typography and layout, base components for interactive controls, composites for common assemblies, and so on up the hierarchy. Reach for the **nearest suitable abstraction**, not the most atomic one: a `TaskCard` uses `Button`, not a hand-rolled `Box`+`Text` button; a `DataGrid` uses `Checkbox`, not a wired-up native input.

- **Typographic content** (`h1`-`h6`, `p`, `legend`, and any `span` that carries styling) **must** render through the `Text` primitive, using `as` to choose the tag. The `<label>` element is exempt when it functions as a structural wrapper for a form control (click target + implicit association) — the label's own text should still go through `Text` when it carries styling.
- **Layout containers** (flex/stack wrappers, padded regions, surface cards) **should** render through `Box` unless the element's semantics demand a specific tag not supported by `Box`. This includes flex-item concerns — `flex-wrap`, `flex-grow`, and `flex-shrink` are expressed via Box's `wrap`, `grow`, and `shrink` props, not reimplemented in component stylesheets.
- **Interactive controls** (buttons, inputs, checkboxes, selects, tabs, menus, dialogs, etc.) **must** use the existing base/composite component rather than a bespoke implementation. If the existing component doesn't cover a variant you need, extend its API or wrap it in a domain component — do not reimplement the behavior from scratch.
- **Raw HTML is acceptable only when**: (a) semantics require a tag not wrapped by a component (`<table>`, `<nav>`, `<form>`, `<dialog>`, `<ol>`/`<ul>`/`<li>`); (b) the element is an unstyled structural wrapper with no typography, layout, or interactive behavior; or (c) no existing component fits — in which case, **create the component** rather than inlining raw tags or ad-hoc CSS across the codebase.

The direction of composition is upward: primitives wrap raw semantic tags, base components compose primitives, composites compose base components, domain components compose composites, and so on. Reaching past the nearest suitable abstraction is the failure mode — it duplicates behavior, duplicates accessibility, and multiplies the blast radius of future changes.

Rationale: the hierarchy only pays off when each level composes from the levels below. A component that reimplements typography, layout, or interaction concerns with ad-hoc CSS and markup bypasses the token system, drifts from the theme, forks accessibility, and forces every future change to happen in N places instead of one.

### Change blast radius increases downward

Changing a token affects everything. Changing a primitive affects every component using it. Changing a feature component affects one page. This asymmetry demands extreme conservatism at lower levels and permissiveness at higher ones.

### Not every component fits neatly

Some components span levels. A `DataGrid` is simultaneously a composite component (complex internal state) and a domain component (opinions about data fetching, loading, empty states). This is acceptable. The levels are a thinking tool, not a rigid taxonomy. When a component spans levels, document which responsibilities belong to which level's rules.

## Directory Structure

The codebase reflects the architecture:

```
src/
  tokens/                 # Level 1: Design tokens
  primitives/             # Level 2: Atoms (Text, Icon, Box, etc.)
  components/             # Level 3-4: Base and composite components
  domain/                 # Level 5: Domain-aware components
  layouts/                # Level 6: Pattern/template components
```

Feature components (Level 7) live in the consuming application, not in this library.

## Composition Model

### Slots over props for content

When a component accepts variable content, use a slot pattern (children, render props, or named slots) rather than string props that limit what can be rendered.

```tsx
// Prefer: slot-based
<Card header={<CardHeader title="Revenue" action={<Button>Export</Button>} />}>
  {children}
</Card>

// Avoid: prop-based
<Card title="Revenue" showExportButton onExport={handleExport}>
  {children}
</Card>
```

### Compound components for tightly coupled groups

When several components always appear together and share implicit state, use the compound component pattern.

```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Overview</Tabs.Tab>
    <Tabs.Tab>Details</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Overview content</Tabs.Panel>
  <Tabs.Panel>Details content</Tabs.Panel>
</Tabs>
```

### Forwarded refs and spread props

Every component that renders a DOM element forwards its ref and spreads remaining props onto the root element. This enables consumers to add event handlers, data attributes, and test IDs without the component needing to know about them.
