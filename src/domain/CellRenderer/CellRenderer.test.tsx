import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CellRenderer } from "./CellRenderer";

describe("CellRenderer", () => {
  it("renders text", () => {
    render(<CellRenderer type="text" value="hello" />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders em-dash for null", () => {
    render(<CellRenderer type="number" value={null} />);
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("renders currency", () => {
    render(<CellRenderer type="currency" value={50} options={{ currency: "USD" }} />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it("renders boolean", () => {
    render(<CellRenderer type="boolean" value={true} />);
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<CellRenderer type="number" value={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
