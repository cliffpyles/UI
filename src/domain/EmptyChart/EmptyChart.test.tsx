import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EmptyChart } from "./EmptyChart";

describe("EmptyChart", () => {
  it("renders default title", () => {
    render(<EmptyChart />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  it("renders error variant title", () => {
    render(<EmptyChart variant="error" />);
    expect(screen.getByText("Could not load chart")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<EmptyChart />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
