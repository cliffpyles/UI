/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import "./Card.css";

// --- Card Root ---

interface CardOwnProps {
  children: ReactNode;
}

export type CardProps = CardOwnProps & HTMLAttributes<HTMLDivElement>;

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  function Card({ children, className, ...props }, ref) {
    const classes = ["ui-card", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

// --- Card Header ---

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, className, ...props }, ref) {
    const classes = ["ui-card__header", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

// --- Card Title ---

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ children, className, ...props }, ref) {
    const classes = ["ui-card__title", className].filter(Boolean).join(" ");
    return (
      <h3 ref={ref} className={classes} {...props}>
        {children}
      </h3>
    );
  },
);

// --- Card Actions ---

export type CardActionsProps = HTMLAttributes<HTMLDivElement>;

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions({ children, className, ...props }, ref) {
    const classes = ["ui-card__actions", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

// --- Card Body ---

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody({ children, className, ...props }, ref) {
    const classes = ["ui-card__body", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

// --- Card Footer ---

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ children, className, ...props }, ref) {
    const classes = ["ui-card__footer", className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

// --- Compound export ---

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Actions: CardActions,
  Body: CardBody,
  Footer: CardFooter,
});
