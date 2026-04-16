import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RowActionsMenu } from "./RowActionsMenu";

describe("RowActionsMenu", () => {
  it("opens menu and fires action", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <RowActionsMenu
        row={{ id: 1 }}
        actions={[
          { id: "edit", label: "Edit", onSelect: fn },
          { id: "del", label: "Delete", destructive: true, onSelect: () => {} },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Row actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(fn).toHaveBeenCalledWith({ id: 1 });
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <RowActionsMenu
        row={{ id: 1 }}
        actions={[{ id: "edit", label: "Edit", onSelect: () => {} }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
