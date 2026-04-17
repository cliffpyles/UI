import { describe, it, expect } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DataGridLayout } from "./DataGridLayout";

describe("DataGridLayout", () => {
  it("renders toolbar, filters, and body", () => {
    render(
      <DataGridLayout
        toolbar={<button>Add</button>}
        filters={<span>Filter bar</span>}
      >
        <table>
          <tbody>
            <tr>
              <td>cell</td>
            </tr>
          </tbody>
        </table>
      </DataGridLayout>,
    );
    expect(screen.getByRole("region", { name: "Data grid" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByText("Filter bar")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DataGridLayout ref={ref} className="extra">
        <div>body</div>
      </DataGridLayout>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("ui-data-grid-layout");
    expect(ref.current?.className).toContain("extra");
  });

  it("omits toolbar and filters when not provided", () => {
    const { container } = render(
      <DataGridLayout>
        <div>body</div>
      </DataGridLayout>,
    );
    expect(container.querySelector(".ui-data-grid-layout__toolbar")).toBeNull();
    expect(container.querySelector(".ui-data-grid-layout__filters")).toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DataGridLayout toolbar={<button>Add</button>}>
        <div>body</div>
      </DataGridLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
