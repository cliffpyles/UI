import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ProgressPill } from "./ProgressPill";

describe("ProgressPill", () => {
  it("renders with value", () => {
    render(<ProgressPill progress={42} label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "42");
  });

  it("clamps above 100", () => {
    render(<ProgressPill progress={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps below 0", () => {
    render(<ProgressPill progress={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ProgressPill ref={ref} progress={10} className="x" data-testid="p" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("p")).toHaveClass("ui-progress-pill", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<ProgressPill progress={50} label="Sync" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
