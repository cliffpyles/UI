import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import "./Divider.css";

type SpacingToken =
  | "0"
  | "px"
  | "0.5"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "3.5"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "10"
  | "12"
  | "14"
  | "16"
  | "20"
  | "24"
  | "32";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation of the divider line */
  orientation?: "horizontal" | "vertical";
  /** Spacing token key controlling margin around the divider */
  spacing?: SpacingToken;
}

function spacingTokenToVar(token: SpacingToken): string {
  const cssName = token.replace(".", "-");
  return `var(--spacing-${cssName})`;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", spacing = "4", className, style, ...props }, ref) => {
    const classes = [
      "ui-divider",
      `ui-divider--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const spacingVar = spacingTokenToVar(spacing);
    const spacingStyle =
      orientation === "horizontal"
        ? { marginBlock: spacingVar }
        : { marginInline: spacingVar };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={classes}
        style={{ ...spacingStyle, ...style }}
        {...props}
      />
    );
  },
);

Divider.displayName = "Divider";
