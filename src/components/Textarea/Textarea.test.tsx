import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="notes" />);
    expect(screen.getByRole("textbox", { name: "notes" })).toBeInTheDocument();
  });

  it("applies size variant class", () => {
    render(<Textarea aria-label="n" size="lg" />);
    expect(screen.getByRole("textbox")).toHaveClass("ui-textarea--lg");
  });

  it("merges custom className", () => {
    render(<Textarea aria-label="n" className="custom" />);
    expect(screen.getByRole("textbox")).toHaveClass("ui-textarea", "custom");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="n" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("calls onChange when typing", async () => {
    const onChange = vi.fn();
    render(<Textarea aria-label="n" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("marks aria-invalid when error", () => {
    render(<Textarea aria-label="n" error />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("respects disabled", () => {
    render(<Textarea aria-label="n" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies resize variant class", () => {
    render(<Textarea aria-label="n" resize="none" />);
    expect(screen.getByRole("textbox")).toHaveClass("ui-textarea--resize-none");
  });

  it("passes axe", async () => {
    const { container } = render(<Textarea aria-label="notes" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
