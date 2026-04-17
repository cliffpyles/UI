import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ComparisonLayout } from "./ComparisonLayout";

interface Plan {
  id: string;
  title: string;
  price: number;
  content?: string;
}

const entities: Plan[] = [
  { id: "free", title: "Free", price: 0, content: "Starter" },
  { id: "pro", title: "Pro", price: 10 },
];

const fields = [
  { key: "price", label: "Price", render: (e: Plan) => `$${e.price}` },
  { key: "name", label: "Name", render: (e: Plan) => e.title },
];

describe("ComparisonLayout", () => {
  it("renders entities, fields, and toolbar", () => {
    render(
      <ComparisonLayout
        entities={entities}
        fields={fields}
        toolbar={<button>Compare</button>}
      />,
    );
    expect(screen.getByRole("region", { name: "Comparison" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compare" })).toBeInTheDocument();
    expect(screen.getAllByText("Free")).toHaveLength(2);
    expect(screen.getAllByText("Pro")).toHaveLength(2);
    expect(screen.getByText("Starter")).toBeInTheDocument();
  });

  it("invokes field renderer for each entity", () => {
    render(<ComparisonLayout entities={entities} fields={fields} />);
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });

  it("renders field labels as row headers", () => {
    render(<ComparisonLayout entities={entities} fields={fields} />);
    expect(screen.getByRole("rowheader", { name: "Price" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Name" })).toBeInTheDocument();
  });

  it("renders empty cells when field has no render", () => {
    const { container } = render(
      <ComparisonLayout
        entities={entities}
        fields={[{ key: "empty", label: "Empty" }]}
      />,
    );
    const cells = container.querySelectorAll('.ui-comparison-layout__cell:not(.ui-comparison-layout__cell--label):not(.ui-comparison-layout__cell--header)');
    expect(cells).toHaveLength(2);
    cells.forEach((c) => expect(c.textContent).toBe(""));
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ComparisonLayout
        ref={ref}
        className="extra"
        entities={entities}
        fields={fields}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-comparison-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ComparisonLayout entities={entities} fields={fields} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
