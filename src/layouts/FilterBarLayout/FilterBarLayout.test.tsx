import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FilterBarLayout } from "./FilterBarLayout";

describe("FilterBarLayout", () => {
  it("renders filters as a toolbar", () => {
    render(
      <FilterBarLayout
        filters={[<span key="a">Status: Open</span>, <span key="b">Priority: High</span>]}
      />,
    );
    const toolbar = screen.getByRole("toolbar", { name: "Filters" });
    expect(toolbar).toHaveTextContent("Status: Open");
    expect(toolbar).toHaveTextContent("Priority: High");
  });

  it("calls onClearAll when clear button clicked", async () => {
    const onClearAll = vi.fn();
    render(
      <FilterBarLayout
        filters={[<span key="a">A</span>]}
        onClearAll={onClearAll}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("hides clear button when showClearAll is false", () => {
    render(
      <FilterBarLayout
        filters={[<span key="a">A</span>]}
        onClearAll={() => {}}
        showClearAll={false}
      />,
    );
    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull();
  });

  it("renders actions slot", () => {
    render(
      <FilterBarLayout
        filters={[<span key="a">A</span>]}
        actions={<button>Save view</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Save view" })).toBeInTheDocument();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FilterBarLayout
        ref={ref}
        className="extra"
        filters={[<span key="a">A</span>]}
      />,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.className).toContain("ui-filter-bar");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FilterBarLayout
        filters={[<span key="a">A</span>]}
        onClearAll={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
