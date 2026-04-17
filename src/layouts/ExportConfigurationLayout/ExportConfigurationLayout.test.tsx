import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ExportConfigurationLayout } from "./ExportConfigurationLayout";

describe("ExportConfigurationLayout", () => {
  it("renders required slots with labelled regions", () => {
    render(
      <ExportConfigurationLayout
        format={<div>csv/xlsx</div>}
        scope={<div>all rows</div>}
        footer={<button type="button">Export</button>}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Export configuration" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Export format" })).toHaveTextContent(
      "csv/xlsx",
    );
    expect(screen.getByRole("region", { name: "Export scope" })).toHaveTextContent(
      "all rows",
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders optional columns and options when provided", () => {
    render(
      <ExportConfigurationLayout
        format={<div>f</div>}
        columns={<div>pick cols</div>}
        scope={<div>s</div>}
        options={<div>extras</div>}
        footer={<button type="button">Go</button>}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Column selection" }),
    ).toHaveTextContent("pick cols");
    expect(
      screen.getByRole("region", { name: "Export options" }),
    ).toHaveTextContent("extras");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ExportConfigurationLayout
        ref={ref}
        className="custom"
        format={<div />}
        scope={<div />}
        footer={<div />}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("ui-export-config", "custom");
  });

  it("fires footer button clicks", async () => {
    const onClick = vi.fn();
    render(
      <ExportConfigurationLayout
        format={<div />}
        scope={<div />}
        footer={
          <button type="button" onClick={onClick}>
            Export
          </button>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Export" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ExportConfigurationLayout
        format={<label>Format <select><option>CSV</option></select></label>}
        scope={<label>Scope <select><option>All</option></select></label>}
        footer={<button type="button">Export</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
