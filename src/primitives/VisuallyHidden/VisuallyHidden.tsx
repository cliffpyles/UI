import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import "./VisuallyHidden.css";

type VisuallyHiddenElement = "span" | "div";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: VisuallyHiddenElement;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as: Component = "span" as ElementType, className, ...props }, ref) => {
    const classes = ["ui-visually-hidden", className].filter(Boolean).join(" ");

    return <Component ref={ref} className={classes} {...props} />;
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
