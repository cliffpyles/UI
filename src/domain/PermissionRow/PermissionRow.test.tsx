import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PermissionRow } from "./PermissionRow";

describe("PermissionRow", () => {
  it("renders toggle by default", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(
      <PermissionRow action="Read" resource="Projects" value={false} onChange={fn} />,
    );
    await user.click(screen.getByRole("switch", { name: "Read Projects" }));
    expect(fn).toHaveBeenCalledWith(true);
  });

  it("renders select when options provided", () => {
    render(
      <PermissionRow
        action="Access"
        value="view"
        onChange={() => {}}
        options={[
          { value: "view", label: "View" },
          { value: "edit", label: "Edit" },
        ]}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("view");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <PermissionRow action="Read" value={true} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
