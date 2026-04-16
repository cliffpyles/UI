import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AttachmentList } from "./AttachmentList";

const FILES = [
  { name: "a.pdf", size: 1024 },
  { name: "b.png", size: 2048, type: "image/png" },
];

describe("AttachmentList", () => {
  it("renders files", () => {
    render(<AttachmentList files={FILES} />);
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
  });

  it("shows empty message", () => {
    render(<AttachmentList files={[]} />);
    expect(screen.getByText("No attachments")).toBeInTheDocument();
  });

  it("calls onRemove with index", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<AttachmentList files={FILES} onRemove={fn} />);
    await user.click(screen.getByRole("button", { name: "Remove a.pdf" }));
    expect(fn).toHaveBeenCalledWith(0);
  });

  it("no a11y violations", async () => {
    const { container } = render(<AttachmentList files={FILES} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
