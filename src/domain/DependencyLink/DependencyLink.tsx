import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Icon, type IconName } from "../../primitives/Icon";
import { Tooltip } from "../../components/Tooltip";
import "./DependencyLink.css";

export type DependencyRelation =
  | "blocks"
  | "blocked-by"
  | "related-to"
  | "duplicate-of";

export interface DependencyLinkProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "title"> {
  /** Relationship type between this task and the linked task */
  relation: DependencyRelation;
  /** Linked task title */
  title: ReactNode;
  /** Optional status hint (e.g. "In progress") */
  status?: ReactNode;
  /** When set, the row navigates to this URL */
  href?: string;
  /** Alternative to href — invoked on activation */
  onActivate?: () => void;
  /** Overrides the default tooltip copy */
  tooltip?: ReactNode;
}

const RELATION_ICON: Record<DependencyRelation, IconName> = {
  blocks: "chevron-right",
  "blocked-by": "chevron-left",
  "related-to": "external-link",
  "duplicate-of": "copy",
};

const RELATION_LABEL: Record<DependencyRelation, string> = {
  blocks: "Blocks",
  "blocked-by": "Blocked by",
  "related-to": "Related to",
  "duplicate-of": "Duplicate of",
};

export const DependencyLink = forwardRef<HTMLSpanElement, DependencyLinkProps>(
  function DependencyLink(
    {
      relation,
      title,
      status,
      href,
      onActivate,
      tooltip,
      className,
      ...rest
    },
    ref,
  ) {
    const tooltipContent = tooltip ?? RELATION_LABEL[relation];
    const isActivatable = href != null || onActivate != null;

    const classes = [
      "ui-dependency-link",
      `ui-dependency-link--${relation}`,
      isActivatable && "ui-dependency-link--activatable",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inner = (
      <Box
        display="inline-flex"
        direction="row"
        align="center"
        gap="1"
        padding="1"
        radius="sm"
      >
        <Icon
          name={RELATION_ICON[relation]}
          size="sm"
          aria-hidden
          className={`ui-dependency-link__icon ui-dependency-link__icon--${relation}`}
        />
        <Text size="sm" weight="medium" truncate>
          {title}
        </Text>
        {status != null && (
          <Text size="caption" color="secondary">
            {status}
          </Text>
        )}
      </Box>
    );

    let body: ReactNode = inner;
    if (href != null) {
      body = (
        <a
          className="ui-dependency-link__activator"
          href={href}
          aria-label={`${RELATION_LABEL[relation]}`}
        >
          {inner}
        </a>
      );
    } else if (onActivate != null) {
      body = (
        <a
          className="ui-dependency-link__activator"
          href="#"
          role="button"
          tabIndex={0}
          aria-label={`${RELATION_LABEL[relation]}`}
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            onActivate();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onActivate();
            }
          }}
        >
          {inner}
        </a>
      );
    }

    return (
      <Tooltip content={tooltipContent}>
        <span ref={ref} className={classes} {...rest}>
          {body}
        </span>
      </Tooltip>
    );
  },
);
