import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MapLayout } from "./MapLayout";

describe("MapLayout", () => {
  it("renders map and sidebar", () => {
    render(
      <MapLayout map={<div>map-area</div>} sidebar={<div>sidebar-area</div>} />,
    );
    expect(screen.getByRole("region", { name: "Map" })).toBeInTheDocument();
    expect(screen.getByText("map-area")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Map sidebar" })).toBeInTheDocument();
  });

  it("omits sidebar when not provided", () => {
    const { container } = render(<MapLayout map={<div>m</div>} />);
    expect(container.querySelector(".ui-map-layout__sidebar")).toBeNull();
  });

  it("renders sidebar on left when sidebarSide is left", () => {
    const { container } = render(
      <MapLayout
        map={<div>m</div>}
        sidebar={<div>s</div>}
        sidebarSide="left"
      />,
    );
    expect(container.firstElementChild?.className).toContain(
      "ui-map-layout--sidebar-left",
    );
  });

  it("calls onSidebarResize when user presses arrow on resize handle", () => {
    const onSidebarResize = vi.fn();
    render(
      <MapLayout
        map={<div>m</div>}
        sidebar={<div>s</div>}
        onSidebarResize={onSidebarResize}
      />,
    );
    const handle = screen.getByRole("separator", {
      name: "Resize map sidebar",
    });
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    expect(onSidebarResize).toHaveBeenCalled();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <MapLayout ref={ref} className="extra" map={<div>m</div>} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-map-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <MapLayout map={<div>m</div>} sidebar={<div>s</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
