import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { LogExplorerLayout } from "./LogExplorerLayout";

describe("LogExplorerLayout", () => {
  it("renders search bar, logs, and optional slots", () => {
    render(
      <LogExplorerLayout
        searchBar={<input aria-label="query" />}
        logs={<div>log line 1</div>}
        timeWindow={<span>Last 15m</span>}
        fields={<ul><li>host</li></ul>}
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Log stream" })).toHaveTextContent(
      "log line 1",
    );
    expect(
      screen.getByRole("complementary", { name: "Fields" }),
    ).toHaveTextContent("host");
    expect(screen.getByText("Last 15m")).toBeInTheDocument();
  });

  it("omits fields sidebar when not provided", () => {
    render(
      <LogExplorerLayout
        searchBar={<input aria-label="q" />}
        logs={<div>x</div>}
      />,
    );
    expect(
      screen.queryByRole("complementary", { name: "Fields" }),
    ).not.toBeInTheDocument();
  });

  it("keeps search bar interactive", async () => {
    render(
      <LogExplorerLayout
        searchBar={<input aria-label="query" />}
        logs={<div>x</div>}
      />,
    );
    const input = screen.getByLabelText("query");
    await userEvent.type(input, "error");
    expect(input).toHaveValue("error");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <LogExplorerLayout
        searchBar={<input aria-label="q" />}
        logs={<div>x</div>}
        ref={ref}
        className="custom"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("ui-log-explorer", "custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LogExplorerLayout
        searchBar={<input aria-label="q" />}
        logs={<div>x</div>}
        fields={<ul><li>host</li></ul>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
