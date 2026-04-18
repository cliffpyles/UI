import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Dot } from "../../primitives/Dot";
import { Button } from "../Button";
import "./Tag.css";

type TagVariant = "neutral" | "primary" | "success" | "warning" | "error";
type TagSize = "sm" | "md";

interface TagOwnProps {
  /** Color variant */
  variant?: TagVariant;
  /** Size */
  size?: TagSize;
  /** Whether the tag can be removed */
  removable?: boolean;
  /** Called when the remove button is clicked */
  onRemove?: () => void;
  /** Leading icon node (compose `<Icon>` at call site) */
  leadingIcon?: ReactNode;
  /** Render a leading `Dot` colored from the variant */
  showDot?: boolean;
  /** Tag content */
  children?: ReactNode;
}

export type TagProps = TagOwnProps & HTMLAttributes<HTMLSpanElement>;

const dotColorFor: Record<TagVariant, "neutral" | "info" | "success" | "warning" | "error"> = {
  neutral: "neutral",
  primary: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  function Tag(
    {
      variant = "neutral",
      size = "md",
      removable = false,
      onRemove,
      leadingIcon,
      showDot = false,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const classes = [
      "ui-tag",
      `ui-tag--${variant}`,
      `ui-tag--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const removeLabel = `Remove ${typeof children === "string" ? children : ""}`.trim();

    return (
      <span ref={ref} className={classes} {...props}>
        <Box direction="row" align="center" gap="1" className="ui-tag__row">
          {showDot && <Dot color={dotColorFor[variant]} size="sm" />}
          {leadingIcon}
          <Text as="span" size="caption" weight="medium" color="inherit" className="ui-tag__content">
            {children}
          </Text>
          {removable && (
            <Button
              variant="ghost"
              size="sm"
              icon="x"
              className="ui-tag__remove"
              onClick={onRemove}
              aria-label={removeLabel}
            />
          )}
        </Box>
      </span>
    );
  },
);

Tag.displayName = "Tag";
