import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Badge.css';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeOwnProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export type BadgeProps = BadgeOwnProps & HTMLAttributes<HTMLSpanElement>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', className, children, ...rest }, ref) => {
    const classNames = [
      'ui-badge',
      `ui-badge--${variant}`,
      `ui-badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classNames} {...rest}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
