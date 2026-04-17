import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TimelineLayout } from "./TimelineLayout";

const rows = [
  { id: "a", label: "Row A", content: <div>content-a</div> },
  { id: "b", label: "Row B", content: <div>content-b</div> },
];

describe("TimelineLayout", () => {
  it("renders labels, time axis, and row content", () => {
    render(
      <TimelineLayout rows={rows} timeAxis={<div>axis</div>} />,
    );
    expect(screen.getByRole("region", { name: "Timeline" })).toBeInTheDocument();
    expect(screen.getByText("axis")).toBeInTheDocument();
    expect(screen.getByText("Row A")).toBeInTheDocument();
    expect(screen.getByText("Row B")).toBeInTheDocument();
    expect(screen.getByText("content-a")).toBeInTheDocument();
    expect(screen.getByText("content-b")).toBeInTheDocument();
  });

  it("applies labelWidth via CSS variable", () => {
    const { container } = render(
      <TimelineLayout rows={rows} timeAxis={<div>axis</div>} labelWidth={240} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--ui-timeline-label-width")).toBe("240px");
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TimelineLayout
        ref={ref}
        className="extra"
        rows={rows}
        timeAxis={<div>axis</div>}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-timeline-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TimelineLayout rows={rows} timeAxis={<div>axis</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
