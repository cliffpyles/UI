import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { EmptyChart } from "./EmptyChart";
import { Button } from "../../components/Button";

describe("EmptyChart", () => {
  it("renders the default title and description", () => {
    render(<EmptyChart />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
    expect(
      screen.getByText("There is no data for the selected range."),
    ).toBeInTheDocument();
  });

  it("overrides title and description", () => {
    render(
      <EmptyChart title="Pick a range" description="Choose above" />,
    );
    expect(screen.getByText("Pick a range")).toBeInTheDocument();
    expect(screen.getByText("Choose above")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(
      <EmptyChart action={<Button>Try again</Button>} />,
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("renders a custom illustration", () => {
    render(
      <EmptyChart illustration={<span data-testid="ill">!</span>} />,
    );
    expect(screen.getByTestId("ill")).toBeInTheDocument();
  });

  it("applies the height to the container", () => {
    const { container } = render(<EmptyChart height={320} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.minHeight).toBe("320px");
  });

  it("has role='status'", () => {
    render(<EmptyChart />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("forwards ref and spreads remaining props", () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyChart ref={ref} data-testid="empty" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("composes EmptyState", () => {
    const { container } = render(<EmptyChart />);
    expect(container.querySelector(".ui-empty-state")).not.toBeNull();
  });

  it("axe passes in default form", async () => {
    const { container } = render(<EmptyChart />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes with action", async () => {
    const { container } = render(
      <EmptyChart action={<Button>Refresh</Button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
