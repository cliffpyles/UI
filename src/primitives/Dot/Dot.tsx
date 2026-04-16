import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import './Dot.css';

type DotColor = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type DotSize = 'sm' | 'md';

interface DotOwnProps {
  color?: DotColor;
  size?: DotSize;
  label?: string;
}

export type DotProps = DotOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'color'>;

export const Dot = forwardRef<HTMLSpanElement, DotProps>(function Dot(
  { color = 'neutral', size = 'sm', label, className, ...rest },
  ref,
) {
  const classes = [
    'ui-dot',
    `ui-dot--${color}`,
    `ui-dot--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      ref={ref}
      className={classes}
      {...(label
        ? { 'aria-label': label, role: 'img' }
        : { 'aria-hidden': true })}
      {...rest}
    />
  );
});
