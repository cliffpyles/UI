import { forwardRef, type HTMLAttributes, type ElementType, type CSSProperties } from "react";
import "./Grid.css";

type GridElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "nav"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "dl";

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
  | "32"
  /* Semantic tokens — track the active density container */
  | "content"
  | "section"
  | "inline"
  | "page";

type GridAutoFlow = "row" | "column" | "row dense" | "column dense";

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render */
  as?: GridElement;
  /** `grid-template-columns`. Number N is shorthand for `repeat(N, minmax(0, 1fr))`. */
  columns?: string | number;
  /** `grid-template-rows`. Number N is shorthand for `repeat(N, minmax(0, 1fr))`. */
  rows?: string | number;
  /** Gap between cells */
  gap?: SpacingToken;
  /** Column gap (overrides `gap` on the column axis) */
  columnGap?: SpacingToken;
  /** Row gap (overrides `gap` on the row axis) */
  rowGap?: SpacingToken;
  /** `grid-auto-flow` */
  autoFlow?: GridAutoFlow;
  /** `grid-template-areas`. Pass an array of rows or a raw string. */
  templateAreas?: string | string[];
}

const semanticSpacingMap: Record<"content" | "section" | "inline" | "page", string> = {
  content: "var(--spacing-content-gap)",
  section: "var(--spacing-section-gap)",
  inline: "var(--spacing-inline-gap)",
  page: "var(--spacing-page-padding)",
};

const spacingVar = (token: SpacingToken): string =>
  token in semanticSpacingMap
    ? semanticSpacingMap[token as keyof typeof semanticSpacingMap]
    : `var(--spacing-${token.replace(".", "-")})`;

const tracks = (value: string | number): string =>
  typeof value === "number" ? `repeat(${value}, minmax(0, 1fr))` : value;

const areas = (value: string | string[]): string =>
  Array.isArray(value) ? value.map((row) => `"${row}"`).join(" ") : value;

export const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Component = "div" as ElementType,
      columns,
      rows,
      gap,
      columnGap,
      rowGap,
      autoFlow,
      templateAreas,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const classes = ["ui-grid", className].filter(Boolean).join(" ");

    const inlineStyle: CSSProperties = { ...style };

    if (columns !== undefined) inlineStyle.gridTemplateColumns = tracks(columns);
    if (rows !== undefined) inlineStyle.gridTemplateRows = tracks(rows);
    if (gap) inlineStyle.gap = spacingVar(gap);
    if (columnGap) inlineStyle.columnGap = spacingVar(columnGap);
    if (rowGap) inlineStyle.rowGap = spacingVar(rowGap);
    if (autoFlow) inlineStyle.gridAutoFlow = autoFlow;
    if (templateAreas !== undefined) inlineStyle.gridTemplateAreas = areas(templateAreas);

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

Grid.displayName = "Grid";
