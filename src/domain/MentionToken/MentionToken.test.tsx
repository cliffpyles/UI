import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MentionToken } from "./MentionToken";

describe("MentionToken", () => {
  it("renders Tag surface with prefix and handle for users", () => {
    const { container } = render(
      <MentionToken kind="user" handle="cliff" />,
    );
    expect(container.querySelector(".ui-tag")).not.toBeNull();
    expect(container.textContent).toContain("@");
    expect(container.textContent).toContain("cliff");
  });

  it("uses # prefix for channels and ~ for projects", () => {
    const a = render(<MentionToken kind="channel" handle="general" />);
    expect(a.container.textContent).toContain("#");
    a.unmount();
    const b = render(<MentionToken kind="project" handle="atlas" />);
    expect(b.container.textContent).toContain("~");
  });

  it("renders an <a> when href is provided", () => {
    render(<MentionToken kind="user" handle="cliff" href="/u/cliff" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/u/cliff");
  });

  it("renders no link when href is omitted", () => {
    render(<MentionToken kind="user" handle="cliff" />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("uses the provided label when available", () => {
    render(
      <MentionToken kind="user" handle="cliff" label="Cliff Pyles" />,
    );
    expect(screen.getByText("Cliff Pyles")).toBeInTheDocument();
  });

  it("custom prefix overrides the default", () => {
    const { container } = render(
      <MentionToken kind="custom" handle="x" prefix="!" />,
    );
    expect(container.textContent).toContain("!");
  });

  it("forwards ref and spreads remaining props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <MentionToken
        ref={ref}
        kind="user"
        handle="j"
        className="x"
        data-testid="m"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("m")).toHaveClass("ui-mention-token", "x");
  });

  it("axe passes (linked)", async () => {
    const { container } = render(
      <MentionToken kind="user" handle="cliff" href="/u/cliff" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("axe passes (unlinked)", async () => {
    const { container } = render(
      <MentionToken kind="user" handle="cliff" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
