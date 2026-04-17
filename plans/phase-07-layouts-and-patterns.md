# Phase 7: Layout & Pattern Components

**Status:** Complete (2026-04-17)
**Architecture Level:** Level 6 (Templates)
**Dependencies:** Phase 6 (Domain Components)
**Source of truth:** [design/architecture.md](../design/architecture.md) (Level 6 rules), [design/foundations/layout.md](../design/foundations/layout.md), [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md), [design/patterns/data-display.md](../design/patterns/data-display.md), [design/patterns/data-entry.md](../design/patterns/data-entry.md), [design/patterns/filtering-and-search.md](../design/patterns/filtering-and-search.md), [design/patterns/error-handling.md](../design/patterns/error-handling.md), [design/patterns/export-and-sharing.md](../design/patterns/export-and-sharing.md), [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md)

## Objective

Build the layout template components that define how pages and views are structured. These are slots-based — they define regions and let consumers fill them. They handle the hard layout problems: fixed + fluid hybrids, resizable panels, sticky elements, overflow management, responsive reflow, and viewport-aware behavior.

Pattern components answer: "How is this type of page or view organized?" If everyone uses `DashboardFrame`, every dashboard feels like the same product.

## Directory Structure

```
src/
  layouts/
    # Group 1: Page Frames
    AppShell/
    MultiPanelWorkspace/
    DashboardFrame/
    FullViewportCanvas/
    SettingsFrame/
    WizardFrame/

    # Group 2: Data Display Layouts
    DataGridLayout/
    MetricOverviewLayout/
    ChartGridLayout/
    CardListLayout/
    PivotLayout/
    TimelineLayout/
    GraphLayout/
    MapLayout/
    KanbanLayout/
    ComparisonLayout/

    # Group 3: Exploration & Filtering
    FacetedSearchLayout/
    QueryBuilderLayout/
    FilterBarLayout/
    SavedViewsLayout/
    GlobalSearchLayout/
    ExplorationNotebookLayout/

    # Group 4: Detail & Drill-Down
    MasterDetailLayout/
    EntityDetailLayout/
    ContextualDrawerLayout/
    HierarchicalTreeLayout/
    BreadcrumbDrillDownLayout/
    PopoverPeekLayout/

    # Group 5: Forms & Data Entry
    FullPageFormLayout/
    InlineEditLayout/
    BulkEditLayout/
    ImportMappingLayout/
    FormulaEditorLayout/
    MultiStepFormLayout/

    # Group 6: Monitoring & Alerting
    OperationsCenterLayout/
    AlertFeedLayout/
    StatusPageLayout/
    LogExplorerLayout/
    IncidentDetailLayout/
    AlertRuleBuilderLayout/

    # Group 7: Reporting & Export
    ReportBuilderLayout/
    ReportViewerLayout/
    ScheduledDeliveryLayout/
    ExportConfigurationLayout/
    SharedLinkLayout/

    # Group 8: Administration
    UserManagementLayout/
    PermissionMatrixLayout/
    AuditLogLayout/
    IntegrationHubLayout/
    BillingUsageLayout/
    APIKeyManagementLayout/

    # Group 9: Onboarding & Setup
    OnboardingChecklistLayout/
    DataSourceSetupLayout/
    EmptyStateScaffoldLayout/
    SampleDataModeLayout/

    # Group 10: Navigation Frames
    CollapsibleSidebarNav/
    ContextualSubNav/
    CommandPalette/
    MultiWorkspaceSwitcher/
    TabPersistenceLayout/
    NotificationActivityCenter/

    # Shared utilities
    ResizablePanel/
    Breadcrumbs/

    index.ts
```

## Component Groups

### Group 1: Page Frames

Top-level layout shells that define the structural skeleton of an application.

| Component | Description | Slots |
|-----------|-------------|-------|
| **AppShell** | Fixed header, persistent sidebar, scrollable main region. The backbone of most data applications. | `header`, `sidebar`, `main` |
| **MultiPanelWorkspace** | Two or more resizable panels. Common in IDEs, BI tools, data editors. | `panels[]` with `ResizablePanel` |
| **DashboardFrame** | Grid-based canvas for arranging widgets/charts/metrics. Fixed or user-configurable placement. | `filterBar`, `widgets[]` with `span` |
| **FullViewportCanvas** | Removes all chrome. For maps, graph visualizations, spatial tools. | `canvas`, `overlay` |
| **SettingsFrame** | Vertical category nav on left, content area on right. For dense configuration pages. | `nav`, `content` |
| **WizardFrame** | Linear, step-by-step frame with progress indication for complex setup flows. | `steps[]`, `footer` |

**AppShell detail:**
```tsx
<AppShell sidebarCollapsed={false} onSidebarCollapse={setCollapsed}>
  <AppShell.Header><Logo /><TopNav /><UserMenu /></AppShell.Header>
  <AppShell.Sidebar><SidebarNav items={navItems} /></AppShell.Sidebar>
  <AppShell.Main>{children}</AppShell.Main>
</AppShell>
```
- Header: fixed height, sticky top, full width, z-index `z.sticky.header`
- Sidebar: fixed width (240px), collapsible to icon rail (56px), scrollable
- Main: fluid, fills remaining space, scrollable
- Responsive: sidebar collapses at tablet, hidden at mobile (hamburger)

**WizardFrame detail:**
```tsx
<WizardFrame currentStep={2} totalSteps={5}>
  <WizardFrame.StepIndicator />
  <WizardFrame.Content>{stepContent}</WizardFrame.Content>
  <WizardFrame.Footer>
    <Button onClick={onBack}>Back</Button>
    <Button onClick={onNext}>Next</Button>
  </WizardFrame.Footer>
</WizardFrame>
```

**Tests per frame:** Renders all slots, all slots optional, responsive breakpoint behavior, sticky positioning, landmark roles (`<header>`, `<nav>`, `<main>`, `<aside>`), keyboard navigation, axe-core.

### Group 2: Data Display Layouts

Arrangements purpose-built for presenting information at scale.

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **DataGridLayout** | Full-page tabular layout with filter/toolbar above, grid below | Toolbar sticky, grid fills remaining height, horizontal scroll |
| **MetricOverviewLayout** | Row/grid of KPI cards at top, supporting charts below | Responsive grid (4 → 3 → 2 → 1 columns), cards reflow |
| **ChartGridLayout** | Multiple charts in responsive grid, independently loaded | Each chart has own loading/error state, resize-aware |
| **CardListLayout** | Entities as cards rather than rows, for rich preview content | Grid or list toggle, sortable, filterable |
| **PivotLayout** | Two-dimensional matrix for cross-tab comparison | Sticky row/column headers, horizontal + vertical scroll |
| **TimelineLayout** | Horizontal time axis with entity rows (scheduling, logs, events) | Time axis zoom, pan, sticky left column |
| **GraphLayout** | Force-directed or hierarchical canvas for relational data | Pan, zoom, node selection, layout algorithm options |
| **MapLayout** | Geographic map as primary content with data panel sidebar | Map fills viewport, sidebar resizable, markers/clusters |
| **KanbanLayout** | Columns representing states with draggable cards | Drag and drop between columns, column scroll, WIP limits |
| **ComparisonLayout** | Two or more entities side-by-side with aligned fields | Synchronized scroll, diff highlighting, field alignment |

**Tests:** Grid responsiveness, sticky headers, independent loading states per widget, drag-and-drop (Kanban), zoom/pan (Timeline, Graph), scroll synchronization (Comparison), axe-core.

### Group 3: Exploration & Filtering

Layouts supporting navigating, querying, and narrowing large datasets.

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **FacetedSearchLayout** | Filter facets in left panel, results in main area | Facet counts update dynamically, collapsible facet groups |
| **QueryBuilderLayout** | Structured interface for complex AND/OR filter expressions | Nested expression groups, add/remove conditions |
| **FilterBarLayout** | Horizontal bar of active filters above data | Scrollable overflow, active filter chips, "Clear all" |
| **SavedViewsLayout** | Named-view management for saved configurations | List/grid of views, create/edit/delete/share |
| **GlobalSearchLayout** | Full-page or modal search with categorized results | Keyboard navigation, recent items, result categories |
| **ExplorationNotebookLayout** | Cell-based layout mixing query, output, and narrative | Add/remove/reorder cells, cell type selection |

**Tests:** Facet count updates, query expression nesting, filter persistence in URL, saved view CRUD, search keyboard navigation (arrow keys through results, Enter to select), axe-core.

### Group 4: Detail & Drill-Down

Patterns for moving from aggregate views into entity-level detail per [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **MasterDetailLayout** | List/table on left, detail panel on right | Selection drives detail, resizable divider, responsive stack |
| **EntityDetailLayout** | Full-page view: title bar, key attributes, actions, tabbed sections | Breadcrumbs, sticky header, tab navigation |
| **ContextualDrawerLayout** | Panel sliding in from right without navigating away | Focus management, overlay/push mode, close on Escape |
| **HierarchicalTreeLayout** | Expandable tree in sidebar driving main content | Lazy loading of children, keyboard tree navigation |
| **BreadcrumbDrillDownLayout** | Each drill-down appends breadcrumb; back restores context | State preservation per level (filters, scroll, sort) |
| **PopoverPeekLayout** | Hover/click reveals rich popover with detail and quick actions | Delay on hover, dismiss on outside click, pin option |

**Tests:** Master selection updates detail, drawer focus trap, tree keyboard navigation (arrow keys, expand/collapse), breadcrumb state restoration, popover positioning, responsive breakpoint stacking, axe-core.

### Group 5: Forms & Data Entry

Layouts for structured input at varying complexity per [design/patterns/data-entry.md](../design/patterns/data-entry.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **FullPageFormLayout** | Single/two-column form with sticky footer actions | Dirty state tracking, unsaved changes dialog |
| **InlineEditLayout** | Table cells/field values become editable on click | Clear edit affordance, per-field validation, Enter/Escape |
| **BulkEditLayout** | Select rows, apply change to shared field across all | Selected count, "Mixed" indicator for differing values |
| **ImportMappingLayout** | Upload file, map columns to schema with validation/preview | Column mapping dropdowns, preview table, validation errors |
| **FormulaEditorLayout** | Code-editor-like panel for calculated fields/rules | Syntax highlighting, autocomplete, live preview |
| **MultiStepFormLayout** | Wizard breakdown of complex data entry | Step progress, per-step validation, back/next/save |

**Tests:** Dirty state detection, unsaved changes dialog on navigate, inline edit commit/cancel, bulk edit "Mixed" rendering, import column mapping, step validation before advance, axe-core.

### Group 6: Monitoring & Alerting

Layouts tuned for operational awareness per [design/patterns/real-time-data.md](../design/patterns/real-time-data.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **OperationsCenterLayout** | High-density, wall-display-optimized with real-time metrics | Auto-scaling to viewport, no interaction required |
| **AlertFeedLayout** | Chronological alert list with severity indicators and inline ack | Severity filtering, batch acknowledge, auto-refresh |
| **StatusPageLayout** | Grid/list of systems with health, uptime history, incidents | Health indicators, uptime sparklines, incident timeline |
| **LogExplorerLayout** | Searchable, filterable, time-windowed log stream | Field extraction, syntax highlighting, time window control |
| **IncidentDetailLayout** | Full-page incident with event timeline, signals, responders | Timeline, signal correlation, responder assignment |
| **AlertRuleBuilderLayout** | Form interface for configuring threshold/anomaly alerts | Condition builder, preview, test, notification channels |

**Tests:** Real-time update handling, alert acknowledgment, severity filtering, log search, time window filtering, alert rule validation, axe-core.

### Group 7: Reporting & Export

Layouts for constructing, scheduling, and delivering data products per [design/patterns/export-and-sharing.md](../design/patterns/export-and-sharing.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **ReportBuilderLayout** | Drag-and-drop or config-driven interface for custom reports | Widget palette, live preview, save/publish |
| **ReportViewerLayout** | Read-only paginated report with fixed header and export | Page navigation, print stylesheet, export actions |
| **ScheduledDeliveryLayout** | Configuration for recurring report delivery | Frequency, recipients, format, time windows |
| **ExportConfigurationLayout** | Modal/panel for format, columns, date range, encoding | Format selection, column picker, scope (filtered/all/selected) |
| **SharedLinkLayout** | Panel for generating shareable URLs and embed code | URL encoding view state, copy button, embed preview |

**Tests:** Report widget placement, export format selection, scope display (row counts), scheduled delivery validation, shared link URL encoding, axe-core.

### Group 8: Administration

Patterns for managing users, permissions, integrations, and platform operations.

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **UserManagementLayout** | User table with role assignment, invitation, bulk ops | Search, invite flow, role assignment, deactivation |
| **PermissionMatrixLayout** | 2D grid mapping roles/users to resources and actions | Checkbox grid, row/column headers sticky, bulk assign |
| **AuditLogLayout** | Filterable chronological log of user actions | Actor, action, resource, timestamp, IP filtering |
| **IntegrationHubLayout** | Catalog of integrations with status and config panels | Category filtering, status indicators, setup wizard |
| **BillingUsageLayout** | Current plan, usage meters, invoice history, upgrade | Usage bars, limit warnings, invoice download |
| **APIKeyManagementLayout** | API credential table with scopes, expiration, revocation | Create key flow, scope selection, last-used timestamp |

**Tests:** User invite flow, permission matrix toggle, audit log filtering, integration status display, usage meter accuracy, API key creation/revocation, axe-core.

### Group 9: Onboarding & Setup

Patterns reducing time-to-value per [design/patterns/help-and-onboarding.md](../design/patterns/help-and-onboarding.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **OnboardingChecklistLayout** | Persistent/dismissible checklist of setup tasks | Completion tracking, progress bar, link to each task |
| **DataSourceSetupLayout** | Wizard for connecting a data source | Credentials, connection test, schema preview, sync settings |
| **EmptyStateScaffoldLayout** | First-run experience for empty sections | Explains value, primary CTA, step-by-step guidance |
| **SampleDataModeLayout** | Banner-framed layout indicating demo data mode | Persistent banner, "Switch to real data" CTA |

**Tests:** Checklist completion persistence, connection test feedback, empty state CTA rendering, sample data banner visibility, axe-core.

### Group 10: Navigation Frames

Structural patterns for moving between areas of the application per [design/patterns/navigation-and-hierarchy.md](../design/patterns/navigation-and-hierarchy.md).

| Component | Description | Key behavior |
|-----------|-------------|-------------|
| **CollapsibleSidebarNav** | Left nav that collapses to icon-only, nested items, pinned favorites | Collapse toggle, tooltip labels when collapsed, nested expand |
| **ContextualSubNav** | Secondary nav bar within a section (tabs or links) | Active state, responsive overflow menu |
| **CommandPalette** | Keyboard-triggered modal for navigating by typing | Fuzzy search, categorized results, recent items, keyboard nav |
| **MultiWorkspaceSwitcher** | Top-level org/workspace selector that switches entire context | Search, recent workspaces, create new |
| **TabPersistenceLayout** | Browser-like tabbed navigation with multiple views open simultaneously | Add/close/reorder tabs, tab overflow, active indicator |
| **NotificationActivityCenter** | Panel/page for notifications, mentions, tasks, data alerts | Tabs by category, mark read, filter by type |

**Tests:** Sidebar collapse/expand, tooltip in collapsed mode, command palette fuzzy search, keyboard navigation through results (↑↓ + Enter), workspace switching, tab add/close/reorder, notification read/unread toggle, axe-core.

### Shared Utilities

Components used internally by multiple layouts:

| Component | Description |
|-----------|-------------|
| **ResizablePanel** | Drag handle + resize logic for panel layouts | `direction`, `onResize`, `minSize`, `maxSize`, keyboard arrows |
| **Breadcrumbs** | Navigation breadcrumbs with collapse for long paths | `items`, `maxItems`, `separator`, ARIA nav |

## Development Order

Build shared utilities first, then page frames, then specialized layouts.

1. **Shared utilities**: ResizablePanel, Breadcrumbs
2. **Group 10: Navigation Frames** (needed by page frames)
   - CollapsibleSidebarNav → ContextualSubNav → CommandPalette → MultiWorkspaceSwitcher → TabPersistenceLayout → NotificationActivityCenter
3. **Group 1: Page Frames** (depend on navigation)
   - AppShell → SettingsFrame → DashboardFrame → MultiPanelWorkspace → FullViewportCanvas → WizardFrame
4. **Group 4: Detail & Drill-Down**
   - MasterDetailLayout → EntityDetailLayout → ContextualDrawerLayout → HierarchicalTreeLayout → BreadcrumbDrillDownLayout → PopoverPeekLayout
5. **Group 2: Data Display Layouts**
   - DataGridLayout → MetricOverviewLayout → ChartGridLayout → CardListLayout → ComparisonLayout → KanbanLayout → PivotLayout → TimelineLayout → GraphLayout → MapLayout
6. **Group 3: Exploration & Filtering**
   - FilterBarLayout → FacetedSearchLayout → QueryBuilderLayout → SavedViewsLayout → GlobalSearchLayout → ExplorationNotebookLayout
7. **Group 5: Forms & Data Entry**
   - FullPageFormLayout → InlineEditLayout → MultiStepFormLayout → BulkEditLayout → ImportMappingLayout → FormulaEditorLayout
8. **Group 6: Monitoring & Alerting**
   - StatusPageLayout → AlertFeedLayout → OperationsCenterLayout → LogExplorerLayout → IncidentDetailLayout → AlertRuleBuilderLayout
9. **Group 7: Reporting & Export**
   - ReportViewerLayout → ExportConfigurationLayout → SharedLinkLayout → ScheduledDeliveryLayout → ReportBuilderLayout
10. **Group 8: Administration**
    - UserManagementLayout → AuditLogLayout → PermissionMatrixLayout → IntegrationHubLayout → BillingUsageLayout → APIKeyManagementLayout
11. **Group 9: Onboarding & Setup**
    - EmptyStateScaffoldLayout → OnboardingChecklistLayout → DataSourceSetupLayout → SampleDataModeLayout
12. Barrel exports + dev playground updates

## Testing Strategy

Layout component tests emphasize:

1. **Slot rendering**: All slots render, all are optional, content fills correctly.
2. **Responsive behavior**: Breakpoint-based layout changes (CSS class checks or container mock).
3. **Resize behavior**: Drag handle, min/max constraints, keyboard support, persistence.
4. **Sticky positioning**: Correct CSS classes/positioning for sticky elements.
5. **Landmark roles**: `<header>`, `<nav>`, `<main>`, `<aside>` used correctly.
6. **Focus management**: Drawer focus trap, command palette focus, modal focus.
7. **Keyboard navigation**: Sidebar expand/collapse, command palette search, tab switching.
8. **Composition**: Layouts compose correctly with domain components from Phase 6.

## Completion Criteria

- [x] All 10 groups implemented (60+ layout components).
- [x] AppShell provides the application frame with collapsible sidebar and responsive behavior.
- [x] All resizable layouts support drag-to-resize with constraints and keyboard support.
- [x] DashboardFrame provides responsive grid with widget slots.
- [x] CommandPalette supports fuzzy search, categorized results, and full keyboard navigation.
- [x] All drill-down layouts preserve state across navigation levels.
- [x] Form layouts handle dirty state, unsaved changes, and validation.
- [x] Monitoring layouts support real-time update rendering.
- [x] All layouts use semantic HTML landmark roles.
- [x] All layouts support density and theming.
- [x] All components have comprehensive tests with axe-core.
- [x] Components exported from `src/layouts/index.ts` and `src/index.ts`.
- [x] Dev playground updated with Layouts section showing composed examples.
- [x] `npm run typecheck && npm run lint && npm test` passes.
