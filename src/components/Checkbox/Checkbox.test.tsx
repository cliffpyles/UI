import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<Checkbox label="Newsletter" description="Weekly updates" />);
    expect(screen.getByText("Weekly updates")).toBeInTheDocument();
  });

  // --- Controlled ---

  it("works in controlled mode", async () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} label="Check" />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("reflects controlled checked state", () => {
    render(<Checkbox checked={true} onChange={() => {}} label="Check" />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  // --- Uncontrolled ---

  it("works in uncontrolled mode", async () => {
    render(<Checkbox defaultChecked={false} label="Check" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  // --- Indeterminate ---

  it("sets indeterminate property", () => {
    render(<Checkbox indeterminate label="Partial" />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("applies aria-checked='mixed' when indeterminate", () => {
    render(<Checkbox indeterminate label="Partial" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  // --- Toggle on click ---

  it("toggles on click", async () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} label="Toggle" />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles when clicking the label", async () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} label="Click me" />);
    await userEvent.click(screen.getByText("Click me"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // --- Keyboard ---

  it("toggles on Space key", async () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} label="Space" />);
    screen.getByRole("checkbox").focus();
    await userEvent.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // --- Disabled ---

  it("prevents interaction when disabled", async () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onChange={handleChange} label="Disabled" />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Checkbox disabled label="Disabled" />);
    expect(container.firstChild).toHaveClass("ui-checkbox--disabled");
  });

  // --- Ref forwarding ---

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(
      <Checkbox className="custom" label="Cls" />,
    );
    expect(container.firstChild).toHaveClass("ui-checkbox");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox label="Accessible" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(
      <Checkbox checked onChange={() => {}} label="Checked" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when indeterminate", async () => {
    const { container } = render(
      <Checkbox indeterminate label="Indeterminate" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
