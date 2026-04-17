// Shared utilities
export { ResizablePanel } from "./ResizablePanel";
export type { ResizablePanelProps, ResizeDirection } from "./ResizablePanel";

export { Breadcrumbs } from "./Breadcrumbs";
export type { BreadcrumbsProps, BreadcrumbItem } from "./Breadcrumbs";

// Group 10: Navigation Frames
export { CollapsibleSidebarNav } from "./CollapsibleSidebarNav";
export type {
  CollapsibleSidebarNavProps,
  SidebarNavItem,
} from "./CollapsibleSidebarNav";

export { ContextualSubNav } from "./ContextualSubNav";
export type { ContextualSubNavProps, SubNavItem } from "./ContextualSubNav";

export { CommandPalette } from "./CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./CommandPalette";

export { MultiWorkspaceSwitcher } from "./MultiWorkspaceSwitcher";
export type {
  MultiWorkspaceSwitcherProps,
  Workspace,
} from "./MultiWorkspaceSwitcher";

export { TabPersistenceLayout } from "./TabPersistenceLayout";
export type {
  TabPersistenceLayoutProps,
  PersistentTab,
} from "./TabPersistenceLayout";

export { NotificationActivityCenter } from "./NotificationActivityCenter";
export type {
  NotificationActivityCenterProps,
  ActivityNotification,
  NotificationCategoryDef,
  NotificationCategory,
} from "./NotificationActivityCenter";

// Group 1: Page Frames
export { AppShell } from "./AppShell";
export type { AppShellProps } from "./AppShell";

export { SettingsFrame } from "./SettingsFrame";
export type { SettingsFrameProps, SettingsCategory } from "./SettingsFrame";

export { DashboardFrame } from "./DashboardFrame";
export type { DashboardFrameProps, DashboardWidget } from "./DashboardFrame";

export { MultiPanelWorkspace } from "./MultiPanelWorkspace";
export type {
  MultiPanelWorkspaceProps,
  WorkspacePanel,
} from "./MultiPanelWorkspace";

export { FullViewportCanvas } from "./FullViewportCanvas";
export type { FullViewportCanvasProps } from "./FullViewportCanvas";

export { WizardFrame } from "./WizardFrame";
export type { WizardFrameProps, WizardStep } from "./WizardFrame";

// Group 4: Detail & Drill-Down
export { MasterDetailLayout } from "./MasterDetailLayout";
export type { MasterDetailLayoutProps } from "./MasterDetailLayout";

export { EntityDetailLayout } from "./EntityDetailLayout";
export type { EntityDetailLayoutProps } from "./EntityDetailLayout";

export { ContextualDrawerLayout } from "./ContextualDrawerLayout";
export type {
  ContextualDrawerLayoutProps,
  DrawerMode,
  DrawerSide,
} from "./ContextualDrawerLayout";

export { HierarchicalTreeLayout } from "./HierarchicalTreeLayout";
export type {
  HierarchicalTreeLayoutProps,
  TreeNode,
} from "./HierarchicalTreeLayout";

export { BreadcrumbDrillDownLayout } from "./BreadcrumbDrillDownLayout";
export type {
  BreadcrumbDrillDownLayoutProps,
  DrillLevel,
} from "./BreadcrumbDrillDownLayout";

export { PopoverPeekLayout } from "./PopoverPeekLayout";
export type {
  PopoverPeekLayoutProps,
  PopoverTrigger,
} from "./PopoverPeekLayout";

// Group 9: Onboarding & Setup
export { EmptyStateScaffoldLayout } from "./EmptyStateScaffoldLayout";
export type { EmptyStateScaffoldLayoutProps } from "./EmptyStateScaffoldLayout";

export { OnboardingChecklistLayout } from "./OnboardingChecklistLayout";
export type {
  OnboardingChecklistLayoutProps,
  ChecklistTask,
} from "./OnboardingChecklistLayout";

export { DataSourceSetupLayout } from "./DataSourceSetupLayout";
export type { DataSourceSetupLayoutProps } from "./DataSourceSetupLayout";

export { SampleDataModeLayout } from "./SampleDataModeLayout";
export type { SampleDataModeLayoutProps } from "./SampleDataModeLayout";

// Group 5: Forms & Data Entry
export { FullPageFormLayout } from "./FullPageFormLayout";
export type { FullPageFormLayoutProps } from "./FullPageFormLayout";

export { InlineEditLayout } from "./InlineEditLayout";
export type { InlineEditLayoutProps } from "./InlineEditLayout";

export { MultiStepFormLayout } from "./MultiStepFormLayout";
export type {
  MultiStepFormLayoutProps,
  FormStep,
} from "./MultiStepFormLayout";

export { BulkEditLayout } from "./BulkEditLayout";
export type { BulkEditLayoutProps } from "./BulkEditLayout";

export { ImportMappingLayout } from "./ImportMappingLayout";
export type { ImportMappingLayoutProps } from "./ImportMappingLayout";

export { FormulaEditorLayout } from "./FormulaEditorLayout";
export type { FormulaEditorLayoutProps } from "./FormulaEditorLayout";

// Group 7: Reporting & Export
export { ReportViewerLayout } from "./ReportViewerLayout";
export type { ReportViewerLayoutProps } from "./ReportViewerLayout";

export { ExportConfigurationLayout } from "./ExportConfigurationLayout";
export type { ExportConfigurationLayoutProps } from "./ExportConfigurationLayout";

export { SharedLinkLayout } from "./SharedLinkLayout";
export type { SharedLinkLayoutProps } from "./SharedLinkLayout";

export { ScheduledDeliveryLayout } from "./ScheduledDeliveryLayout";
export type { ScheduledDeliveryLayoutProps } from "./ScheduledDeliveryLayout";

export { ReportBuilderLayout } from "./ReportBuilderLayout";
export type { ReportBuilderLayoutProps } from "./ReportBuilderLayout";

// Group 8: Administration
export { UserManagementLayout } from "./UserManagementLayout";
export type { UserManagementLayoutProps } from "./UserManagementLayout";

export { AuditLogLayout } from "./AuditLogLayout";
export type { AuditLogLayoutProps } from "./AuditLogLayout";

export { PermissionMatrixLayout } from "./PermissionMatrixLayout";
export type {
  PermissionMatrixLayoutProps,
  PermissionRole,
  PermissionResource,
} from "./PermissionMatrixLayout";

export { IntegrationHubLayout } from "./IntegrationHubLayout";
export type {
  IntegrationHubLayoutProps,
  Integration,
  IntegrationCategory,
  IntegrationStatus,
} from "./IntegrationHubLayout";

export { BillingUsageLayout } from "./BillingUsageLayout";
export type { BillingUsageLayoutProps, UsageMeter } from "./BillingUsageLayout";

export { APIKeyManagementLayout } from "./APIKeyManagementLayout";
export type { APIKeyManagementLayoutProps } from "./APIKeyManagementLayout";

// Group 6: Monitoring & Alerting
export { StatusPageLayout } from "./StatusPageLayout";
export type {
  StatusPageLayoutProps,
  StatusPageSystem,
  SystemStatus,
} from "./StatusPageLayout";

export { AlertFeedLayout } from "./AlertFeedLayout";
export type {
  AlertFeedLayoutProps,
  Alert,
  AlertSeverity,
} from "./AlertFeedLayout";

export { OperationsCenterLayout } from "./OperationsCenterLayout";
export type {
  OperationsCenterLayoutProps,
  OperationsMetric,
} from "./OperationsCenterLayout";

export { LogExplorerLayout } from "./LogExplorerLayout";
export type { LogExplorerLayoutProps } from "./LogExplorerLayout";

export { IncidentDetailLayout } from "./IncidentDetailLayout";
export type { IncidentDetailLayoutProps } from "./IncidentDetailLayout";

export { AlertRuleBuilderLayout } from "./AlertRuleBuilderLayout";
export type { AlertRuleBuilderLayoutProps } from "./AlertRuleBuilderLayout";

// Group 2: Data Display Layouts
export { DataGridLayout } from "./DataGridLayout";
export type { DataGridLayoutProps } from "./DataGridLayout";

export { MetricOverviewLayout } from "./MetricOverviewLayout";
export type {
  MetricOverviewLayoutProps,
  MetricItem,
} from "./MetricOverviewLayout";

export { ChartGridLayout } from "./ChartGridLayout";
export type { ChartGridLayoutProps, ChartGridItem } from "./ChartGridLayout";

export { CardListLayout } from "./CardListLayout";
export type { CardListLayoutProps, CardListView } from "./CardListLayout";

export { PivotLayout } from "./PivotLayout";
export type { PivotLayoutProps } from "./PivotLayout";

export { TimelineLayout } from "./TimelineLayout";
export type { TimelineLayoutProps, TimelineLayoutRow } from "./TimelineLayout";

export { GraphLayout } from "./GraphLayout";
export type { GraphLayoutProps } from "./GraphLayout";

export { MapLayout } from "./MapLayout";
export type { MapLayoutProps } from "./MapLayout";

export { KanbanLayout } from "./KanbanLayout";
export type { KanbanLayoutProps, KanbanColumn } from "./KanbanLayout";

export { ComparisonLayout } from "./ComparisonLayout";
export type {
  ComparisonLayoutProps,
  ComparisonEntity,
  ComparisonField,
} from "./ComparisonLayout";

// Group 3: Exploration & Filtering
export { FilterBarLayout } from "./FilterBarLayout";
export type { FilterBarLayoutProps } from "./FilterBarLayout";

export { FacetedSearchLayout } from "./FacetedSearchLayout";
export type { FacetedSearchLayoutProps } from "./FacetedSearchLayout";

export { QueryBuilderLayout } from "./QueryBuilderLayout";
export type { QueryBuilderLayoutProps } from "./QueryBuilderLayout";

export { SavedViewsLayout } from "./SavedViewsLayout";
export type {
  SavedViewsLayoutProps,
  SavedView,
  SavedViewHandlers,
  SavedViewsMode,
} from "./SavedViewsLayout";

export { GlobalSearchLayout } from "./GlobalSearchLayout";
export type {
  GlobalSearchLayoutProps,
  GlobalSearchCategory,
} from "./GlobalSearchLayout";

export { ExplorationNotebookLayout } from "./ExplorationNotebookLayout";
export type {
  ExplorationNotebookLayoutProps,
  NotebookCell,
  NotebookCellHandlers,
} from "./ExplorationNotebookLayout";
