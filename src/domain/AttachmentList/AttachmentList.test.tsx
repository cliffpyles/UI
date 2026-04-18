import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { AttachmentList, type Attachment } from "./AttachmentList";

const ITEMS: Attachment[] = [
  { id: "a", name: "a.pdf", size: 1024 },
  { id: "b", name: "b.png", size: 2048, mimeType: "image/png" },
];

describe("AttachmentList", () => {
  it("renders a FileAttachment per item", () => {
    const { container } = render(<AttachmentList items={ITEMS} />);
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.png")).toBeInTheDocument();
    expect(container.querySelectorAll(".ui-file-attachment")).toHaveLength(2);
    expect(container.querySelector('[role="list"]')).not.toBeNull();
  });

  it("renders emptyLabel when items is empty", () => {
    render(<AttachmentList items={[]} />);
    expect(screen.getByText("No attachments")).toBeInTheDocument();
  });

  it("renders an Add button when onAdd is provided and fires the handler", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AttachmentList items={[]} onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: "Add attachment" }));
    expect(onAdd).toHaveBeenCalled();
  });

  it("calls onRemove with the item id", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<AttachmentList items={ITEMS} onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remove a.pdf" }));
    expect(onRemove).toHaveBeenCalledWith("a");
  });

  it("readOnly suppresses add/remove even when handlers are provided", () => {
    render(
      <AttachmentList
        items={ITEMS}
        readOnly
        onAdd={() => {}}
        onRemove={() => {}}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Add attachment" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Remove/ }),
    ).not.toBeInTheDocument();
  });

  it("forwards ref and spreads props to root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<AttachmentList ref={ref} items={[]} data-testid="list" />);
    expect(ref.current).not.toBeNull();
    expect(screen.getByTestId("list")).toBe(ref.current);
  });

  it("has no a11y violations (empty, populated, read-only)", async () => {
    for (const node of [
      <AttachmentList key="empty" items={[]} />,
      <AttachmentList key="populated" items={ITEMS} onRemove={() => {}} />,
      <AttachmentList key="readonly" items={ITEMS} readOnly />,
    ]) {
      const { container, unmount } = render(node);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
