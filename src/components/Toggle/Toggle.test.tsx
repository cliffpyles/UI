import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("renders a switch", () => {
    render(<Toggle aria-label="Feature toggle" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders label text", () => {
    render(<Toggle label="Dark mode" />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  // --- Click toggle ---

  it("toggles on click", async () => {
    const handleChange = vi.fn();
    render(<Toggle onChange={handleChange} aria-label="Toggle" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // --- Space key ---

  it("toggles on Space key", async () => {
    const handleChange = vi.fn();
    render(<Toggle onChange={handleChange} aria-label="Toggle" />);
    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // --- Controlled ---

  it("works in controlled mode", () => {
    render(<Toggle checked={true} onChange={() => {}} aria-label="Toggle" />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("fires onChange in controlled mode", async () => {
    const handleChange = vi.fn();
    render(<Toggle checked={false} onChange={handleChange} aria-label="Toggle" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // --- Uncontrolled ---

  it("works in uncontrolled mode", async () => {
    render(<Toggle defaultChecked={false} aria-label="Toggle" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  // --- Sizes ---

  it("applies md size class by default", () => {
    const { container } = render(<Toggle aria-label="Toggle" />);
    expect(container.firstChild).toHaveClass("ui-toggle--md");
  });

  it("applies sm size class", () => {
    const { container } = render(<Toggle size="sm" aria-label="Toggle" />);
    expect(container.firstChild).toHaveClass("ui-toggle--sm");
  });

  // --- Disabled ---

  it("prevents interaction when disabled", async () => {
    const handleChange = vi.fn();
    render(<Toggle disabled onChange={handleChange} aria-label="Toggle" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies disabled class", () => {
    const { container } = render(<Toggle disabled aria-label="Toggle" />);
    expect(container.firstChild).toHaveClass("ui-toggle--disabled");
  });

  // --- aria-checked ---

  it("has aria-checked matching state", async () => {
    render(<Toggle defaultChecked={false} aria-label="Toggle" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  // --- Ref forwarding ---

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Toggle ref={ref} aria-label="Toggle" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(
      <Toggle className="custom" aria-label="Toggle" />,
    );
    expect(container.firstChild).toHaveClass("ui-toggle");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Toggle label="Enable feature" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(
      <Toggle checked onChange={() => {}} label="Enabled" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
