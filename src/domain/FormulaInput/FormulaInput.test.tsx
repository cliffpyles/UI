import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FormulaInput } from "./FormulaInput";

describe("FormulaInput", () => {
  it("fires onChange", () => {
    const fn = vi.fn();
    render(<FormulaInput value="" onChange={fn} />);
    fireEvent.change(screen.getByLabelText("Formula"), { target: { value: "=A+B" } });
    expect(fn).toHaveBeenCalledWith("=A+B");
  });

  it("shows validation error", () => {
    const validate = (v: string) => (v.length > 0 ? "Bad" : null);
    render(<FormulaInput value="" onChange={() => {}} onValidate={validate} />);
    fireEvent.change(screen.getByLabelText("Formula"), { target: { value: "x" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Bad");
  });

  it("inserts schema token", () => {
    const fn = vi.fn();
    render(
      <FormulaInput
        value="="
        onChange={fn}
        schema={[{ id: "A", label: "A" }]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(fn).toHaveBeenCalledWith("=A");
  });

  it("no a11y violations", async () => {
    const { container } = render(<FormulaInput value="=A" onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
