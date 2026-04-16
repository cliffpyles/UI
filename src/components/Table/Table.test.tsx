import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Table } from "./Table";

function renderBasicTable() {
  return render(
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head numeric>Revenue</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Acme</Table.Cell>
          <Table.Cell numeric>$1,234</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
}

describe("Table", () => {
  it("renders semantic HTML structure", () => {
    const { container } = renderBasicTable();
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(container.querySelector("thead")).toBeInTheDocument();
    expect(container.querySelector("tbody")).toBeInTheDocument();
    expect(container.querySelector("th")).toBeInTheDocument();
    expect(container.querySelector("td")).toBeInTheDocument();
  });

  it("renders th with scope='col'", () => {
    renderBasicTable();
    const headers = screen.getAllByRole("columnheader");
    headers.forEach((h) => expect(h).toHaveAttribute("scope", "col"));
  });

  it("renders numeric cells with correct class", () => {
    const { container } = renderBasicTable();
    const numericCell = container.querySelector(".ui-table__cell--numeric");
    expect(numericCell).toBeInTheDocument();
    expect(numericCell).toHaveTextContent("$1,234");
  });

  it("renders numeric header with correct class", () => {
    const { container } = renderBasicTable();
    const numericHead = container.querySelector(".ui-table__head--numeric");
    expect(numericHead).toBeInTheDocument();
    expect(numericHead).toHaveTextContent("Revenue");
  });

  describe("sorting", () => {
    it("renders sort indicator on sortable column", () => {
      const { container } = render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable>Name</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(
        container.querySelector(".ui-table__sort-icon"),
      ).toBeInTheDocument();
    });

    it("sets aria-sort='ascending' when sorted asc", () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable sorted="asc">
                Name
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByRole("columnheader")).toHaveAttribute(
        "aria-sort",
        "ascending",
      );
    });

    it("sets aria-sort='descending' when sorted desc", () => {
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable sorted="desc">
                Name
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      expect(screen.getByRole("columnheader")).toHaveAttribute(
        "aria-sort",
        "descending",
      );
    });

    it("fires onSort on header click", async () => {
      const user = userEvent.setup();
      const handleSort = vi.fn();
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable onSort={handleSort}>
                Name
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      await user.click(screen.getByRole("columnheader"));
      expect(handleSort).toHaveBeenCalledTimes(1);
    });

    it("fires onSort on Enter key", async () => {
      const user = userEvent.setup();
      const handleSort = vi.fn();
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable onSort={handleSort}>
                Name
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      screen.getByRole("columnheader").focus();
      await user.keyboard("{Enter}");
      expect(handleSort).toHaveBeenCalledTimes(1);
    });

    it("fires onSort on Space key", async () => {
      const user = userEvent.setup();
      const handleSort = vi.fn();
      render(
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head sortable onSort={handleSort}>
                Name
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );
      screen.getByRole("columnheader").focus();
      await user.keyboard(" ");
      expect(handleSort).toHaveBeenCalledTimes(1);
    });
  });

  it("applies sticky class on header", () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head sticky>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(
      container.querySelector(".ui-table__head--sticky"),
    ).toBeInTheDocument();
  });

  it("renders truncated cells", () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell truncate>Very long content</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(
      container.querySelector(".ui-table__cell--truncate"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".ui-table__cell-truncate"),
    ).toBeInTheDocument();
  });

  it("renders footer", () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>1 item</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>,
    );
    expect(container.querySelector("tfoot")).toBeInTheDocument();
    expect(screen.getByText("1 item")).toBeInTheDocument();
  });

  it("supports colSpan on cells", () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>A</Table.Head>
            <Table.Head>B</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2}>Spanning cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const cell = container.querySelector("td");
    expect(cell).toHaveAttribute("colspan", "2");
  });

  it("supports width on header", () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head width={200}>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByRole("columnheader")).toHaveStyle({ width: "200px" });
  });

  it("forwards ref on Table root", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("merges className on Table root", () => {
    const { container } = render(
      <Table className="custom">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.querySelector("table")).toHaveClass(
      "ui-table",
      "custom",
    );
  });

  it("forwards ref on Row", () => {
    const ref = createRef<HTMLTableRowElement>();
    render(
      <Table>
        <Table.Body>
          <Table.Row ref={ref}>
            <Table.Cell>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
  });

  it("forwards ref on Cell", () => {
    const ref = createRef<HTMLTableCellElement>();
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell ref={ref}>Test</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderBasicTable();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with sorting", async () => {
    const { container } = render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head sortable sorted="asc" onSort={() => {}}>
              Name
            </Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Acme</Table.Cell>
            <Table.Cell>Active</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
