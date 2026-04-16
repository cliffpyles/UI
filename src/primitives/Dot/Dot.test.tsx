import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
import { Dot } from './Dot';

describe('Dot', () => {
  it('renders with default props', () => {
    const { container } = render(<Dot data-testid="dot" />);
    const dot = container.querySelector('span');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('ui-dot');
  });

  it('applies size class for sm', () => {
    const { container } = render(<Dot size="sm" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveClass('ui-dot--sm');
  });

  it('applies size class for md', () => {
    const { container } = render(<Dot size="md" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveClass('ui-dot--md');
  });

  it.each(['success', 'warning', 'error', 'info', 'neutral'] as const)(
    'applies color class for %s',
    (color) => {
      const { container } = render(<Dot color={color} />);
      const dot = container.querySelector('span');
      expect(dot).toHaveClass(`ui-dot--${color}`);
    },
  );

  it('sets aria-hidden="true" when no label is provided', () => {
    const { container } = render(<Dot />);
    const dot = container.querySelector('span');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets aria-label and role="img" when label is provided', () => {
    render(<Dot label="Online" />);
    const dot = screen.getByRole('img');
    expect(dot).toHaveAttribute('aria-label', 'Online');
  });

  it('forwards ref to DOM element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Dot ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('spreads additional props', () => {
    const { container } = render(<Dot data-custom="value" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveAttribute('data-custom', 'value');
  });

  it('applies className alongside component classes', () => {
    const { container } = render(<Dot className="extra" />);
    const dot = container.querySelector('span');
    expect(dot).toHaveClass('ui-dot', 'extra');
  });

  it('has no accessibility violations with label', async () => {
    const { container } = render(<Dot label="Status: online" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations without label alongside visible text', async () => {
    const { container } = render(
      <p>
        <Dot color="success" /> Online
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
