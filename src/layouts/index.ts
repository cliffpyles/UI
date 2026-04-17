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
