import { forwardRef, useState, type HTMLAttributes } from "react";
import { Icon } from "../../primitives/Icon";
import "./Avatar.css";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "circle" | "square";

interface AvatarOwnProps {
  /** Image source URL */
  src?: string;
  /** Alt text for the avatar image (required for accessibility) */
  alt: string;
  /** User's name — used to generate initials fallback */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape of the avatar */
  shape?: AvatarShape;
}

export type AvatarProps = AvatarOwnProps & HTMLAttributes<HTMLSpanElement>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      className,
      ...props
    },
    ref,
  ) {
    const [imgError, setImgError] = useState(false);

    const showImage = src && !imgError;
    const showInitials = !showImage && name;
    const showIcon = !showImage && !name;

    const classes = [
      "ui-avatar",
      `ui-avatar--${size}`,
      `ui-avatar--${shape}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} role="img" aria-label={alt} {...props}>
        {showImage && (
          <img
            className="ui-avatar__image"
            src={src}
            alt=""
            onError={() => setImgError(true)}
          />
        )}
        {showInitials && (
          <span className="ui-avatar__initials" aria-hidden="true">
            {getInitials(name)}
          </span>
        )}
        {showIcon && (
          <Icon name="user" size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"} aria-hidden="true" />
        )}
      </span>
    );
  },
);
