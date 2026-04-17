import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FullViewportCanvas } from "./FullViewportCanvas";

describe("FullViewportCanvas", () => {
  it("renders canvas content", () => {
    render(<FullViewportCanvas canvas={<div>map</div>} />);
    expect(screen.getByText("map")).toBeInTheDocument();
  });

  it("renders corner slots", () => {
    render(
      <FullViewportCanvas
        canvas={<div>c</div>}
        topLeft={<span>TL</span>}
        topRight={<span>TR</span>}
        bottomLeft={<span>BL</span>}
        bottomRight={<span>BR</span>}
      />,
    );
    expect(screen.getByText("TL")).toBeInTheDocument();
    expect(screen.getByText("TR")).toBeInTheDocument();
    expect(screen.getByText("BL")).toBeInTheDocument();
    expect(screen.getByText("BR")).toBeInTheDocument();
  });

  it("renders overlay when provided", () => {
    render(<FullViewportCanvas canvas={<div>c</div>} overlay={<div>loading</div>} />);
    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FullViewportCanvas canvas={<div>c</div>} topLeft={<button>Zoom</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
