import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CronInput } from "./CronInput";

describe("CronInput", () => {
  it("renders friendly mode by default with frequency select", () => {
    render(<CronInput value="0 * * * *" onChange={() => {}} />);
    expect(screen.getByLabelText("Frequency")).toBeInTheDocument();
  });

  it("emits cron for frequency change", () => {
    const fn = vi.fn();
    render(<CronInput value="0 * * * *" onChange={fn} />);
    fireEvent.change(screen.getByLabelText("Frequency"), {
      target: { value: "day" },
    });
    expect(fn).toHaveBeenCalledWith("0 0 * * *");
  });

  it("week frequency emits day-of-week cron", () => {
    const fn = vi.fn();
    render(<CronInput value="0 9 * * 1" onChange={fn} />);
    fireEvent.change(screen.getByLabelText("Day of week"), {
      target: { value: "3" },
    });
    expect(fn).toHaveBeenCalledWith("0 9 * * 3");
  });

  it("switches to expert via radio", async () => {
    const user = userEvent.setup();
    render(<CronInput value="0 * * * *" onChange={() => {}} />);
    await user.click(screen.getByRole("radio", { name: "Expert" }));
    expect(screen.getByLabelText("Cron expression")).toBeInTheDocument();
  });

  it("fires onChange in expert mode", () => {
    const fn = vi.fn();
    render(<CronInput value="" onChange={fn} mode="expert" />);
    fireEvent.change(screen.getByLabelText("Cron expression"), {
      target: { value: "* * * * *" },
    });
    expect(fn).toHaveBeenCalledWith("* * * * *");
  });

  it("sets aria-invalid when invalid in expert mode", () => {
    render(<CronInput value="bogus" onChange={() => {}} mode="expert" invalid />);
    expect(screen.getByLabelText("Cron expression")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("renders plain-English preview", () => {
    render(<CronInput value="0 9 * * 1" onChange={() => {}} />);
    expect(screen.getByText(/Monday at 09:00/)).toBeInTheDocument();
  });

  it("preserves value across mode switch", async () => {
    const user = userEvent.setup();
    render(<CronInput value="0 9 * * 1" onChange={() => {}} />);
    await user.click(screen.getByRole("radio", { name: "Expert" }));
    expect(screen.getByLabelText("Cron expression")).toHaveValue("0 9 * * 1");
  });

  it("disables all controls", () => {
    render(<CronInput value="0 * * * *" onChange={() => {}} disabled />);
    expect(screen.getByLabelText("Frequency")).toBeDisabled();
  });

  it("forwards ref and spreads props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CronInput
        ref={ref}
        value="0 * * * *"
        onChange={() => {}}
        data-testid="cron"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("cron")).toBe(ref.current);
  });

  it("no a11y violations (friendly)", async () => {
    const { container } = render(
      <CronInput value="0 9 * * 1" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("no a11y violations (expert invalid)", async () => {
    const { container } = render(
      <CronInput value="bad" onChange={() => {}} mode="expert" invalid />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
