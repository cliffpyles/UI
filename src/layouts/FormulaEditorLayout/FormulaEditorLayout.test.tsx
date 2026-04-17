import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FormulaEditorLayout } from "./FormulaEditorLayout";

describe("FormulaEditorLayout", () => {
  it("renders editor, suggestions, preview, toolbar", () => {
    render(
      <FormulaEditorLayout
        toolbar={<button>Insert</button>}
        editor={<textarea aria-label="formula" />}
        suggestions={<ul><li>SUM</li></ul>}
        preview={<div>= 42</div>}
      />,
    );
    expect(screen.getByRole("toolbar", { name: "Formula toolbar" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "formula" })).toBeInTheDocument();
    expect(
      screen.getByRole("complementary", { name: "Suggestions" }),
    ).toHaveTextContent("SUM");
    expect(screen.getByLabelText("Preview")).toHaveTextContent("= 42");
  });

  it("renders without optional slots", () => {
    render(
      <FormulaEditorLayout editor={<textarea aria-label="formula" />} />,
    );
    expect(screen.getByRole("textbox", { name: "formula" })).toBeInTheDocument();
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FormulaEditorLayout
        ref={ref}
        className="custom"
        editor={<textarea aria-label="f" />}
      />,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FormulaEditorLayout editor={<textarea aria-label="f" />} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
