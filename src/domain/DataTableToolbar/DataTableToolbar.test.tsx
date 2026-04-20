import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { DataTableToolbar } from "./DataTableToolbar";
import { FilterChip } from "../FilterChip";
import { Button } from "../../components/Button";
import { Menu } from "../../components/Menu";

describe("DataTableToolbar", () => {
  it("renders search input from slot", () => {
    render(
      <DataTableToolbar
        search={{ value: "hello", onChange: () => {}, placeholder: "Search invoices" }}
      />,
    );
    expect(screen.getByPlaceholderText("Search invoices")).toBeInTheDocument();
  });

  it("renders filter chips in order", () => {
    render(
      <DataTableToolbar
        filters={
          <>
            <FilterChip field="region" value="us" />
            <FilterChip field="status" value="active" />
          </>
        }
      />,
    );
    expect(screen.getByText("region")).toBeInTheDocument();
    expect(screen.getByText("status")).toBeInTheDocument();
  });

  it("renders primary and secondary actions", () => {
    render(
      <DataTableToolbar
        primaryActions={<Button variant="primary">New</Button>}
        secondaryActions={<Button variant="ghost">Export</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("opens a Menu from overflow actions", async () => {
    const user = userEvent.setup();
    render(
      <DataTableToolbar
        overflowActions={<Menu.Item>Archive</Menu.Item>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(screen.getByText("Archive")).toBeInTheDocument();
  });

  it("has toolbar role with aria-label", () => {
    render(<DataTableToolbar />);
    expect(screen.getByRole("toolbar")).toHaveAttribute(
      "aria-label",
      "Table toolbar",
    );
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DataTableToolbar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <DataTableToolbar
        search={{ value: "", onChange: () => {} }}
        filters={<FilterChip field="region" value="us" />}
        secondaryActions={<Button variant="ghost">Export</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
