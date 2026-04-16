import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Select } from "./Select";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Select", () => {
  it("renders a select element", () => {
    render(<Select options={options} aria-label="Fruit" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={options} aria-label="Fruit" />);
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  // --- Placeholder ---

  it("renders placeholder as disabled first option", () => {
    render(
      <Select options={options} placeholder="Choose a fruit" aria-label="Fruit" />,
    );
    const placeholder = screen.getByRole("option", { name: "Choose a fruit" });
    expect(placeholder).toBeDisabled();
  });

  // --- Controlled ---

  it("works in controlled mode", () => {
    render(
      <Select
        options={options}
        value="banana"
        onChange={() => {}}
        aria-label="Fruit"
      />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("banana");
  });

  it("calls onChange with selected value", async () => {
    const handleChange = vi.fn();
    render(
      <Select
        options={options}
        value="apple"
        onChange={handleChange}
        aria-label="Fruit"
      />,
    );
    await userEvent.selectOptions(screen.getByRole("combobox"), "banana");
    expect(handleChange).toHaveBeenCalledWith("banana");
  });

  // --- Uncontrolled ---

  it("works in uncontrolled mode", async () => {
    render(
      <Select options={options} defaultValue="apple" aria-label="Fruit" />,
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("apple");
    await userEvent.selectOptions(select, "cherry");
    expect(select).toHaveValue("cherry");
  });

  // --- Sizes ---

  it("applies md size class by default", () => {
    const { container } = render(
      <Select options={options} aria-label="Fruit" />,
    );
    expect(container.firstChild).toHaveClass("ui-select--md");
  });

  it("applies sm size class", () => {
    const { container } = render(
      <Select options={options} size="sm" aria-label="Fruit" />,
    );
    expect(container.firstChild).toHaveClass("ui-select--sm");
  });

  it("applies lg size class", () => {
    const { container } = render(
      <Select options={options} size="lg" aria-label="Fruit" />,
    );
    expect(container.firstChild).toHaveClass("ui-select--lg");
  });

  // --- Error state ---

  it("applies error class and aria-invalid", () => {
    const { container } = render(
      <Select options={options} error aria-label="Fruit" />,
    );
    expect(container.firstChild).toHaveClass("ui-select--error");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  // --- Disabled ---

  it("disables the select when disabled", () => {
    const { container } = render(
      <Select options={options} disabled aria-label="Fruit" />,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(container.firstChild).toHaveClass("ui-select--disabled");
  });

  // --- Disabled option ---

  it("renders a disabled option", () => {
    const opts = [
      ...options,
      { value: "durian", label: "Durian", disabled: true },
    ];
    render(<Select options={opts} aria-label="Fruit" />);
    expect(screen.getByRole("option", { name: "Durian" })).toBeDisabled();
  });

  // --- Ref forwarding ---

  it("forwards ref to the select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} options={options} aria-label="Fruit" />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(
      <Select options={options} className="custom" aria-label="Fruit" />,
    );
    expect(container.firstChild).toHaveClass("ui-select");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Prop spreading ---

  it("spreads additional props onto the select element", () => {
    render(
      <Select options={options} id="fruit-select" aria-label="Fruit" />,
    );
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "fruit-select");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <label>
        Fruit
        <Select options={options} />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with error state", async () => {
    const { container } = render(
      <label>
        Fruit
        <Select options={options} error />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
