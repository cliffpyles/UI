import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  OperationsCenterLayout,
  type OperationsMetric,
} from "./OperationsCenterLayout";

const metrics: OperationsMetric[] = [
  { id: "m1", content: <div>CPU 42%</div> },
  { id: "m2", content: <div>MEM 68%</div> },
  { id: "m3", content: <div>NET 1.2Gbps</div> },
];

describe("OperationsCenterLayout", () => {
  it("renders metrics in grid region", () => {
    render(<OperationsCenterLayout metrics={metrics} />);
    expect(
      screen.getByRole("region", { name: "Operations metrics" }),
    ).toBeInTheDocument();
    expect(screen.getByText("CPU 42%")).toBeInTheDocument();
    expect(screen.getByText("MEM 68%")).toBeInTheDocument();
  });

  it("renders header and footer slots", () => {
    render(
      <OperationsCenterLayout
        metrics={metrics}
        header={<span>Live</span>}
        footer={<span>Updated now</span>}
      />,
    );
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Updated now")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <OperationsCenterLayout metrics={metrics} ref={ref} className="custom" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-ops-center", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<OperationsCenterLayout metrics={metrics} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
