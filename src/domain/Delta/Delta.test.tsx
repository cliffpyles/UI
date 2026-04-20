import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Delta } from "./Delta";

describe("Delta", () => {
  it("absolute positive", () => {
    render(
      <Delta current={110} previous={100} display="absolute" data-testid="d" locale="en-US" />,
    );
    expect(screen.getByTestId("d")).toHaveTextContent("+10");
    expect(screen.getByTestId("d")).toHaveClass("ui-delta--up");
  });

  it("absolute negative", () => {
    render(
      <Delta current={90} previous={100} display="absolute" data-testid="d" locale="en-US" />,
    );
    expect(screen.getByTestId("d")).toHaveTextContent("\u221210");
    expect(screen.getByTestId("d")).toHaveClass("ui-delta--down");
  });

  it("percent change", () => {
    render(
      <Delta current={110} previous={100} display="percent" data-testid="d" locale="en-US" />,
    );
    expect(screen.getByTestId("d").textContent).toMatch(/\+10/);
  });

  it("both mode renders absolute and percent", () => {
    render(
      <Delta current={110} previous={100} display="both" data-testid="d" locale="en-US" />,
    );
    expect(screen.getByTestId("d").textContent).toMatch(/\+10/);
    expect(screen.getByTestId("d").textContent).toMatch(/%/);
  });

  it("em-dash for null", () => {
    render(<Delta current={null} previous={1} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("em-dash for percent when previous is 0", () => {
    render(<Delta current={10} previous={0} display="percent" />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("negative-good polarity inverts coloring, not direction", () => {
    render(
      <Delta
        current={110}
        previous={100}
        polarity="negative-good"
        data-testid="d"
      />,
    );
    expect(screen.getByTestId("d")).toHaveClass("ui-delta--up");
  });

  it("accepts explicit delta and percent", () => {
    render(
      <Delta delta={-5} percent={-0.05} display="both" data-testid="d" locale="en-US" />,
    );
    expect(screen.getByTestId("d")).toHaveClass("ui-delta--down");
  });

  it("forwards ref, merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Delta ref={ref} current={1} previous={0} className="x" data-testid="d" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("d")).toHaveClass("ui-delta", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Delta current={110} previous={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
