import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { BannerAlert } from "./BannerAlert";

describe("BannerAlert", () => {
  it("renders title (Text) and description (Text)", () => {
    const { container } = render(
      <BannerAlert title="Heads up" description="Body text" />,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
    // Title and description should flow through Text primitive
    expect(container.querySelectorAll(".ui-text").length).toBeGreaterThanOrEqual(2);
  });

  it("role=alert for error + warning, role=status for info + success", () => {
    const { rerender } = render(<BannerAlert variant="error" title="e" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<BannerAlert variant="warning" title="w" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    rerender(<BannerAlert variant="info" title="i" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    rerender(<BannerAlert variant="success" title="s" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("accepts `severity` as a spec alias for `variant`", () => {
    render(<BannerAlert severity="error" title="e" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("dismissible renders Dismiss alert button and fires onDismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<BannerAlert title="x" dismissible onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Dismiss alert" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("renders an action Button from {label, onAction} and fires onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <BannerAlert title="x" action={{ label: "Upgrade", onAction }} />,
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));
    expect(onAction).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BannerAlert ref={ref} className="x" data-testid="b" title="t" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("b")).toHaveClass("ui-banner-alert", "x");
  });

  it("has no a11y violations across severities and with action", async () => {
    const cases = [
      <BannerAlert key="i" variant="info" title="i" description="b" />,
      <BannerAlert key="s" variant="success" title="s" description="b" />,
      <BannerAlert key="w" variant="warning" title="w" description="b" />,
      <BannerAlert key="e" variant="error" title="e" description="b" />,
      <BannerAlert
        key="a"
        variant="warning"
        title="Trial ending"
        description="3 days left"
        action={{ label: "Upgrade", onAction: () => {} }}
        dismissible
        onDismiss={() => {}}
      />,
    ];
    for (const c of cases) {
      const { container, unmount } = render(c);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
