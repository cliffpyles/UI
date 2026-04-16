import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { TeamBadge } from "./TeamBadge";

describe("TeamBadge", () => {
  it("renders team name", () => {
    render(<TeamBadge team={{ name: "Platform Team" }} />);
    expect(screen.getByText("Platform Team")).toBeInTheDocument();
  });

  it("uses accessible label when label hidden", () => {
    render(<TeamBadge team={{ name: "Platform" }} showLabel={false} />);
    expect(screen.getByRole("img", { name: "Platform" })).toBeInTheDocument();
  });

  it("accepts color", () => {
    render(<TeamBadge team={{ name: "P", color: "#ff0000" }} data-testid="t" />);
    expect(screen.getByTestId("t").querySelector(".ui-team-badge__mark")).toHaveStyle({
      backgroundColor: "#ff0000",
    });
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <TeamBadge ref={ref} team={{ name: "P" }} className="x" data-testid="t" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("t")).toHaveClass("ui-team-badge", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<TeamBadge team={{ name: "Platform" }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
