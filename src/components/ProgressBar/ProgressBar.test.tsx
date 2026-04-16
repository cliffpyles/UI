import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with determinate value", () => {
    render(<ProgressBar value={50} label="Loading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("sets fill width to match percentage", () => {
    const { container } = render(<ProgressBar value={75} />);
    const fill = container.querySelector(".ui-progress-bar__fill");
    expect(fill).toHaveStyle({ width: "75%" });
  });

  it("clamps value to 0-100 range", () => {
    const { container } = render(<ProgressBar value={150} />);
    const fill = container.querySelector(".ui-progress-bar__fill");
    expect(fill).toHaveStyle({ width: "100%" });
  });

  it("handles value=0", () => {
    const { container } = render(<ProgressBar value={0} />);
    const fill = container.querySelector(".ui-progress-bar__fill");
    expect(fill).toHaveStyle({ width: "0%" });
  });

  it("renders indeterminate when value is undefined", () => {
    const { container } = render(<ProgressBar label="Loading" />);
    expect(container.firstElementChild).toHaveClass(
      "ui-progress-bar--indeterminate",
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("renders label", () => {
    render(<ProgressBar value={50} label="Upload progress" />);
    expect(screen.getByText("Upload progress")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Upload progress",
    );
  });

  it("shows numeric value when showValue is true", () => {
    render(<ProgressBar value={42} showValue />);
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("does not show value for indeterminate", () => {
    const { container } = render(<ProgressBar showValue />);
    expect(
      container.querySelector(".ui-progress-bar__value"),
    ).not.toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { container: c1 } = render(<ProgressBar value={50} variant="success" />);
    expect(c1.firstElementChild).toHaveClass("ui-progress-bar--success");

    const { container: c2 } = render(<ProgressBar value={50} variant="warning" />);
    expect(c2.firstElementChild).toHaveClass("ui-progress-bar--warning");

    const { container: c3 } = render(<ProgressBar value={50} variant="error" />);
    expect(c3.firstElementChild).toHaveClass("ui-progress-bar--error");
  });

  it("applies size classes", () => {
    const { container: c1 } = render(<ProgressBar value={50} size="sm" />);
    expect(c1.firstElementChild).toHaveClass("ui-progress-bar--sm");

    const { container: c2 } = render(<ProgressBar value={50} size="md" />);
    expect(c2.firstElementChild).toHaveClass("ui-progress-bar--md");
  });

  it("supports custom max", () => {
    render(<ProgressBar value={25} max={50} label="Half" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressBar ref={ref} value={50} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(
      <ProgressBar value={50} className="custom" />,
    );
    expect(container.firstElementChild).toHaveClass(
      "ui-progress-bar",
      "custom",
    );
  });

  it("spreads additional props", () => {
    render(<ProgressBar value={50} data-testid="progress" />);
    expect(screen.getByTestId("progress")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ProgressBar value={50} label="Upload progress" showValue />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in indeterminate mode", async () => {
    const { container } = render(
      <ProgressBar label="Loading data" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
