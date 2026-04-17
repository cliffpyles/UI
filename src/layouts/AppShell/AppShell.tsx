/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import "./AppShell.css";

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebarCollapsed?: boolean;
  sidebarWidth?: number;
  collapsedSidebarWidth?: number;
}

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

const AppShellRoot = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(
    {
      sidebarCollapsed = false,
      sidebarWidth = 240,
      collapsedSidebarWidth = 56,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const classes = [
      "ui-app-shell",
      sidebarCollapsed && "ui-app-shell--collapsed",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        style={{
          ["--ui-app-shell-sidebar-width" as string]: `${sidebarWidth}px`,
          ["--ui-app-shell-sidebar-collapsed-width" as string]: `${collapsedSidebarWidth}px`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const AppShellHeader = forwardRef<HTMLElement, SlotProps>(function AppShellHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={["ui-app-shell__header", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </header>
  );
});

const AppShellSidebar = forwardRef<HTMLElement, SlotProps>(function AppShellSidebar(
  { className, children, ...rest },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={["ui-app-shell__sidebar", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </aside>
  );
});

const AppShellMain = forwardRef<HTMLElement, SlotProps>(function AppShellMain(
  { className, children, ...rest },
  ref,
) {
  return (
    <main
      ref={ref}
      className={["ui-app-shell__main", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </main>
  );
});

export const AppShell = Object.assign(AppShellRoot, {
  Header: AppShellHeader,
  Sidebar: AppShellSidebar,
  Main: AppShellMain,
});
