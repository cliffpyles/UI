import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ChangeLog } from "./ChangeLog";

describe("ChangeLog", () => {
  it("renders changes", () => {
    render(
      <ChangeLog
        changes={[
          { field: "status", before: "draft", after: "published" },
        ]}
      />,
    );
    expect(screen.getByText("status")).toBeInTheDocument();
    expect(screen.getByText("draft")).toBeInTheDocument();
    expect(screen.getByText("published")).toBeInTheDocument();
  });

  it("renders em-dash for null", () => {
    render(<ChangeLog changes={[{ field: "x", before: null, after: "y" }]} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ChangeLog changes={[{ field: "x", before: "a", after: "b" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
