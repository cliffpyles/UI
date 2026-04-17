import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DashboardFrame, type DashboardWidget } from "./DashboardFrame";

const widgets: DashboardWidget[] = [
  { id: "w1", span: 6, content: <div>widget 1</div> },
  { id: "w2", span: 6, content: <div>widget 2</div> },
  { id: "w3", span: 12, content: <div>widget 3</div> },
];

describe("DashboardFrame", () => {
  it("renders all widgets", () => {
    render(<DashboardFrame widgets={widgets} />);
    expect(screen.getByText("widget 1")).toBeInTheDocument();
    expect(screen.getByText("widget 2")).toBeInTheDocument();
    expect(screen.getByText("widget 3")).toBeInTheDocument();
  });

  it("applies span as inline style", () => {
    const { container } = render(<DashboardFrame widgets={widgets} />);
    const first = container.querySelector(".ui-dashboard-frame__widget") as HTMLElement;
    expect(first.style.gridColumn).toBe("span 6");
  });

  it("renders filter bar", () => {
    render(<DashboardFrame widgets={widgets} filterBar={<div>filters</div>} />);
    expect(screen.getByText("filters")).toBeInTheDocument();
  });

  it("renders title and actions", () => {
    render(
      <DashboardFrame widgets={widgets} title="My Dashboard" actions={<button>New</button>} />,
    );
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("applies custom columns via CSS var", () => {
    render(<DashboardFrame widgets={[]} columns={6} data-testid="root" />);
    expect(
      screen.getByTestId("root").style.getPropertyValue("--ui-dashboard-columns"),
    ).toBe("6");
  });

  it("has no axe violations", async () => {
    const { container } = render(<DashboardFrame widgets={widgets} title="Dash" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
