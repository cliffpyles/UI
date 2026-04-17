import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ReportViewerLayout } from "./ReportViewerLayout";

describe("ReportViewerLayout", () => {
  it("renders header, content, and footer slots", () => {
    render(
      <ReportViewerLayout
        header={<h1>Q1 Report</h1>}
        content={<p>body</p>}
        footer={<span>footer text</span>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Q1 Report" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Report content" })).toHaveTextContent(
      "body",
    );
    expect(screen.getByText("footer text")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ReportViewerLayout
        ref={ref}
        className="custom"
        header={<h1>t</h1>}
        content={<p>c</p>}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(container.firstChild).toHaveClass("ui-report-viewer", "custom");
  });

  it("calls onPageChange when Next is clicked", async () => {
    const onPageChange = vi.fn();
    render(
      <ReportViewerLayout
        header={<h1>t</h1>}
        content={<p>c</p>}
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables Previous on first page", () => {
    render(
      <ReportViewerLayout
        header={<h1>t</h1>}
        content={<p>c</p>}
        currentPage={1}
        totalPages={5}
      />,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ReportViewerLayout
        header={<h1>t</h1>}
        content={<p>c</p>}
        currentPage={1}
        totalPages={3}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
