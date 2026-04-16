import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { FilterChip } from "./FilterChip";

describe("FilterChip", () => {
  it("renders field, operator, value", () => {
    render(<FilterChip field="status" operator="=" value="active" />);
    expect(screen.getByText("status")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("onRemove fires", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<FilterChip field="f" value="v" onRemove={fn} />);
    await user.click(screen.getByRole("button", { name: /Remove filter/ }));
    expect(fn).toHaveBeenCalled();
  });

  it("onActivate fires", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<FilterChip field="f" value="v" onActivate={fn} />);
    await user.click(screen.getByRole("button", { name: /Edit filter/ }));
    expect(fn).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <FilterChip ref={ref} field="f" value="v" className="x" data-testid="c" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("c")).toHaveClass("ui-filter-chip", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <FilterChip field="status" value="active" onRemove={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
