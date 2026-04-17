import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { QueryBuilderLayout } from "./QueryBuilderLayout";

describe("QueryBuilderLayout", () => {
  it("renders expression slot", () => {
    render(
      <QueryBuilderLayout expression={<div>builder here</div>} />,
    );
    expect(
      screen.getByRole("region", { name: "Query expression" }),
    ).toHaveTextContent("builder here");
  });

  it("renders preview and actions when provided", () => {
    render(
      <QueryBuilderLayout
        expression={<div>e</div>}
        preview={<code>SELECT *</code>}
        actions={<button>Run</button>}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Query preview" }),
    ).toHaveTextContent("SELECT *");
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("omits preview when not provided", () => {
    render(<QueryBuilderLayout expression={<div>e</div>} />);
    expect(screen.queryByRole("region", { name: "Query preview" })).toBeNull();
  });

  it("forwards action clicks", async () => {
    const onRun = vi.fn();
    render(
      <QueryBuilderLayout
        expression={<div>e</div>}
        actions={<button onClick={onRun}>Run</button>}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Run" }));
    expect(onRun).toHaveBeenCalledTimes(1);
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <QueryBuilderLayout
        ref={ref}
        className="extra"
        expression={<div>e</div>}
      />,
    );
    expect(ref.current?.className).toContain("ui-query-builder");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <QueryBuilderLayout
        expression={<div>e</div>}
        preview={<code>q</code>}
        actions={<button>Run</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
