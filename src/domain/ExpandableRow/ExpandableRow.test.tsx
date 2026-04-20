import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ExpandableRow } from "./ExpandableRow";

function Wrapper({
  expanded,
  onToggle,
  colSpan = 2,
}: {
  expanded: boolean;
  onToggle: (next: boolean) => void;
  colSpan?: number;
}) {
  return (
    <table>
      <tbody>
        <ExpandableRow
          expanded={expanded}
          onToggle={onToggle}
          expandedContent={<div>Detail</div>}
          colSpan={colSpan}
        >
          <td>Row A</td>
          <td>Row B</td>
        </ExpandableRow>
      </tbody>
    </table>
  );
}

describe("ExpandableRow", () => {
  it("renders content when expanded", () => {
    render(<Wrapper expanded={true} onToggle={() => {}} />);
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("hides content when collapsed", () => {
    render(<Wrapper expanded={false} onToggle={() => {}} />);
    expect(screen.queryByText("Detail")).not.toBeInTheDocument();
  });

  it("invokes onToggle with next state on click", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<Wrapper expanded={false} onToggle={fn} />);
    await user.click(screen.getByRole("button", { name: "Expand row" }));
    expect(fn).toHaveBeenCalledWith(true);
  });

  it("invokes onToggle on keyboard activation", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<Wrapper expanded={false} onToggle={fn} />);
    const btn = screen.getByRole("button", { name: "Expand row" });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(fn).toHaveBeenCalledWith(true);
    fn.mockClear();
    await user.keyboard(" ");
    expect(fn).toHaveBeenCalledWith(true);
  });

  it("aria-expanded reflects expanded state", () => {
    const { rerender } = render(
      <Wrapper expanded={false} onToggle={() => {}} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    rerender(<Wrapper expanded={true} onToggle={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("aria-controls matches the panel id", () => {
    const { container } = render(
      <Wrapper expanded={true} onToggle={() => {}} />,
    );
    const btn = screen.getByRole("button");
    const controls = btn.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(container.querySelector(`#${controls}`)).not.toBeNull();
  });

  it("panel uses provided colSpan", () => {
    const { container } = render(
      <Wrapper expanded={true} onToggle={() => {}} colSpan={5} />,
    );
    const panel = container.querySelector(".ui-expandable-row__content");
    expect(panel).toHaveAttribute("colspan", "5");
  });

  it("composition probe: Button and Icon resolve as the toggle", () => {
    const { container } = render(
      <Wrapper expanded={false} onToggle={() => {}} />,
    );
    expect(container.querySelector(".ui-button")).not.toBeNull();
    expect(container.querySelector(".ui-icon")).not.toBeNull();
  });

  it("forwards ref and spreads props onto the visible row", () => {
    const ref = createRef<HTMLTableRowElement>();
    render(
      <table>
        <tbody>
          <ExpandableRow
            ref={ref}
            expanded={false}
            onToggle={() => {}}
            expandedContent={null}
            colSpan={2}
            data-testid="row"
            className="x"
          >
            <td>A</td>
          </ExpandableRow>
        </tbody>
      </table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    expect(screen.getByTestId("row")).toHaveClass("ui-expandable-row", "x");
  });

  it("axe passes when collapsed", async () => {
    const { container } = render(
      <Wrapper expanded={false} onToggle={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes when expanded", async () => {
    const { container } = render(
      <Wrapper expanded={true} onToggle={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
