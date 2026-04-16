import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { BannerAlert } from "./BannerAlert";

describe("BannerAlert", () => {
  it("renders title and description", () => {
    render(<BannerAlert title="Hi" description="Body text" />);
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("alerts on error", () => {
    render(<BannerAlert variant="error" title="Bad" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("dismissible fires onDismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<BannerAlert title="x" dismissible onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BannerAlert ref={ref} className="x" data-testid="b" title="t" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("b")).toHaveClass("ui-banner-alert", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <BannerAlert variant="info" title="Hi" description="body" dismissible onDismiss={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
