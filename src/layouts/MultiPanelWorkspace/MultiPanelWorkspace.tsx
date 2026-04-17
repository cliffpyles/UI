import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ResizablePanel, type ResizeDirection } from "../ResizablePanel";
import "./MultiPanelWorkspace.css";

export interface WorkspacePanel {
  id: string;
  content: ReactNode;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  resizable?: boolean;
  label?: string;
}

export interface MultiPanelWorkspaceProps extends HTMLAttributes<HTMLDivElement> {
  panels: WorkspacePanel[];
  direction?: ResizeDirection;
  onSizeChange?: (sizes: Record<string, number>) => void;
}

export const MultiPanelWorkspace = forwardRef<HTMLDivElement, MultiPanelWorkspaceProps>(
  function MultiPanelWorkspace(
    { panels, direction = "horizontal", onSizeChange, className, ...rest },
    ref,
  ) {
    const [sizes, setSizes] = useState<Record<string, number>>(() =>
      Object.fromEntries(
        panels.map((p) => [p.id, p.initialSize ?? 240]),
      ),
    );

    const setSize = useCallback(
      (id: string, size: number) => {
        setSizes((prev) => {
          const next = { ...prev, [id]: size };
          onSizeChange?.(next);
          return next;
        });
      },
      [onSizeChange],
    );

    const classes = [
      "ui-multi-panel",
      `ui-multi-panel--${direction}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {panels.map((panel, idx) => {
          const isLast = idx === panels.length - 1;
          if (!panel.resizable || isLast) {
            return (
              <section
                key={panel.id}
                className={[
                  "ui-multi-panel__panel",
                  isLast && "ui-multi-panel__panel--fluid",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={panel.label}
              >
                {panel.content}
              </section>
            );
          }
          return (
            <ResizablePanel
              key={panel.id}
              direction={direction}
              size={sizes[panel.id] ?? panel.initialSize ?? 240}
              minSize={panel.minSize}
              maxSize={panel.maxSize}
              onResize={(s) => setSize(panel.id, s)}
              handleLabel={`Resize ${panel.label ?? panel.id}`}
            >
              <section
                className="ui-multi-panel__panel"
                aria-label={panel.label}
              >
                {panel.content}
              </section>
            </ResizablePanel>
          );
        })}
      </div>
    );
  },
);
