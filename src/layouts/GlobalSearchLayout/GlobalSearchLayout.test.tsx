import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { GlobalSearchLayout } from "./GlobalSearchLayout";

const categories = [
  {
    id: "people",
    label: "People",
    items: [<span key="a">Ada Lovelace</span>, <span key="b">Alan Turing</span>],
  },
  {
    id: "docs",
    label: "Docs",
    items: [<span key="c">Design spec</span>],
  },
];

describe("GlobalSearchLayout", () => {
  it("renders search role and input slot", () => {
    render(
      <GlobalSearchLayout
        searchInput={<input aria-label="search" />}
        categories={[]}
      />,
    );
    expect(screen.getByRole("search", { name: "Global search" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "search" })).toBeInTheDocument();
  });

  it("renders category sections and items", () => {
    render(
      <GlobalSearchLayout
        searchInput={<input aria-label="q" />}
        categories={categories}
      />,
    );
    expect(screen.getByRole("region", { name: "People" })).toHaveTextContent(
      "Ada Lovelace",
    );
    expect(screen.getByRole("region", { name: "Docs" })).toHaveTextContent(
      "Design spec",
    );
    expect(screen.getByText("Alan Turing")).toBeInTheDocument();
  });

  it("shows recents when no results", () => {
    render(
      <GlobalSearchLayout
        searchInput={<input aria-label="q" />}
        categories={[]}
        recents={<p>recent searches</p>}
      />,
    );
    expect(screen.getByText("recent searches")).toBeInTheDocument();
  });

  it("shows empty when no results and no recents", () => {
    render(
      <GlobalSearchLayout
        searchInput={<input aria-label="q" />}
        categories={[]}
        empty={<p>no matches</p>}
      />,
    );
    expect(screen.getByText("no matches")).toBeInTheDocument();
  });

  it("forwards input interactions", async () => {
    const onChange = vi.fn();
    render(
      <GlobalSearchLayout
        searchInput={<input aria-label="q" onChange={onChange} />}
        categories={[]}
      />,
    );
    await userEvent.type(screen.getByRole("textbox", { name: "q" }), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <GlobalSearchLayout
        ref={ref}
        className="extra"
        searchInput={<input aria-label="q" />}
        categories={[]}
      />,
    );
    expect(ref.current?.className).toContain("ui-global-search");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GlobalSearchLayout
        searchInput={<input aria-label="q" />}
        categories={categories}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
