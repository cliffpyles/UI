import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { UserChip } from "./UserChip";

describe("UserChip", () => {
  it("renders name", () => {
    render(<UserChip user={{ name: "Jane Doe" }} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("fires onRemove", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<UserChip user={{ name: "Jane" }} removable onRemove={fn} />);
    await user.click(screen.getByRole("button", { name: "Remove Jane" }));
    expect(fn).toHaveBeenCalled();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <UserChip ref={ref} user={{ name: "Jane" }} className="x" data-testid="c" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("c")).toHaveClass("ui-user-chip", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <UserChip user={{ name: "Jane" }} removable onRemove={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
