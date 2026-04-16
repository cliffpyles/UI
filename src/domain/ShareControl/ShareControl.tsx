import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import { VisibilityBadge, type Visibility } from "../VisibilityBadge";
import "./ShareControl.css";

export interface ShareControlProps extends HTMLAttributes<HTMLDivElement> {
  currentAccess: Visibility;
  onShare: () => void;
  label?: string;
}

export const ShareControl = forwardRef<HTMLDivElement, ShareControlProps>(
  function ShareControl(
    { currentAccess, onShare, label = "Share", className, ...rest },
    ref,
  ) {
    const classes = ["ui-share-control", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <VisibilityBadge visibility={currentAccess} />
        <Button variant="secondary" size="sm" onClick={onShare}>
          <Icon name="upload" size="xs" aria-hidden /> {label}
        </Button>
      </div>
    );
  },
);
