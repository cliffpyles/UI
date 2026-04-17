import { forwardRef, type HTMLAttributes, type ElementType } from "react";
import "./Text.css";

type TextElement =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "legend";

type TextSize =
  | "2xs"
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "body"
  | "caption"
  | "label";

type TextWeight = "normal" | "medium" | "semibold" | "bold";

type TextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "success"
  | "warning"
  | "error"
  | "inherit";

type TextAlign = "start" | "center" | "end";

type TextFamily = "sans" | "mono";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: TextElement;
  /** Font size token. Primitive sizes (`2xs`–`4xl`) resolve to fixed scale steps. Semantic sizes (`body`, `caption`, `label`) track the active density container. */
  size?: TextSize;
  /** Font weight */
  weight?: TextWeight;
  /** Text color semantic token */
  color?: TextColor;
  /** Single-line truncation with ellipsis */
  truncate?: boolean;
  /** Enable tabular (monospaced) numerals */
  tabularNums?: boolean;
  /** Text alignment (logical properties) */
  align?: TextAlign;
  /** Font family */
  family?: TextFamily;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "span" as ElementType,
      size = "base",
      weight = "normal",
      color = "primary",
      truncate = false,
      tabularNums = false,
      align,
      family = "sans",
      className,
      title,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "ui-text",
      `ui-text--${size}`,
      `ui-text--${weight}`,
      `ui-text--${color}`,
      `ui-text--${family}`,
      align && `ui-text--${align}`,
      truncate && "ui-text--truncate",
      tabularNums && "ui-text--tabular-nums",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        ref={ref}
        className={classes}
        title={truncate && !title && typeof children === "string" ? children : title}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
