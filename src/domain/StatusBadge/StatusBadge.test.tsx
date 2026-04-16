import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders default status", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("uses custom statusMap", () => {
    render(
      <StatusBadge
        status="shipped"
        statusMap={{ shipped: { label: "Shipped", tone: "success", icon: "download" } }}
      />,
    );
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("falls back to raw status when unknown", () => {
    render(<StatusBadge status="xyz" />);
    expect(screen.getByText("xyz")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<StatusBadge ref={ref} status="active" className="x" data-testid="b" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("b")).toHaveClass("ui-status-badge", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<StatusBadge status="pending" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
