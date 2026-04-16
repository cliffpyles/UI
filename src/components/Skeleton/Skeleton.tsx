import { forwardRef, type HTMLAttributes } from "react";
import "./Skeleton.css";

type SkeletonVariant = "text" | "circle" | "rect";

interface SkeletonOwnProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Width of the skeleton (CSS value or number for px) */
  width?: string | number;
  /** Height of the skeleton (CSS value or number for px) */
  height?: string | number;
  /** Number of text lines to render */
  lines?: number;
}

export type SkeletonProps = SkeletonOwnProps & HTMLAttributes<HTMLDivElement>;

function toCssValue(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      variant = "text",
      width = "100%",
      height = "1em",
      lines = 1,
      className,
      ...props
    },
    ref,
  ) {
    const classes = [
      "ui-skeleton",
      `ui-skeleton--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (variant === "text" && lines > 1) {
      return (
        <div
          ref={ref}
          className="ui-skeleton__group"
          role="status"
          aria-busy="true"
          aria-label="Loading content"
          {...props}
        >
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={classes}
              style={{
                width: i === lines - 1 ? "80%" : toCssValue(width),
                height: toCssValue(height),
              }}
            />
          ))}
        </div>
      );
    }

    const style: React.CSSProperties = {
      width: toCssValue(width),
      height: variant === "circle" ? toCssValue(width) : toCssValue(height),
    };

    return (
      <div
        ref={ref}
        className={classes}
        style={style}
        role="status"
        aria-busy="true"
        aria-label="Loading content"
        {...props}
      />
    );
  },
);
