import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders children", () => {
    render(<Tag>Status</Tag>);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  // --- Variants ---

  it("applies neutral variant by default", () => {
    const { container } = render(<Tag>Tag</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--neutral");
  });

  it("applies primary variant", () => {
    const { container } = render(<Tag variant="primary">Primary</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--primary");
  });

  it("applies success variant", () => {
    const { container } = render(<Tag variant="success">Success</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--success");
  });

  it("applies warning variant", () => {
    const { container } = render(<Tag variant="warning">Warning</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--warning");
  });

  it("applies error variant", () => {
    const { container } = render(<Tag variant="error">Error</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--error");
  });

  // --- Sizes ---

  it("applies md size by default", () => {
    const { container } = render(<Tag>Md</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--md");
  });

  it("applies sm size", () => {
    const { container } = render(<Tag size="sm">Sm</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag--sm");
  });

  // --- Removable ---

  it("does not show remove button by default", () => {
    render(<Tag>Tag</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows remove button when removable", () => {
    render(<Tag removable>Tag</Tag>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const handleRemove = vi.fn();
    render(
      <Tag removable onRemove={handleRemove}>
        Tag
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it("remove button has accessible label", () => {
    render(
      <Tag removable onRemove={() => {}}>
        Active
      </Tag>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Remove Active",
    );
  });

  // --- Keyboard on remove ---

  it("triggers remove on Enter key", async () => {
    const handleRemove = vi.fn();
    render(
      <Tag removable onRemove={handleRemove}>
        Tag
      </Tag>,
    );
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it("triggers remove on Space key", async () => {
    const handleRemove = vi.fn();
    render(
      <Tag removable onRemove={handleRemove}>
        Tag
      </Tag>,
    );
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  // --- Ref forwarding ---

  it("forwards ref to the span element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tag ref={ref}>Tag</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  // --- className merging ---

  it("merges custom className", () => {
    const { container } = render(<Tag className="custom">Tag</Tag>);
    expect(container.firstChild).toHaveClass("ui-tag");
    expect(container.firstChild).toHaveClass("custom");
  });

  // --- Prop spreading ---

  it("spreads additional props", () => {
    render(<Tag data-testid="my-tag" id="tag-1">Tag</Tag>);
    expect(screen.getByTestId("my-tag")).toHaveAttribute("id", "tag-1");
  });

  // --- Edge cases ---

  it("handles empty string children", () => {
    const { container } = render(<Tag>{""}</Tag>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles very long text", () => {
    const longText = "A".repeat(200);
    render(<Tag>{longText}</Tag>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(<Tag>Accessible</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations when removable", async () => {
    const { container } = render(
      <Tag removable onRemove={() => {}}>
        Removable
      </Tag>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
