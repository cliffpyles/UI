import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { InlineMessage } from "./InlineMessage";

describe("InlineMessage", () => {
  it("renders info by default", () => {
    render(<InlineMessage>Info message</InlineMessage>);
    expect(screen.getByRole("status")).toHaveTextContent("Info message");
  });

  it("uses alert role for error/warning", () => {
    render(<InlineMessage variant="error">fail</InlineMessage>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<InlineMessage variant="warning" title="Heads up">body</InlineMessage>);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<InlineMessage ref={ref} className="x" data-testid="m">hi</InlineMessage>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("m")).toHaveClass("ui-inline-message", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(<InlineMessage variant="success">ok</InlineMessage>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
