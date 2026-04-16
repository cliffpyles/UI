import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { WorkflowStatePicker } from "./WorkflowStatePicker";

const STATES = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
];

describe("WorkflowStatePicker", () => {
  it("renders options", () => {
    render(<WorkflowStatePicker value="todo" onChange={() => {}} states={STATES} />);
    expect(screen.getByRole("combobox")).toHaveValue("todo");
  });

  it("enforces allowed transitions", () => {
    render(
      <WorkflowStatePicker
        value="todo"
        onChange={() => {}}
        states={STATES}
        allowedTransitions={{ todo: ["doing"] }}
      />,
    );
    const doneOpt = screen.getByRole("option", { name: "Done" }) as HTMLOptionElement;
    expect(doneOpt.disabled).toBe(true);
    const doingOpt = screen.getByRole("option", { name: "In progress" }) as HTMLOptionElement;
    expect(doingOpt.disabled).toBe(false);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <WorkflowStatePicker value="todo" onChange={() => {}} states={STATES} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
