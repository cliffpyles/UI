/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Divider } from "../../primitives/Divider";
import "./Card.css";

// Divider is available for consumers composing separated sections within a Card.
export { Divider as CardDivider };

// --- Card Root ---

interface CardOwnProps {
  children: ReactNode;
}

export type CardProps = CardOwnProps & HTMLAttributes<HTMLDivElement>;

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  function Card({ children, className, ...props }, ref) {
    const classes = ["ui-card", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="column"
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Card Header ---

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, className, ...props }, ref) {
    const classes = ["ui-card__header", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        display="flex"
        align="center"
        justify="between"
        gap="3"
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Card Title ---

export type CardTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "color">;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ children, className, ...props }, ref) {
    const classes = ["ui-card__title", className].filter(Boolean).join(" ");
    return (
      <Text
        ref={ref as React.Ref<HTMLElement>}
        as="h3"
        size="base"
        weight="semibold"
        color="primary"
        className={classes}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

// --- Card Actions ---

export type CardActionsProps = HTMLAttributes<HTMLDivElement>;

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions({ children, className, ...props }, ref) {
    const classes = ["ui-card__actions", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        display="flex"
        align="center"
        gap="2"
        shrink={false}
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Card Body ---

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ children, className, ...props }, ref) {
    const classes = ["ui-card__body", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="column"
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Card Footer ---

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ children, className, ...props }, ref) {
    const classes = ["ui-card__footer", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        display="flex"
        align="center"
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Compound export ---

CardRoot.displayName = "Card";
CardHeader.displayName = "Card.Header";
CardTitle.displayName = "Card.Title";
CardActions.displayName = "Card.Actions";
CardBody.displayName = "Card.Body";
CardFooter.displayName = "Card.Footer";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Actions: CardActions,
  Body: CardBody,
  Footer: CardFooter,
});
