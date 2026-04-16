import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { UserAvatar } from "./UserAvatar";

describe("UserAvatar", () => {
  it("renders user name via avatar alt", () => {
    render(<UserAvatar user={{ name: "Jane Doe" }} />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
  });

  it("renders presence when enabled", () => {
    render(<UserAvatar user={{ name: "Jane", status: "online" }} showPresence />);
    expect(screen.getByRole("img", { name: "Online" })).toBeInTheDocument();
  });

  it("omits presence when disabled", () => {
    render(<UserAvatar user={{ name: "Jane", status: "online" }} />);
    expect(screen.queryByRole("img", { name: "Online" })).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <UserAvatar ref={ref} user={{ name: "Jane" }} className="x" data-testid="u" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("u")).toHaveClass("ui-user-avatar", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <UserAvatar user={{ name: "Jane", status: "away" }} showPresence />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
