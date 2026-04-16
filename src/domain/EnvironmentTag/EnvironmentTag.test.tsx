import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { EnvironmentTag } from "./EnvironmentTag";

describe("EnvironmentTag", () => {
  it("renders known environment", () => {
    render(<EnvironmentTag environment="production" />);
    expect(screen.getByText("Prod")).toBeInTheDocument();
  });

  it("renders unknown environment as-is", () => {
    render(<EnvironmentTag environment="qa" />);
    expect(screen.getByText("qa")).toBeInTheDocument();
  });

  it("supports outline variant", () => {
    render(<EnvironmentTag environment="staging" variant="outline" data-testid="t" />);
    expect(screen.getByTestId("t")).toHaveClass("ui-environment-tag--outline");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<EnvironmentTag ref={ref} environment="production" className="x" data-testid="t" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("t")).toHaveClass("ui-environment-tag", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<EnvironmentTag environment="production" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
