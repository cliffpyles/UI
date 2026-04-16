import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { MentionToken } from "./MentionToken";

describe("MentionToken", () => {
  it("renders with @ prefix for users", () => {
    render(<MentionToken entity={{ type: "user", label: "jane" }} />);
    expect(screen.getByText(/jane/)).toBeInTheDocument();
    expect(screen.getByText("@")).toBeInTheDocument();
  });

  it("uses # for channel variant", () => {
    render(<MentionToken entity={{ type: "channel", label: "general" }} variant="channel" />);
    expect(screen.getByText("#")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <MentionToken
        ref={ref}
        entity={{ type: "user", label: "j" }}
        className="x"
        data-testid="m"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("m")).toHaveClass("ui-mention-token", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <MentionToken entity={{ type: "user", label: "jane" }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
