import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { ResizablePanel } from "./ResizablePanel";

describe("ResizablePanel", () => {
  it("renders children and handle", () => {
    render(
      <ResizablePanel size={200} onResize={() => {}}>
        <p>content</p>
      </ResizablePanel>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("applies size as width for horizontal direction", () => {
    render(
      <ResizablePanel size={240} onResize={() => {}} data-testid="p">
        <div />
      </ResizablePanel>,
    );
    const panel = screen.getByTestId("p");
    expect(panel.style.width).toBe("240px");
  });

  it("applies size as height for vertical direction", () => {
    render(
      <ResizablePanel direction="vertical" size={120} onResize={() => {}} data-testid="p">
        <div />
      </ResizablePanel>,
    );
    expect(screen.getByTestId("p").style.height).toBe("120px");
  });

  it("increments size with ArrowRight", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={200} step={10} onResize={onResize} />);
    const handle = screen.getByRole("separator");
    handle.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onResize).toHaveBeenCalledWith(210);
  });

  it("decrements size with ArrowLeft", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={200} step={10} onResize={onResize} />);
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(onResize).toHaveBeenCalledWith(190);
  });

  it("clamps to minSize with Home", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={300} minSize={100} onResize={onResize} />);
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{Home}");
    expect(onResize).toHaveBeenCalledWith(100);
  });

  it("clamps to maxSize with End", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={300} maxSize={500} onResize={onResize} />);
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{End}");
    expect(onResize).toHaveBeenCalledWith(500);
  });

  it("does not exceed maxSize on arrow", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={495} maxSize={500} step={20} onResize={onResize} />);
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onResize).toHaveBeenCalledWith(500);
  });

  it("ignores key events when disabled", async () => {
    const onResize = vi.fn();
    render(<ResizablePanel size={200} disabled onResize={onResize} />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-disabled", "true");
    expect(handle).toHaveAttribute("tabIndex", "-1");
  });

  it("exposes aria values", () => {
    render(<ResizablePanel size={220} minSize={100} maxSize={400} onResize={() => {}} />);
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-valuenow", "220");
    expect(handle).toHaveAttribute("aria-valuemin", "100");
    expect(handle).toHaveAttribute("aria-valuemax", "400");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ResizablePanel ref={ref} size={100} onResize={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    render(
      <ResizablePanel className="x" size={100} onResize={() => {}} data-testid="p" />,
    );
    expect(screen.getByTestId("p")).toHaveClass("ui-resizable-panel", "x");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ResizablePanel size={200} onResize={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
