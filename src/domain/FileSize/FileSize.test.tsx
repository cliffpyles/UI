import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { FileSize } from "./FileSize";

describe("FileSize", () => {
  it("formats bytes", () => {
    render(<FileSize bytes={1024} />);
    expect(screen.getByText(/1\.0 KB/)).toBeInTheDocument();
  });

  it("em-dash for null", () => {
    render(<FileSize bytes={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("em-dash for negative", () => {
    render(<FileSize bytes={-1} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<FileSize ref={ref} bytes={0} className="x" data-testid="f" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("f")).toHaveClass("ui-file-size", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<FileSize bytes={2048} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
