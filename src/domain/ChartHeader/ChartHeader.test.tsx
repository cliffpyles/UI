import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChartHeader } from "./ChartHeader";

describe("ChartHeader", () => {
  it("renders title and subtitle", () => {
    render(<ChartHeader title="Revenue" subtitle="Monthly" />);
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("renders timeRangeLabel when provided", () => {
    render(<ChartHeader title="X" timeRangeLabel="Last 30 days" />);
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders trailing content", () => {
    render(<ChartHeader title="X" trailing={<span>extra</span>} />);
    expect(screen.getByText("extra")).toBeInTheDocument();
  });

  it("renders actions menu and fires onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ChartHeader
        title="X"
        actions={[{ id: "csv", label: "Export CSV", onSelect }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Chart actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Export CSV" }));
    expect(onSelect).toHaveBeenCalled();
  });

  it("omits right cluster when only title is set", () => {
    render(<ChartHeader title="X" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("forwards ref to the root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ChartHeader ref={ref} title="X" />);
    expect(ref.current).not.toBeNull();
  });

  it("no a11y violations without actions", async () => {
    const { container } = render(<ChartHeader title="X" subtitle="Y" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no a11y violations with actions", async () => {
    const { container } = render(
      <ChartHeader
        title="X"
        actions={[{ id: "a", label: "Action", onSelect: () => {} }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
