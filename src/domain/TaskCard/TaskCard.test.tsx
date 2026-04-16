import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TaskCard } from "./TaskCard";

const TASK = {
  id: "1",
  title: "Ship the feature",
  status: "active",
  priority: "high",
  assignee: { name: "Jane" },
  labels: [{ id: "a", name: "bug" }],
};

describe("TaskCard", () => {
  it("renders fields", () => {
    render(<TaskCard task={TASK} />);
    expect(screen.getByText("Ship the feature")).toBeInTheDocument();
    expect(screen.getByText("bug")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("activates on click", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<TaskCard task={TASK} onActivate={fn} />);
    await user.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledWith("1");
  });

  it("no a11y violations", async () => {
    const { container } = render(<TaskCard task={TASK} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
