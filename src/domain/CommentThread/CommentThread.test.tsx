import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CommentThread, type CommentNode } from "./CommentThread";

const NOW = new Date("2026-01-01T00:00:00Z");

const COMMENTS: CommentNode[] = [
  {
    id: "1",
    author: { name: "Jane" },
    body: "Hello",
    createdAt: NOW,
    reactions: [{ emoji: "👍", count: 2, reactedByMe: false }],
    replies: [
      {
        id: "2",
        author: { name: "Bob" },
        body: "Reply",
        createdAt: NOW,
      },
    ],
  },
];

describe("CommentThread", () => {
  it("renders comments with UserChip header and body Text", () => {
    render(<CommentThread comments={COMMENTS} />);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("renders as a labeled section", () => {
    render(<CommentThread comments={COMMENTS} />);
    expect(screen.getByRole("region", { name: "Comments" })).toBeInTheDocument();
  });

  it("submits a top-level comment with null parentId", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CommentThread comments={[]} onSubmit={fn} />);
    await user.type(screen.getByLabelText("New comment"), "Hi");
    await user.click(screen.getByRole("button", { name: "Comment" }));
    expect(fn).toHaveBeenCalledWith("Hi", null);
  });

  it("submits a reply with parentId", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CommentThread comments={COMMENTS} onSubmit={fn} />);
    await user.click(screen.getAllByRole("button", { name: "Reply" })[0]);
    await user.type(screen.getByLabelText("Reply to Jane"), "Hi");
    await user.click(screen.getByRole("button", { name: "Post reply" }));
    expect(fn).toHaveBeenCalledWith("Hi", "1");
  });

  it("reacts and exposes aria-pressed", async () => {
    const user = userEvent.setup();
    const react = vi.fn();
    render(<CommentThread comments={COMMENTS} onReact={react} />);
    const btn = screen.getByRole("button", { name: /React/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(react).toHaveBeenCalledWith("1", "👍");
  });

  it("flattens nesting beyond maxDepth", () => {
    const deep: CommentNode[] = [
      {
        id: "a",
        author: { name: "A" },
        body: "a",
        createdAt: NOW,
        replies: [
          {
            id: "b",
            author: { name: "B" },
            body: "b",
            createdAt: NOW,
            replies: [
              { id: "c", author: { name: "C" }, body: "c", createdAt: NOW },
            ],
          },
        ],
      },
    ];
    render(<CommentThread comments={deep} maxDepth={1} />);
    expect(screen.getAllByRole("article").length).toBe(3);
  });

  it("shows aria-busy when loading", () => {
    render(<CommentThread comments={[]} loading />);
    expect(screen.getByRole("region", { name: "Comments" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("forwards ref and spreads props", () => {
    const ref = createRef<HTMLElement>();
    render(
      <CommentThread
        ref={ref}
        comments={COMMENTS}
        data-testid="thread"
      />,
    );
    expect(ref.current?.tagName).toBe("SECTION");
    expect(screen.getByTestId("thread")).toBe(ref.current);
  });

  it("no a11y violations", async () => {
    const { container } = render(<CommentThread comments={COMMENTS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("empty state with composer only", async () => {
    const { container } = render(
      <CommentThread comments={[]} onSubmit={() => {}} />,
    );
    expect(screen.getByLabelText("New comment")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
