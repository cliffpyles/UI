import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Card } from "./Card";

describe("Card", () => {
  // --- Basic rendering ---

  it("renders with body content", () => {
    render(
      <Card>
        <Card.Body>Card content</Card.Body>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders with header, body, and footer", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
        </Card.Header>
        <Card.Body>$42,000</Card.Body>
        <Card.Footer>Updated 5 min ago</Card.Footer>
      </Card>,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$42,000")).toBeInTheDocument();
    expect(screen.getByText("Updated 5 min ago")).toBeInTheDocument();
  });

  // --- Slots are optional ---

  it("renders without header", () => {
    render(
      <Card>
        <Card.Body>Content only</Card.Body>
      </Card>,
    );
    expect(screen.getByText("Content only")).toBeInTheDocument();
  });

  it("renders without footer", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
        </Card.Header>
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.queryByText("footer")).not.toBeInTheDocument();
  });

  it("renders without body", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Header only</Card.Title>
        </Card.Header>
      </Card>,
    );
    expect(screen.getByText("Header only")).toBeInTheDocument();
  });

  // --- Header with actions ---

  it("renders header with title and actions", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <Card.Actions>
            <button>Export</button>
          </Card.Actions>
        </Card.Header>
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  // --- Styling ---

  it("applies ui-card class", () => {
    const { container } = render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(container.firstChild).toHaveClass("ui-card");
  });

  it("title renders as h3", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Heading</Card.Title>
        </Card.Header>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Heading");
  });

  // --- Ref forwarding ---

  it("forwards ref to card root", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-card");
  });

  it("forwards ref to Card.Body", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card>
        <Card.Body ref={ref}>Content</Card.Body>
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("ui-card__body");
  });

  // --- className merging ---

  it("merges custom className on root", () => {
    const { container } = render(
      <Card className="custom">
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(container.firstChild).toHaveClass("ui-card");
    expect(container.firstChild).toHaveClass("custom");
  });

  it("merges custom className on subcomponents", () => {
    render(
      <Card>
        <Card.Header className="hdr-custom">
          <Card.Title className="title-custom">T</Card.Title>
        </Card.Header>
        <Card.Body className="body-custom">B</Card.Body>
        <Card.Footer className="footer-custom">F</Card.Footer>
      </Card>,
    );
    expect(screen.getByText("T").closest(".ui-card__header")).toHaveClass("hdr-custom");
    expect(screen.getByText("T")).toHaveClass("title-custom");
    expect(screen.getByText("B")).toHaveClass("body-custom");
    expect(screen.getByText("F")).toHaveClass("footer-custom");
  });

  // --- Prop spreading ---

  it("spreads additional props to root", () => {
    render(
      <Card data-testid="card" id="card-1">
        <Card.Body>Content</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("id", "card-1");
  });

  // --- Accessibility ---

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Card>
        <Card.Header>
          <Card.Title>Revenue</Card.Title>
          <Card.Actions>
            <button>Export</button>
          </Card.Actions>
        </Card.Header>
        <Card.Body>$42,000</Card.Body>
        <Card.Footer>Updated 5 min ago</Card.Footer>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no accessibility violations with body only", async () => {
    const { container } = render(
      <Card>
        <Card.Body>Simple card</Card.Body>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
