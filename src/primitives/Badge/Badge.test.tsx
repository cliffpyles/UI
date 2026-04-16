import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('ui-badge', 'ui-badge--neutral', 'ui-badge--md');
  });

  it('renders children as badge content', () => {
    render(<Badge>42</Badge>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it.each(['neutral', 'success', 'warning', 'error', 'info'] as const)(
    'applies variant class for %s',
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toHaveClass(`ui-badge--${variant}`);
    },
  );

  it.each(['sm', 'md'] as const)('applies size class for %s', (size) => {
    render(<Badge size={size}>{size}</Badge>);
    expect(screen.getByText(size)).toHaveClass(`ui-badge--${size}`);
  });

  it('handles empty string children gracefully', () => {
    const { container } = render(<Badge>{''}</Badge>);
    expect(container.querySelector('.ui-badge')).toBeInTheDocument();
  });

  it('forwards ref to DOM element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveClass('ui-badge');
  });

  it('spreads additional props', () => {
    render(<Badge data-testid="custom" aria-label="status badge">Spread</Badge>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.getByLabelText('status badge')).toBeInTheDocument();
  });

  it('applies className alongside component classes', () => {
    render(<Badge className="custom-class">Styled</Badge>);
    const badge = screen.getByText('Styled');
    expect(badge).toHaveClass('ui-badge', 'custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Accessible</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
