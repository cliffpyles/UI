import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { AccessIndicator } from "./AccessIndicator";

describe("AccessIndicator", () => {
  it("renders locked status with default tooltip label", () => {
    render(<AccessIndicator status="locked" />);
    expect(screen.getByRole("img", { name: "Locked" })).toBeInTheDocument();
  });

  it("renders restricted status with default tooltip label", () => {
    render(<AccessIndicator status="restricted" />);
    expect(
      screen.getByRole("img", { name: "Restricted access" }),
    ).toBeInTheDocument();
  });

  it("renders open status with default tooltip label", () => {
    render(<AccessIndicator status="open" />);
    expect(screen.getByRole("img", { name: "Open access" })).toBeInTheDocument();
  });

  it("renders shared status with default tooltip label", () => {
    render(<AccessIndicator status="shared" />);
    expect(screen.getByRole("img", { name: "Shared" })).toBeInTheDocument();
  });

  it("lets label override the default tooltip text", () => {
    render(
      <AccessIndicator status="restricted" label="Visible to admins only" />,
    );
    expect(
      screen.getByRole("img", { name: "Visible to admins only" }),
    ).toBeInTheDocument();
  });

  it("is keyboard focusable so the tooltip is reachable", () => {
    render(<AccessIndicator status="locked" />);
    const host = screen.getByRole("img", { name: "Locked" });
    expect(host).toHaveAttribute("tabindex", "0");
  });

  it("forwards ref to the root span", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<AccessIndicator status="open" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no accessibility violations in each status", async () => {
    for (const status of ["locked", "restricted", "open", "shared"] as const) {
      const { container, unmount } = render(
        <AccessIndicator status={status} />,
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
