import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { FormField } from "./FormField";

describe("FormField", () => {
  // --- Basic rendering ---

  it("renders label and child input", () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(
      <FormField label="Username">
        <input />
      </FormField>,
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  // --- Label-input linking ---

  it("links label to input via auto-generated id", () => {
    render(
      <FormField label="Name">
        <input />
      </FormField>,
    );
    const input = screen.getByLabelText("Name");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("id");
  });

  it("uses provided htmlFor to link label and input", () => {
    render(
      <FormField label="Name" htmlFor="custom-id">
        <input />
      </FormField>,
    );
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("preserves existing id on child input", () => {
    render(
      <FormField label="Name">
        <input id="my-input" />
      </FormField>,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "my-input");
  });

  // --- Error ---

  it("renders error message", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("links error to input via aria-describedby", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    const errorEl = screen.getByRole("alert");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(errorEl.id));
  });

  it("sets aria-invalid on input when error is present", () => {
    render(
      <FormField label="Email" error="Invalid">
        <input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).not.toHaveAttribute("aria-invalid");
  });

  it("applies error class to wrapper", () => {
    const { container } = render(
      <FormField label="Email" error="Bad">
        <input />
      </FormField>,
    );
    expect(container.firstChild).toHaveClass("ui-form-field--error");
  });

  // --- Hint ---

  it("renders hint text", () => {
    render(
      <FormField label="Password" hint="Must be 8+ characters">
        <input />
      </FormField>,
    );
    expect(screen.getByText("Must be 8+ characters")).toBeInTheDocument();
  });

  it("links hint to input via aria-describedby", () => {
    render(
      <FormField label="Password" hint="Must be 8+ characters">
        <input />
      </FormField>,
    );
    const input = screen.getByLabelText("Password");
    const hintEl = screen.getByText("Must be 8+ characters");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(hintEl.id));
  });

  it("hides hint when error is present", () => {
    render(
      <FormField label="Password" hint="Must be 8+ chars" error="Too short">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("Must be 8+ chars")).not.toBeInTheDocument();
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  // --- Required ---

  it("shows required indicator", () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText("(required)")).toBeInTheDocument();
  });

  it("does not show required indicator by default", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("(required)")).not.toBeInTheDocument();
  });

  // --- Ref forwarding ---

  it("forwards ref to the wrapper div", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FormField ref={ref} label="Name">
        <input />
      </FormField>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-form-field");
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(
      <FormField label="Name" className="custom">
        <input />
      </FormField>,
    );
    expect(container.firstChild).toHaveClass("ui-form-field");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Prop spreading ---

  it("spreads additional props to wrapper", () => {
    render(
      <FormField label="Name" data-testid="field" id="field-1">
        <input />
      </FormField>,
    );
    expect(screen.getByTestId("field")).toHaveAttribute("id", "field-1");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FormField label="Email">
        <input type="email" />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with error", async () => {
    const { container } = render(
      <FormField label="Email" error="Invalid email">
        <input type="email" />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with hint", async () => {
    const { container } = render(
      <FormField label="Password" hint="Must be 8+ characters">
        <input type="password" />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when required", async () => {
    const { container } = render(
      <FormField label="Name" required>
        <input />
      </FormField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
