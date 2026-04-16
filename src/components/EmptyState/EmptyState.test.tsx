import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No items yet" />);
    expect(
      screen.getByRole("heading", { name: "No items yet" }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <EmptyState title="No items" description="Create your first item." />,
    );
    expect(screen.getByText("Create your first item.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="No items" />);
    expect(
      container.querySelector(".ui-empty-state__description"),
    ).not.toBeInTheDocument();
  });

  it("renders action element", () => {
    render(
      <EmptyState title="No items" action={<button>Create</button>} />,
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("does not render action when not provided", () => {
    const { container } = render(<EmptyState title="No items" />);
    expect(
      container.querySelector(".ui-empty-state__action"),
    ).not.toBeInTheDocument();
  });

  it("renders default icon for no-data variant", () => {
    const { container } = render(<EmptyState title="No items" variant="no-data" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders default icon for no-results variant", () => {
    const { container } = render(
      <EmptyState title="No results" variant="no-results" />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders default icon for error variant", () => {
    const { container } = render(
      <EmptyState title="Error" variant="error" />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders default icon for first-use variant", () => {
    const { container } = render(
      <EmptyState title="Get started" variant="first-use" />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders default icon for restricted variant", () => {
    const { container } = render(
      <EmptyState title="Restricted" variant="restricted" />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom icon when provided", () => {
    render(
      <EmptyState
        title="Custom"
        icon={<span data-testid="custom-icon">🎉</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className", () => {
    const { container } = render(
      <EmptyState title="Test" className="custom-class" />,
    );
    expect(container.firstElementChild).toHaveClass(
      "ui-empty-state",
      "custom-class",
    );
  });

  it("spreads additional props", () => {
    render(<EmptyState title="Test" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmptyState
        title="No items yet"
        description="Create your first item to get started."
        action={<button>Create Item</button>}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
