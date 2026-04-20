import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Tag } from "../../components/Tag";
import "./MentionToken.css";

export type MentionKind = "user" | "channel" | "project" | "team" | "custom";
export type MentionTone = "neutral" | "info" | "success";

export interface MentionTokenProps extends HTMLAttributes<HTMLSpanElement> {
  kind: MentionKind;
  handle: string;
  label?: string;
  href?: string;
  prefix?: string;
  tone?: MentionTone;
}

const DEFAULT_PREFIX: Record<MentionKind, string> = {
  user: "@",
  team: "@",
  channel: "#",
  project: "~",
  custom: "",
};

const TONE_TO_VARIANT: Record<
  MentionTone,
  "neutral" | "primary" | "success"
> = {
  neutral: "neutral",
  info: "primary",
  success: "success",
};

export const MentionToken = forwardRef<HTMLSpanElement, MentionTokenProps>(
  function MentionToken(
    { kind, handle, label, href, prefix, tone = "neutral", className, ...rest },
    ref,
  ) {
    const glyph = prefix ?? DEFAULT_PREFIX[kind];
    const display = label ?? handle;

    const tagContent: ReactNode = (
      <Box display="inline-flex" align="center" gap="0.5">
        <Text as="span" color="secondary">
          {glyph}
        </Text>
        <Text as="span">{display}</Text>
      </Box>
    );

    const tag = (
      <Tag
        size="sm"
        variant={TONE_TO_VARIANT[tone]}
        className={`ui-mention-token__tag ui-mention-token--${kind}`}
      >
        {tagContent}
      </Tag>
    );

    const classes = [
      "ui-mention-token",
      `ui-mention-token--${kind}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (href) {
      return (
        <span ref={ref} className={classes} {...rest}>
          <a className="ui-mention-token__link" href={href}>
            {tag}
          </a>
        </span>
      );
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        {tag}
      </span>
    );
  },
);
