import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { GroupedRowHeader } from "./GroupedRowHeader";

describe("GroupedRowHeader", () => {
  it("renders group label and count", () => {
    render(
      <table>
        <tbody>
          <GroupedRowHeader group="Acme" count={12} colSpan={3} />
        </tbody>
      </table>,
    );
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("fires toggle", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <table>
        <tbody>
          <GroupedRowHeader group="X" colSpan={2} expanded onToggle={fn} />
        </tbody>
      </table>,
    );
    await user.click(screen.getByRole("button", { name: "Collapse group" }));
    expect(fn).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <table>
        <tbody>
          <GroupedRowHeader group="X" colSpan={2} />
        </tbody>
      </table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
