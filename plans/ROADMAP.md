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
| 6 | [Domain Components](./phase-06-domain-components.md) | Level 5 | 80+ domain components across 13 groups: data display, identity, status, tables, filtering, charts, forms, activity, notifications, selection, files, permissions, workflow |
| 7 | [Layout & Pattern Components](./phase-07-layouts-and-patterns.md) | Level 6 | 60+ layout components across 10 groups: page frames, data display layouts, exploration, drill-down, forms, monitoring, reporting, administration, onboarding, navigation |
| 8 | [Advanced Cross-Cutting Features](./phase-08-advanced-features.md) | Cross-cutting | Keyboard shortcut system, coachmark tours, value change animation, real-time data hooks, drag and drop |

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
Phase 7: Layout & Pattern Components
    ↓
Phase 8: Advanced Cross-Cutting Features
```

Phases 4 and 5 can be worked on in parallel — they share a dependency on Phase 3 but not on each other. All other phases are sequential.

### Recommended sub-phase ordering

Phases 6 and 7 are large (80+ and 60+ components respectively). They can be broken into sub-phases executed in group order as defined in each plan file. Within each phase, groups are ordered by dependency — earlier groups are used by later groups.

**Phase 6 natural sub-phases:**
- **6a**: Groups 1-3 — Data display primitives, status & state, notification & messaging (foundation used by everything else)
- **6b**: Groups 4-5 — Data table & grid, filtering & query (core data workflow)
- **6c**: Groups 6-9 — Charts, form inputs, activity & audit, identity & entity
- **6d**: Groups 10-13 — Selection, files, permissions, workflow & task

**Phase 7 natural sub-phases:**
- **7a**: Shared utilities + Groups 1, 10 — ResizablePanel, Breadcrumbs, page frames, navigation frames
- **7b**: Groups 2-4 — Data display layouts, exploration & filtering, detail & drill-down
- **7c**: Groups 5-9 — Forms, monitoring, reporting, administration, onboarding

## Cross-Cutting Concerns

These are not standalone phases. They are baked into every phase:

### Accessibility (every phase)
- Every component includes axe-core automated tests.
- Every interactive component includes keyboard navigation tests.
- ARIA attributes verified per the patterns in [design/standards/accessibility.md](../design/standards/accessibility.md).
- Manual testing checklist completed before a component is considered done.

### Density (phases 1-7)
- Token system defines density variants in Phase 1.
- Every component from Phase 2 onward supports all three density levels via DensityProvider.
- Density tests are included in every component's test suite.

### Theming (phases 1-7)
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
- **Phase 3**: Complete. All 10 base components (Input, Button, Checkbox, Radio/RadioGroup, Toggle, Select, Tag, Avatar, Tooltip, Skeleton) implemented with full prop APIs, token-based CSS, density support, forwardRef, controlled/uncontrolled patterns, colocated tests (188 new, 418 total with axe-core a11y checks), barrel exports, and dev playground section.
- **Phase 4**: Complete. All 8 composite components (FormField, Modal, Dropdown, Card, Tabs, Accordion, Pagination, SearchInput) implemented with compound component APIs, focus trapping, keyboard navigation, controlled/uncontrolled patterns, token-based CSS, density support, forwardRef, colocated tests (174 new, 592 total with axe-core a11y checks), barrel exports, and dev playground section.
- **Phase 5**: Complete. All 7 formatting utilities (formatNumber, formatCompact, formatCurrency, formatPercent, formatDate, formatDuration, formatBytes) with Intl-based locale support and null/NaN handling. 4 display components (EmptyState, ErrorState, ProgressBar, Table) with compound Table API (Header, Body, Footer, Row, Head, Cell), sorting with aria-sort, sticky headers, numeric alignment, truncation, density support, colocated tests (157 new, 749 total with axe-core a11y checks), barrel exports, and dev playground section.
- **Phase 6**: Complete (2026-04-17). All 13 groups implemented — 80+ domain components: data display (MetricValue, MetricCard, TrendIndicator, Sparkline, Delta, Currency, Percentage, Duration, Timestamp, DateRange, FileSize, NumberRange, RatioBar); status & state (StatusBadge, HealthIndicator, ProgressPill, EnvironmentTag, LiveIndicator, StalenessBadge, SyncStatus, ConnectionStatus); identity & entity (UserAvatar, UserChip, UserPicker, TeamBadge, OrgSwitcher, EntityLink, MentionToken); data table & grid (DataTable with useDataTableState, DataTableToolbar, ColumnPicker, RowActionsMenu, BulkActionBar, CellRenderer, ExpandableRow, GroupedRowHeader); filtering & query (FilterChip, FilterPicker, OperatorSelect, ValueInput, QueryExpressionNode, SavedViewPicker, SmartDateRange with presets); charts (TimeSeriesChart, CategoryChart, DistributionChart, FunnelChart, HeatmapGrid, ChartHeader, ChartLegend, ChartTooltip, EmptyChart — SVG-based, no external charting dependency); form & input domain (CurrencyInput, PercentageInput, UnitInput, TagInput, CategoryPicker, FormulaInput, CronInput, GeolocationInput, ColorPicker); activity & audit (ActivityItem, ActivityFeed, ChangeLog, CommentThread, VersionHistory, AuditEntry); notification & messaging (NotificationItem, Toast + ToastProvider + useToast, BannerAlert, InlineMessage, UnreadIndicator); selection & assignment (AssigneePicker, LabelPicker, PriorityPicker, WorkflowStatePicker); file & attachment (FileAttachment, FileUploader, FilePreview, AttachmentList); permission & access (RoleBadge, PermissionRow, AccessIndicator, ShareControl, VisibilityBadge); workflow & task (TaskCard, DueDateIndicator, DependencyLink, WorkflowStepIndicator). Colocated tests (377 new, 1126 total with axe-core a11y checks), barrel exports, and dev playground section.
- **Phase 7**: Complete (2026-04-17). All 10 groups implemented — 60+ layout/pattern components: shared utilities (ResizablePanel, Breadcrumbs); page frames (AppShell, SettingsFrame, DashboardFrame, MultiPanelWorkspace, FullViewportCanvas, WizardFrame); navigation frames (CollapsibleSidebarNav, ContextualSubNav, CommandPalette, MultiWorkspaceSwitcher, TabPersistenceLayout, NotificationActivityCenter); detail & drill-down (MasterDetailLayout, EntityDetailLayout, ContextualDrawerLayout, HierarchicalTreeLayout, BreadcrumbDrillDownLayout, PopoverPeekLayout); data display layouts (DataGridLayout, MetricOverviewLayout, ChartGridLayout, CardListLayout, PivotLayout, TimelineLayout, GraphLayout, MapLayout, KanbanLayout, ComparisonLayout); exploration & filtering (FilterBarLayout, FacetedSearchLayout, QueryBuilderLayout, SavedViewsLayout, GlobalSearchLayout, ExplorationNotebookLayout); forms & data entry (FullPageFormLayout, InlineEditLayout, MultiStepFormLayout, BulkEditLayout, ImportMappingLayout, FormulaEditorLayout); monitoring & alerting (StatusPageLayout, AlertFeedLayout, OperationsCenterLayout, LogExplorerLayout, IncidentDetailLayout, AlertRuleBuilderLayout); reporting & export (ReportViewerLayout, ExportConfigurationLayout, SharedLinkLayout, ScheduledDeliveryLayout, ReportBuilderLayout); administration (UserManagementLayout, AuditLogLayout, PermissionMatrixLayout, IntegrationHubLayout, BillingUsageLayout, APIKeyManagementLayout); onboarding & setup (EmptyStateScaffoldLayout, OnboardingChecklistLayout, DataSourceSetupLayout, SampleDataModeLayout). All use semantic landmark roles, resize-aware panels via ResizablePanel, sticky positioning, responsive breakpoints, and focus management. Colocated tests (362 new, 1488 total with axe-core a11y checks), barrel exports, and dev playground Layouts section.
- **Phase 8**: Complete (2026-04-17). Five cross-cutting systems implemented in `src/features/`: keyboard shortcut system (KeyboardShortcutProvider, useKeyboardShortcut, KeyboardShortcutCheatSheet — platform-aware `mod` key, conflict detection, `?` cheat sheet, form-field suppression); value change animation (useValueChange hook + ValueChangeIndicator wrapper — background flash, ▲/▼ direction arrows, rate limiting, reduced-motion support); real-time data hooks (useConnectionStatus via useSyncExternalStore, useStaleness with fresh/aging/stale/critical thresholds, useOptimisticUpdate with rollback, usePolling with visibility-aware pause); coachmark tour system (Tour with dimmed-overlay cutout, step navigation, localStorage persistence, 7-step cap, keyboard navigation); drag and drop infrastructure (DragDropProvider, Draggable, Droppable with mouse + keyboard (Space/Arrows/Escape) + ARIA live announcements, valid/invalid drop highlighting). Colocated tests (41 new, 1529 total with axe-core a11y checks), barrel exports, and dev playground Advanced Features section.
