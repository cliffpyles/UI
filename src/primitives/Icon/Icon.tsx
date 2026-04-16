import { forwardRef, type SVGAttributes } from "react";
import { iconPaths, type IconName } from "./icons";
import "./Icon.css";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

type IconColor =
  | "currentColor"
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "color"> {
  /** Icon identifier */
  name: IconName;
  /** Icon size */
  size?: IconSize;
  /** Icon color */
  color?: IconColor;
  /** Accessible label. If omitted, icon is aria-hidden="true". */
  label?: string;
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const colorMap: Record<IconColor, string> = {
  currentColor: "currentColor",
  primary: "var(--color-text-primary)",
  secondary: "var(--color-text-secondary)",
  tertiary: "var(--color-text-tertiary)",
  disabled: "var(--color-text-disabled)",
  success: "var(--color-status-success-icon)",
  warning: "var(--color-status-warning-icon)",
  error: "var(--color-status-error-icon)",
  info: "var(--color-status-info-icon)",
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      name,
      size = "sm",
      color = "currentColor",
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const dimension = sizeMap[size];
    const classes = ["ui-icon", `ui-icon--${size}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <svg
        ref={ref}
        className={classes}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colorMap[color]}
        strokeWidth={size === "lg" || size === "xl" ? 2 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? "img" : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        {iconPaths[name]}
      </svg>
    );
  },
);

Icon.displayName = "Icon";

export type { IconName };
