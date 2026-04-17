import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { GraphLayout } from "./GraphLayout";

describe("GraphLayout", () => {
  it("renders canvas, controls, and legend", () => {
    render(
      <GraphLayout
        canvas={<div>canvas</div>}
        controls={<button>zoom</button>}
        legend={<span>legend</span>}
      />,
    );
    expect(screen.getByRole("region", { name: "Graph" })).toBeInTheDocument();
    expect(screen.getByText("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "zoom" })).toBeInTheDocument();
    expect(screen.getByText("legend")).toBeInTheDocument();
  });

  it("omits controls and legend when not provided", () => {
    const { container } = render(<GraphLayout canvas={<div>c</div>} />);
    expect(container.querySelector(".ui-graph-layout__controls")).toBeNull();
    expect(container.querySelector(".ui-graph-layout__legend")).toBeNull();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <GraphLayout ref={ref} className="extra" canvas={<div>c</div>} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-graph-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GraphLayout canvas={<div>c</div>} controls={<button>b</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
