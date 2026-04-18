import { forwardRef, useState, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
import { Dot } from "../../primitives/Dot";
import "./Avatar.css";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "circle" | "square";
type AvatarPresence = "online" | "away" | "offline";

interface AvatarOwnProps {
  /** Image source URL */
  src?: string;
  /** Alt text — carried by the container as its accessible label. Required. */
  alt: string;
  /** User's name — used to derive initials fallback */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Presence indicator — renders a Dot in the bottom-right corner */
  presence?: AvatarPresence;
}

export type AvatarProps = AvatarOwnProps & HTMLAttributes<HTMLDivElement>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const iconSizeFor: Record<AvatarSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "sm",
  lg: "md",
  xl: "lg",
};

const presenceColor: Record<AvatarPresence, "success" | "warning" | "neutral"> = {
  online: "success",
  away: "warning",
  offline: "neutral",
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function AvatarImpl(
    {
      src,
      alt,
      name,
      size = "md",
      shape = "circle",
      presence,
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
      <Box
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        align="center"
        justify="center"
        role="img"
        aria-label={alt}
        {...props}
      >
        {showImage && (
          <img
            className="ui-avatar__image"
            src={src}
            alt=""
            onError={() => setImgError(true)}
          />
        )}
        {showInitials && (
          <Text
            as="span"
            size="caption"
            weight="semibold"
            color="inherit"
            aria-hidden="true"
          >
            {getInitials(name)}
          </Text>
        )}
        {showIcon && (
          <Icon name="user" size={iconSizeFor[size]} aria-hidden="true" />
        )}
        {presence && (
          <Dot
            className="ui-avatar__presence"
            color={presenceColor[presence]}
            size={size === "sm" ? "sm" : "md"}
          />
        )}
      </Box>
    );
  },
);

Avatar.displayName = "Avatar";
