import { forwardRef, type HTMLAttributes, type ElementType, type CSSProperties } from "react";
import "./Box.css";

type BoxElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "nav"
  | "header"
  | "footer";

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

type BoxDisplay = "flex" | "grid" | "block" | "inline-flex";
type BoxDirection = "row" | "column";
type BoxAlign = "start" | "center" | "end" | "stretch";
type BoxJustify = "start" | "center" | "end" | "between";
type BoxBackground = "surface" | "raised" | "sunken";
type BoxRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";
type BoxShadow = "none" | "sm" | "md" | "lg";

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: BoxElement;
  /** All-sides padding */
  padding?: SpacingToken;
  /** Horizontal padding */
  paddingX?: SpacingToken;
  /** Vertical padding */
  paddingY?: SpacingToken;
  /** Flex/grid gap */
  gap?: SpacingToken;
  /** Display mode */
  display?: BoxDisplay;
  /** Flex direction */
  direction?: BoxDirection;
  /** Align items */
  align?: BoxAlign;
  /** Justify content */
  justify?: BoxJustify;
  /** Enable flex-wrap */
  wrap?: boolean;
  /** Flex grow factor (shorthand: true → 1) */
  grow?: boolean | 0 | 1;
  /** Flex shrink factor (shorthand: false → 0, true → 1) */
  shrink?: boolean | 0 | 1;
  /** Minimum inline size. Use `0` to allow flex children to shrink below content size (enables ellipsis in flex). */
  minWidth?: 0 | "auto";
  /** Background color token */
  background?: BoxBackground;
  /** Border radius */
  radius?: BoxRadius;
  /** Box shadow */
  shadow?: BoxShadow;
}

const spacingVar = (token: SpacingToken): string =>
  `var(--spacing-${token.replace(".", "-")})`;

const backgroundMap: Record<BoxBackground, string> = {
  surface: "var(--color-background-surface)",
  raised: "var(--color-background-surface-raised)",
  sunken: "var(--color-background-surface-sunken)",
};

const justifyMap: Record<BoxJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
};

const alignMap: Record<BoxAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

export const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      as: Component = "div" as ElementType,
      padding,
      paddingX,
      paddingY,
      gap,
      display,
      direction,
      align,
      justify,
      wrap,
      grow,
      shrink,
      minWidth,
      background,
      radius,
      shadow,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "ui-box",
      radius && `ui-box--radius-${radius}`,
      shadow && `ui-box--shadow-${shadow}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inlineStyle: CSSProperties = { ...style };

    if (padding) inlineStyle.padding = spacingVar(padding);
    if (paddingX) {
      inlineStyle.paddingInline = spacingVar(paddingX);
    }
    if (paddingY) {
      inlineStyle.paddingBlock = spacingVar(paddingY);
    }
    if (gap) inlineStyle.gap = spacingVar(gap);
    if (display) inlineStyle.display = display;
    if (direction) inlineStyle.flexDirection = direction;
    if (align) inlineStyle.alignItems = alignMap[align];
    if (justify) inlineStyle.justifyContent = justifyMap[justify];
    if (wrap) inlineStyle.flexWrap = "wrap";
    if (grow !== undefined) inlineStyle.flexGrow = grow === true ? 1 : grow === false ? 0 : grow;
    if (shrink !== undefined) inlineStyle.flexShrink = shrink === true ? 1 : shrink === false ? 0 : shrink;
    if (minWidth !== undefined) inlineStyle.minInlineSize = minWidth === 0 ? "0" : "auto";
    if (background) inlineStyle.backgroundColor = backgroundMap[background];

    return (
      <Component
        ref={ref}
        className={classes}
        style={Object.keys(inlineStyle).length > 0 ? inlineStyle : style}
        {...props}
      />
    );
  },
);

Box.displayName = "Box";
