import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Modal } from "./Modal";

describe("Modal", () => {
  // --- Basic rendering ---

  it("renders content when open", () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("renders title", () => {
    render(
      <Modal open onClose={() => {}} title="Confirm">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <Modal open onClose={() => {}} title="Confirm" description="Are you sure?">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Modal open onClose={() => {}} footer={<button>Save</button>}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  // --- ARIA ---

  it("has role dialog and aria-modal", () => {
    render(
      <Modal open onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-labelledby pointing to title", () => {
    render(
      <Modal open onClose={() => {}} title="My Title">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toHaveTextContent("My Title");
  });

  it("has aria-describedby pointing to description", () => {
    render(
      <Modal open onClose={() => {}} title="Title" description="Desc text">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toHaveTextContent("Desc text");
  });

  // --- Close button ---

  it("renders close button when title is present", () => {
    render(
      <Modal open onClose={() => {}} title="Title">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  // --- Escape ---

  it("calls onClose on Escape key", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close on Escape when closeOnEscape is false", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnEscape={false} title="Title">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  // --- Overlay click ---

  it("calls onClose on overlay click", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>,
    );
    // Click on the overlay (the backdrop element), not the dialog itself
    const overlay = screen.getByRole("dialog").parentElement!;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close on overlay click when closeOnOverlayClick is false", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} closeOnOverlayClick={false} title="Title">
        <p>Content</p>
      </Modal>,
    );
    const overlay = screen.getByRole("dialog").parentElement!;
    await userEvent.click(overlay);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when clicking inside the modal content", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title">
        <p>Content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByText("Content"));
    expect(onClose).not.toHaveBeenCalled();
  });

  // --- Focus trap ---

  it("traps focus within modal (Tab wraps from last to first)", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title" footer={<button>Save</button>}>
        <button>Inside</button>
      </Modal>,
    );
    const saveBtn = screen.getByRole("button", { name: "Save" });
    saveBtn.focus();
    await userEvent.tab();
    // Should wrap to first focusable element (the Close button)
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close" }),
    );
  });

  it("traps focus within modal (Shift+Tab wraps from first to last)", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Title" footer={<button>Save</button>}>
        <button>Inside</button>
      </Modal>,
    );
    const closeBtn = screen.getByRole("button", { name: "Close" });
    closeBtn.focus();
    await userEvent.tab({ shift: true });
    // Should wrap to last focusable (Save button)
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Save" }),
    );
  });

  // --- Focus management ---

  it("moves focus to first focusable element on open", () => {
    render(
      <Modal open onClose={() => {}} title="Title">
        <button>First</button>
      </Modal>,
    );
    // Close button is the first focusable element in the header
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close" }),
    );
  });

  it("returns focus to trigger element on close", async () => {
    const Wrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} onClose={() => setOpen(false)} title="Title">
            <p>Content</p>
          </Modal>
        </>
      );
    };
    render(<Wrapper />);
    const openBtn = screen.getByRole("button", { name: "Open" });
    await userEvent.click(openBtn);
    // Modal is now open, close it via the Close button
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.activeElement).toBe(openBtn);
  });

  // --- Body scroll lock ---

  it("locks body scroll when open", () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    rerender(
      <Modal open={false} onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  // --- Size variants ---

  it("applies sm size class", () => {
    render(
      <Modal open onClose={() => {}} size="sm">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("ui-modal--sm");
  });

  it("defaults to md size", () => {
    render(
      <Modal open onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("ui-modal--md");
  });

  it("applies lg size class", () => {
    render(
      <Modal open onClose={() => {}} size="lg">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("ui-modal--lg");
  });

  // --- Ref forwarding ---

  it("forwards ref to the dialog element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Modal ref={ref} open onClose={() => {}}>
        <p>Content</p>
      </Modal>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "dialog");
  });

  // --- className merging ---

  it("merges custom className", () => {
    render(
      <Modal open onClose={() => {}} className="custom">
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("ui-modal");
    expect(dialog).toHaveClass("custom");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Modal open onClose={() => {}} title="Accessible Modal">
        <p>Content here</p>
      </Modal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with description and footer", async () => {
    const { container } = render(
      <Modal
        open
        onClose={() => {}}
        title="Confirm"
        description="This action cannot be undone."
        footer={<button>Confirm</button>}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// Helper - import useState for focus return test
import { useState } from "react";
