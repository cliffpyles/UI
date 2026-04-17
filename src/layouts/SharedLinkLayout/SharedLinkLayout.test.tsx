import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SharedLinkLayout } from "./SharedLinkLayout";

describe("SharedLinkLayout", () => {
  it("shows url in a readonly input", () => {
    render(<SharedLinkLayout url="https://example.com/r/abc" />);
    const input = screen.getByRole("textbox", { name: "Shareable link" });
    expect(input).toHaveValue("https://example.com/r/abc");
    expect(input).toHaveAttribute("readonly");
  });

  it("calls onCopy when copy button is clicked", async () => {
    const onCopy = vi.fn();
    render(<SharedLinkLayout url="https://x" onCopy={onCopy} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(onCopy).toHaveBeenCalled();
  });

  it("renders optional embed, preview, and options sections", () => {
    render(
      <SharedLinkLayout
        url="https://x"
        preview={<div>preview body</div>}
        embed={<code>{"<iframe />"}</code>}
        options={<div>perms</div>}
      />,
    );
    expect(screen.getByRole("region", { name: "Link preview" })).toHaveTextContent(
      "preview body",
    );
    expect(screen.getByRole("region", { name: "Embed code" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Sharing options" }),
    ).toHaveTextContent("perms");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <SharedLinkLayout ref={ref} className="custom" url="https://x" />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("ui-shared-link", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SharedLinkLayout url="https://x" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
