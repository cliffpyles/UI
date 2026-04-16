import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input aria-label="Test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with correct type attribute", () => {
    render(<Input type="email" aria-label="Email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("renders placeholder text", () => {
    render(<Input placeholder="Enter text" aria-label="Test" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  // --- Sizes ---

  it("applies sm size class", () => {
    const { container } = render(<Input size="sm" aria-label="Test" />);
    expect(container.firstChild).toHaveClass("ui-input-wrapper--sm");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Input aria-label="Test" />);
    expect(container.firstChild).toHaveClass("ui-input-wrapper--md");
  });

  it("applies lg size class", () => {
    const { container } = render(<Input size="lg" aria-label="Test" />);
    expect(container.firstChild).toHaveClass("ui-input-wrapper--lg");
  });

  // --- Controlled / Uncontrolled ---

  it("works in controlled mode", async () => {
    const handleChange = vi.fn();
    render(
      <Input value="hello" onChange={handleChange} aria-label="Test" />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("hello");
    await userEvent.type(input, "x");
    expect(handleChange).toHaveBeenCalled();
  });

  it("works in uncontrolled mode", async () => {
    render(<Input defaultValue="initial" aria-label="Test" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");
    await userEvent.clear(input);
    await userEvent.type(input, "updated");
    expect(input).toHaveValue("updated");
  });

  // --- Error state ---

  it("applies error class and aria-invalid when error is true", () => {
    const { container } = render(<Input error aria-label="Test" />);
    expect(container.firstChild).toHaveClass("ui-input-wrapper--error");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not have aria-invalid when error is false", () => {
    render(<Input aria-label="Test" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  // --- Icons ---

  it("renders leading icon", () => {
    render(
      <Input
        leadingIcon={<span data-testid="lead-icon">L</span>}
        aria-label="Test"
      />,
    );
    expect(screen.getByTestId("lead-icon")).toBeInTheDocument();
  });

  it("renders trailing icon", () => {
    render(
      <Input
        trailingIcon={<span data-testid="trail-icon">T</span>}
        aria-label="Test"
      />,
    );
    expect(screen.getByTestId("trail-icon")).toBeInTheDocument();
  });

  // --- Addons ---

  it("renders leading addon", () => {
    const { container } = render(
      <Input leadingAddon="https://" aria-label="URL" />,
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      "ui-input-wrapper--has-leading-addon",
    );
  });

  it("renders trailing addon", () => {
    const { container } = render(
      <Input trailingAddon=".com" aria-label="Domain" />,
    );
    expect(screen.getByText(".com")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      "ui-input-wrapper--has-trailing-addon",
    );
  });

  // --- Disabled ---

  it("disables the input when disabled is true", () => {
    const { container } = render(<Input disabled aria-label="Test" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(container.firstChild).toHaveClass("ui-input-wrapper--disabled");
  });

  it("does not call onChange when disabled", async () => {
    const handleChange = vi.fn();
    render(
      <Input disabled onChange={handleChange} aria-label="Test" />,
    );
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "x");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // --- Ref forwarding ---

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe("INPUT");
  });

  // --- Prop spreading ---

  it("spreads additional props onto the input element", () => {
    render(<Input data-testid="my-input" id="input-1" aria-label="Test" />);
    const input = screen.getByTestId("my-input");
    expect(input).toHaveAttribute("id", "input-1");
  });

  // --- className merging ---

  it("applies className to the wrapper element", () => {
    const { container } = render(
      <Input className="custom-class" aria-label="Test" />,
    );
    expect(container.firstChild).toHaveClass("ui-input-wrapper");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  // --- Edge cases ---

  it("handles empty string value", () => {
    render(<Input value="" onChange={() => {}} aria-label="Test" />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("handles very long placeholder text", () => {
    const longText = "A".repeat(500);
    render(<Input placeholder={longText} aria-label="Test" />);
    expect(screen.getByPlaceholderText(longText)).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <label>
        Name
        <Input />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with error state", async () => {
    const { container } = render(
      <label>
        Email
        <Input error type="email" />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
