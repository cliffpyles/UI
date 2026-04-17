import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ResizablePanel } from "../ResizablePanel";
import "./MapLayout.css";

export interface MapLayoutProps extends HTMLAttributes<HTMLDivElement> {
  map: ReactNode;
  sidebar?: ReactNode;
  sidebarWidth?: number;
  sidebarSide?: "left" | "right";
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  onSidebarResize?: (width: number) => void;
  label?: string;
  sidebarLabel?: string;
}

export const MapLayout = forwardRef<HTMLDivElement, MapLayoutProps>(
  function MapLayout(
    {
      map,
      sidebar,
      sidebarWidth = 320,
      sidebarSide = "right",
      minSidebarWidth = 240,
      maxSidebarWidth = 600,
      onSidebarResize,
      label = "Map",
      sidebarLabel = "Map sidebar",
      className,
      ...rest
    },
    ref,
  ) {
    const [width, setWidth] = useState(sidebarWidth);
    const classes = [
      "ui-map-layout",
      `ui-map-layout--sidebar-${sidebarSide}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const sidebarPanel = sidebar ? (
      <ResizablePanel
        direction="horizontal"
        size={width}
        minSize={minSidebarWidth}
        maxSize={maxSidebarWidth}
        handlePosition={sidebarSide === "right" ? "start" : "end"}
        onResize={(s) => {
          setWidth(s);
          onSidebarResize?.(s);
        }}
        handleLabel="Resize map sidebar"
      >
        <div
          className="ui-map-layout__sidebar"
          role="group"
          aria-label={sidebarLabel}
        >
          {sidebar}
        </div>
      </ResizablePanel>
    ) : null;

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={label}
        {...rest}
      >
        {sidebar && sidebarSide === "left" && sidebarPanel}
        <div className="ui-map-layout__map">{map}</div>
        {sidebar && sidebarSide === "right" && sidebarPanel}
      </div>
    );
  },
);
