import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AssigneePicker } from "./AssigneePicker";

describe("AssigneePicker", () => {
  it("renders UserPicker with Assign placeholder", () => {
    render(<AssigneePicker value={[]} onChange={() => {}} users={[]} />);
    expect(screen.getByPlaceholderText("Assign…")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <AssigneePicker value={[]} onChange={() => {}} users={[]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
