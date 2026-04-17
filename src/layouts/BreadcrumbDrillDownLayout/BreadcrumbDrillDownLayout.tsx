import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs";
import "./BreadcrumbDrillDownLayout.css";

export interface DrillLevel {
  id: string;
  label: string;
  content: ReactNode;
}

export interface BreadcrumbDrillDownLayoutProps extends HTMLAttributes<HTMLDivElement> {
  levels: DrillLevel[];
  onNavigate?: (index: number) => void;
  rootLabel?: string;
}

export const BreadcrumbDrillDownLayout = forwardRef<HTMLDivElement, BreadcrumbDrillDownLayoutProps>(
  function BreadcrumbDrillDownLayout(
    { levels, onNavigate, rootLabel = "Root", className, ...rest },
    ref,
  ) {
    const crumbs: BreadcrumbItem[] = [
      { id: "__root", label: rootLabel, onClick: () => onNavigate?.(-1) },
      ...levels.map((lvl, idx) => ({
        id: lvl.id,
        label: lvl.label,
        onClick: idx < levels.length - 1 ? () => onNavigate?.(idx) : undefined,
      })),
    ];

    const current = levels[levels.length - 1];
    const classes = ["ui-drilldown", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="ui-drilldown__header">
          <Breadcrumbs items={crumbs} />
        </header>
        <div className="ui-drilldown__content">{current?.content}</div>
      </div>
    );
  },
);
