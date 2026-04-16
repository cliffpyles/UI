import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  QueryExpressionNode,
  type QueryGroup,
  type QueryLeaf,
} from "./QueryExpressionNode";

const group: QueryGroup = {
  kind: "group",
  id: "g1",
  op: "AND",
  children: [
    { kind: "leaf", id: "l1", field: "status", operator: "=", value: "active" } as QueryLeaf,
  ],
};

describe("QueryExpressionNode", () => {
  it("renders group with children", () => {
    render(<QueryExpressionNode node={group} onChange={() => {}} />);
    expect(screen.getByText("status")).toBeInTheDocument();
    expect(screen.getByDisplayValue("AND")).toBeInTheDocument();
  });

  it("adds a condition", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<QueryExpressionNode node={group} onChange={fn} />);
    await user.click(screen.getByRole("button", { name: /Add condition/ }));
    expect(fn).toHaveBeenCalled();
    const next = fn.mock.calls[0][0];
    expect(next.children.length).toBe(2);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <QueryExpressionNode node={group} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
