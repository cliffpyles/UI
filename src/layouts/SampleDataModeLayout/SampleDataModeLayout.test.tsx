import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SampleDataModeLayout } from "./SampleDataModeLayout";

describe("SampleDataModeLayout", () => {
  it("renders default banner and children", () => {
    render(
      <SampleDataModeLayout>
        <p>dashboard content</p>
      </SampleDataModeLayout>,
    );
    expect(
      screen.getByRole("region", { name: "Sample data mode" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You're viewing sample data"),
    ).toBeInTheDocument();
    expect(screen.getByText("dashboard content")).toBeInTheDocument();
  });

  it("renders custom banner content", () => {
    render(
      <SampleDataModeLayout banner={<span>Demo mode active</span>}>
        <div />
      </SampleDataModeLayout>,
    );
    expect(screen.getByText("Demo mode active")).toBeInTheDocument();
  });

  it("fires onSwitchToReal and uses custom cta label", async () => {
    const onSwitch = vi.fn();
    render(
      <SampleDataModeLayout
        onSwitchToReal={onSwitch}
        ctaLabel="Use my data"
      >
        <div />
      </SampleDataModeLayout>,
    );
    const cta = screen.getByRole("button", { name: "Use my data" });
    await userEvent.click(cta);
    expect(onSwitch).toHaveBeenCalledTimes(1);
  });

  it("omits cta when onSwitchToReal is not provided", () => {
    render(
      <SampleDataModeLayout>
        <div />
      </SampleDataModeLayout>,
    );
    expect(
      screen.queryByRole("button", { name: "Switch to real data" }),
    ).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SampleDataModeLayout
        ref={ref}
        className="custom"
        data-testid="sdm"
      >
        <div />
      </SampleDataModeLayout>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("sdm")).toHaveClass(
      "ui-sample-data-mode",
      "custom",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SampleDataModeLayout onSwitchToReal={() => {}}>
        <p>content</p>
      </SampleDataModeLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
