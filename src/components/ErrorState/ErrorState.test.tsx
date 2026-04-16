import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders default title", () => {
    render(<ErrorState />);
    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<ErrorState title="Failed to load data" />);
    expect(
      screen.getByRole("heading", { name: "Failed to load data" }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ErrorState description="Please try again later." />);
    expect(screen.getByText("Please try again later.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<ErrorState />);
    expect(
      container.querySelector(".ui-error-state__description"),
    ).not.toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument();
  });

  it("fires onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on retry button when retrying", () => {
    const { container } = render(<ErrorState onRetry={() => {}} retrying />);
    const retryButton = container.querySelector(".ui-error-state__action button");
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toBeDisabled();
  });

  it("renders details toggle when details provided", () => {
    render(<ErrorState details="Error: 500 Internal Server Error" />);
    expect(
      screen.getByRole("button", { name: "Show details" }),
    ).toBeInTheDocument();
  });

  it("does not render details section when details not provided", () => {
    const { container } = render(<ErrorState />);
    expect(
      container.querySelector(".ui-error-state__details"),
    ).not.toBeInTheDocument();
  });

  it("toggles details on click", async () => {
    const user = userEvent.setup();
    render(<ErrorState details="Error: 500" />);
    const toggle = screen.getByRole("button", { name: "Show details" });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Error: 500")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Error: 500")).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Error: 500")).not.toBeInTheDocument();
  });

  it("has role='alert' on the container", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ErrorState ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    render(<ErrorState className="custom" />);
    expect(screen.getByRole("alert")).toHaveClass("ui-error-state", "custom");
  });

  it("spreads additional props", () => {
    render(<ErrorState data-testid="err" />);
    expect(screen.getByTestId("err")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ErrorState
        title="Failed to load"
        description="An unexpected error occurred."
        onRetry={() => {}}
        details="Error: 500"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
