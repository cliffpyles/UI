import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FacetedSearchLayout } from "./FacetedSearchLayout";

describe("FacetedSearchLayout", () => {
  it("renders facets and results regions", () => {
    render(
      <FacetedSearchLayout
        facets={<div>facet list</div>}
        results={<div>result list</div>}
      />,
    );
    expect(
      screen.getByRole("complementary", { name: "Facets" }),
    ).toHaveTextContent("facet list");
    expect(screen.getByRole("main", { name: "Results" })).toHaveTextContent(
      "result list",
    );
  });

  it("renders resultsHeader when provided", () => {
    render(
      <FacetedSearchLayout
        facets={<div>f</div>}
        results={<div>r</div>}
        resultsHeader={<div>42 results</div>}
      />,
    );
    expect(screen.getByText("42 results")).toBeInTheDocument();
  });

  it("fires onFacetsResize when handle is moved", async () => {
    const onFacetsResize = vi.fn();
    render(
      <FacetedSearchLayout
        facets={<div>f</div>}
        results={<div>r</div>}
        onFacetsResize={onFacetsResize}
      />,
    );
    screen.getByRole("separator").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onFacetsResize).toHaveBeenCalled();
  });

  it("merges className and forwards ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FacetedSearchLayout
        ref={ref}
        className="extra"
        facets={<div>f</div>}
        results={<div>r</div>}
      />,
    );
    expect(ref.current?.className).toContain("ui-faceted-search");
    expect(ref.current?.className).toContain("extra");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FacetedSearchLayout facets={<div>f</div>} results={<div>r</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
