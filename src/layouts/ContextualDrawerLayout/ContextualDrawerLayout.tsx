import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./ContextualDrawerLayout.css";

export type DrawerMode = "overlay" | "push";
export type DrawerSide = "right" | "left";

export interface ContextualDrawerLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose: () => void;
  drawer: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  mode?: DrawerMode;
  side?: DrawerSide;
  width?: number;
}

export const ContextualDrawerLayout = forwardRef<HTMLDivElement, ContextualDrawerLayoutProps>(
  function ContextualDrawerLayout(
    {
      open,
      onClose,
      drawer,
      children,
      title,
      mode = "overlay",
      side = "right",
      width = 400,
      className,
      ...rest
    },
    ref,
  ) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const titleId = useId();

    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
      if (open) {
        const prev = document.activeElement as HTMLElement | null;
        panelRef.current?.focus();
        return () => prev?.focus();
      }
    }, [open]);

    const classes = [
      "ui-drawer-layout",
      `ui-drawer-layout--${mode}`,
      `ui-drawer-layout--${side}`,
      open && "ui-drawer-layout--open",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-drawer-layout__main">{children}</div>
        {mode === "overlay" && open && (
          <div
            className="ui-drawer-layout__scrim"
            onClick={onClose}
            role="presentation"
          />
        )}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal={mode === "overlay"}
          aria-hidden={!open}
          aria-labelledby={title ? titleId : undefined}
          aria-label={title ? undefined : "Drawer"}
          tabIndex={-1}
          className="ui-drawer-layout__drawer"
          style={{ width }}
        >
          <header className="ui-drawer-layout__drawer-header">
            <h2 id={titleId} className="ui-drawer-layout__drawer-title">
              {title}
            </h2>
            <button
              type="button"
              className="ui-drawer-layout__close"
              aria-label="Close drawer"
              onClick={onClose}
            >
              <Icon name="x" size="sm" />
            </button>
          </header>
          <div className="ui-drawer-layout__drawer-body">{drawer}</div>
        </div>
      </div>
    );
  },
);
