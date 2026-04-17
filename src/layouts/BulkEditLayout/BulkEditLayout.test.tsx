import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BulkEditLayout } from "./BulkEditLayout";

describe("BulkEditLayout", () => {
  it("renders summary, fields, footer slots", () => {
    render(
      <BulkEditLayout
        selectionSummary={<span>3 items selected</span>}
        fields={
          <label>
            Status
            <input />
          </label>
        }
        footer={<button>Apply</button>}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("3 items selected");
    expect(
      screen.getByRole("region", { name: "Bulk edit fields" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  });

  it("exposes aside with aria-label", () => {
    render(
      <BulkEditLayout
        selectionSummary={<span>2 selected</span>}
        fields={<input aria-label="f" />}
      />,
    );
    expect(
      screen.getByRole("complementary", { name: "Bulk edit" }),
    ).toBeInTheDocument();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLElement>();
    render(
      <BulkEditLayout
        ref={ref}
        className="custom"
        selectionSummary={<span>s</span>}
        fields={<input aria-label="f" />}
      />,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <BulkEditLayout
        selectionSummary={<span>1 selected</span>}
        fields={
          <label>
            Status <input />
          </label>
        }
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
