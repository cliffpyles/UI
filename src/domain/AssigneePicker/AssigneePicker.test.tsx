import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AssigneePicker } from "./AssigneePicker";

describe("AssigneePicker", () => {
  it("renders UserPicker with the Unassigned placeholder by default", () => {
    render(<AssigneePicker value={[]} onChange={() => {}} users={[]} />);
    expect(screen.getByPlaceholderText("Unassigned")).toBeInTheDocument();
  });

  it("composes UserPicker inside a Box wrapper", () => {
    const { container } = render(
      <AssigneePicker value={[]} onChange={() => {}} users={[]} />,
    );
    expect(container.querySelector(".ui-assignee-picker")).not.toBeNull();
    expect(container.querySelector(".ui-user-picker")).not.toBeNull();
  });

  it("forwards ref to the root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AssigneePicker ref={ref} value={[]} onChange={() => {}} users={[]} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.classList.contains("ui-assignee-picker")).toBe(true);
  });

  it("has no a11y violations in unassigned state", async () => {
    const { container } = render(
      <AssigneePicker value={[]} onChange={() => {}} users={[]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
