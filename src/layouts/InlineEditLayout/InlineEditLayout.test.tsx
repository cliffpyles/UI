import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { InlineEditLayout } from "./InlineEditLayout";

describe("InlineEditLayout", () => {
  it("renders display when not editing", () => {
    render(
      <InlineEditLayout
        value="Hello"
        editor={<input />}
        isEditing={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Edit value" })).toHaveTextContent(
      "Hello",
    );
  });

  it("renders editor when editing", () => {
    render(
      <InlineEditLayout
        value="Hello"
        editor={<input aria-label="field" defaultValue="Hi" />}
        isEditing
      />,
    );
    expect(screen.getByRole("textbox", { name: "field" })).toBeInTheDocument();
  });

  it("calls onEdit when display clicked", async () => {
    const onEdit = vi.fn();
    render(
      <InlineEditLayout
        value="Hello"
        editor={<input />}
        isEditing={false}
        onEdit={onEdit}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Edit value" }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("Enter saves and Escape cancels", async () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <InlineEditLayout
        value="Hello"
        editor={<input aria-label="field" />}
        isEditing
        onSave={onSave}
        onCancel={onCancel}
      />,
    );
    const input = screen.getByRole("textbox", { name: "field" });
    input.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSave).toHaveBeenCalled();
    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalled();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <InlineEditLayout
        ref={ref}
        className="custom"
        value="v"
        editor={<input />}
        isEditing={false}
      />,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <InlineEditLayout
        value="Hello"
        editor={<input aria-label="f" />}
        isEditing={false}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
