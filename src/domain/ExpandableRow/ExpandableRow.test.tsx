import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ExpandableRow } from "./ExpandableRow";

function Wrapper({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <table>
      <tbody>
        <ExpandableRow
          expanded={expanded}
          onToggle={onToggle}
          content={<div>Detail</div>}
          colSpan={2}
        >
          <td>Row A</td>
          <td>Row B</td>
        </ExpandableRow>
      </tbody>
    </table>
  );
}

describe("ExpandableRow", () => {
  it("shows content when expanded", () => {
    render(<Wrapper expanded={true} onToggle={() => {}} />);
    expect(screen.getByText("Detail")).toBeInTheDocument();
  });

  it("hides content when collapsed", () => {
    render(<Wrapper expanded={false} onToggle={() => {}} />);
    expect(screen.queryByText("Detail")).not.toBeInTheDocument();
  });

  it("fires onToggle", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<Wrapper expanded={false} onToggle={fn} />);
    await user.click(screen.getByRole("button", { name: "Expand row" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<Wrapper expanded={true} onToggle={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
