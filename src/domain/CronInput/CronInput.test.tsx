import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CronInput } from "./CronInput";

describe("CronInput", () => {
  it("renders friendly mode by default", () => {
    render(<CronInput value="0 * * * *" onChange={() => {}} />);
    expect(screen.getByLabelText("Schedule")).toBeInTheDocument();
  });

  it("switches to expert", async () => {
    const user = userEvent.setup();
    render(<CronInput value="0 * * * *" onChange={() => {}} />);
    await user.click(screen.getByRole("tab", { name: "Expression" }));
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

  it("no a11y violations", async () => {
    const { container } = render(
      <CronInput value="0 * * * *" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
