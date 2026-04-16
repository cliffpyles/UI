import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Radio, RadioGroup } from "./Radio";

function renderGroup(props: Record<string, unknown> = {}) {
  return render(
    <RadioGroup aria-label="Fruits" {...props}>
      <Radio value="apple" label="Apple" />
      <Radio value="banana" label="Banana" />
      <Radio value="cherry" label="Cherry" />
    </RadioGroup>,
  );
}

describe("RadioGroup", () => {
  it("renders a radiogroup with radios", () => {
    renderGroup();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("only one radio selected at a time", async () => {
    const handleChange = vi.fn();
    renderGroup({ onChange: handleChange });
    const [apple, banana] = screen.getAllByRole("radio");
    await userEvent.click(apple);
    expect(handleChange).toHaveBeenCalledWith("apple");
    await userEvent.click(banana);
    expect(handleChange).toHaveBeenCalledWith("banana");
  });

  // --- Controlled ---

  it("works in controlled mode", () => {
    renderGroup({ value: "banana", onChange: () => {} });
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  // --- Uncontrolled ---

  it("works in uncontrolled mode", async () => {
    renderGroup({ defaultValue: "apple" });
    const [apple, banana] = screen.getAllByRole("radio");
    expect(apple).toBeChecked();
    await userEvent.click(banana);
    expect(banana).toBeChecked();
    expect(apple).not.toBeChecked();
  });

  // --- Keyboard navigation ---

  it("supports arrow key navigation between radios", async () => {
    renderGroup({ defaultValue: "apple" });
    const [apple] = screen.getAllByRole("radio");
    apple.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("radio")[1]).toBeChecked();
  });

  // --- Orientation ---

  it("applies vertical orientation by default", () => {
    renderGroup();
    expect(screen.getByRole("radiogroup")).toHaveClass(
      "ui-radio-group--vertical",
    );
  });

  it("applies horizontal orientation", () => {
    renderGroup({ orientation: "horizontal" });
    expect(screen.getByRole("radiogroup")).toHaveClass(
      "ui-radio-group--horizontal",
    );
  });

  // --- Disabled (group-level) ---

  it("disables all radios when group is disabled", () => {
    renderGroup({ disabled: true });
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  // --- Disabled (individual) ---

  it("disables individual radio", () => {
    render(
      <RadioGroup aria-label="Options">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" disabled />
      </RadioGroup>,
    );
    expect(screen.getAllByRole("radio")[1]).toBeDisabled();
  });

  // --- Ref forwarding ---

  it("forwards ref on RadioGroup", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} aria-label="Test">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref on Radio", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <RadioGroup aria-label="Test">
        <Radio ref={ref} value="a" label="A" />
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("radio");
  });

  // --- className merging ---

  it("merges className on RadioGroup", () => {
    renderGroup({ className: "custom-group" });
    expect(screen.getByRole("radiogroup")).toHaveClass("ui-radio-group");
    expect(screen.getByRole("radiogroup")).toHaveClass("custom-group");
  });

  // --- Description ---

  it("renders radio description", () => {
    render(
      <RadioGroup aria-label="Test">
        <Radio value="a" label="Option A" description="The first option" />
      </RadioGroup>,
    );
    expect(screen.getByText("The first option")).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = renderGroup();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with selection", async () => {
    const { container } = renderGroup({ value: "banana", onChange: () => {} });
    expect(await axe(container)).toHaveNoViolations();
  });
});
