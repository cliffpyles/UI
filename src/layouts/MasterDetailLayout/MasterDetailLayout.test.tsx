import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MasterDetailLayout } from "./MasterDetailLayout";

describe("MasterDetailLayout", () => {
  it("renders master and detail regions", () => {
    render(
      <MasterDetailLayout
        master={<div>items</div>}
        detail={<div>detail body</div>}
      />,
    );
    expect(screen.getByRole("region", { name: "Master list" })).toHaveTextContent(
      "items",
    );
    expect(screen.getByRole("region", { name: "Detail" })).toHaveTextContent(
      "detail body",
    );
  });

  it("shows empty state when no selection", () => {
    render(
      <MasterDetailLayout
        master={<div>m</div>}
        detail={<div>should not show</div>}
        hasSelection={false}
        empty={<p>select an item</p>}
      />,
    );
    expect(screen.getByText("select an item")).toBeInTheDocument();
    expect(screen.queryByText("should not show")).not.toBeInTheDocument();
  });

  it("calls onMasterResize on resize", async () => {
    const onMasterResize = vi.fn();
    render(
      <MasterDetailLayout
        master={<div>m</div>}
        detail={<div>d</div>}
        onMasterResize={onMasterResize}
      />,
    );
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onMasterResize).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <MasterDetailLayout master={<div>m</div>} detail={<div>d</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
