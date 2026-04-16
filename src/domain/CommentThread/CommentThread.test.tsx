import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CommentThread } from "./CommentThread";

const COMMENTS = [
  {
    id: "1",
    author: { name: "Jane" },
    body: "Hello",
    timestamp: new Date(),
    replies: [
      {
        id: "2",
        author: { name: "Bob" },
        body: "Reply",
        timestamp: new Date(),
      },
    ],
  },
];

describe("CommentThread", () => {
  it("renders comments and replies", () => {
    render(<CommentThread comments={COMMENTS} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("adds a comment", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<CommentThread comments={[]} onAdd={fn} />);
    await user.type(screen.getByLabelText("Add comment"), "Hi");
    await user.click(screen.getByRole("button", { name: "Comment" }));
    expect(fn).toHaveBeenCalledWith("Hi");
  });

  it("no a11y violations", async () => {
    const { container } = render(<CommentThread comments={COMMENTS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
