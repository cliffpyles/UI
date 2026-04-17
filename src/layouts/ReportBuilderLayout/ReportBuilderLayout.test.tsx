import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ReportBuilderLayout } from "./ReportBuilderLayout";

describe("ReportBuilderLayout", () => {
  it("renders palette, canvas, inspector, and toolbar slots", () => {
    render(
      <ReportBuilderLayout
        palette={<div>fields</div>}
        canvas={<div>canvas body</div>}
        inspector={<div>props</div>}
        toolbar={<div>tools</div>}
      />,
    );
    expect(screen.getByRole("complementary", { name: "Palette" })).toHaveTextContent(
      "fields",
    );
    expect(screen.getByRole("region", { name: "Canvas" })).toHaveTextContent(
      "canvas body",
    );
    expect(
      screen.getByRole("complementary", { name: "Inspector" }),
    ).toHaveTextContent("props");
    expect(screen.getByText("tools")).toBeInTheDocument();
  });

  it("omits inspector when not provided", () => {
    render(
      <ReportBuilderLayout
        palette={<div>p</div>}
        canvas={<div>c</div>}
      />,
    );
    expect(
      screen.queryByRole("complementary", { name: "Inspector" }),
    ).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ReportBuilderLayout
        ref={ref}
        className="custom"
        palette={<div />}
        canvas={<div />}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("ui-report-builder", "custom");
  });

  it("calls onPaletteResize when palette handle is resized", async () => {
    const onPaletteResize = vi.fn();
    render(
      <ReportBuilderLayout
        palette={<div>p</div>}
        canvas={<div>c</div>}
        onPaletteResize={onPaletteResize}
      />,
    );
    const [handle] = screen.getAllByRole("separator");
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onPaletteResize).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ReportBuilderLayout
        palette={<div>p</div>}
        canvas={<div>c</div>}
        inspector={<div>i</div>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
