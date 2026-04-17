import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ImportMappingLayout } from "./ImportMappingLayout";

describe("ImportMappingLayout", () => {
  it("renders all slots", () => {
    render(
      <ImportMappingLayout
        upload={<div>upload body</div>}
        mapping={<div>mapping body</div>}
        preview={<div>preview body</div>}
        errors={<div>errors body</div>}
        footer={<button>Import</button>}
      />,
    );
    expect(screen.getByRole("region", { name: "Upload" })).toHaveTextContent(
      "upload body",
    );
    expect(
      screen.getByRole("region", { name: "Column mapping" }),
    ).toHaveTextContent("mapping body");
    expect(screen.getByRole("region", { name: "Preview" })).toHaveTextContent(
      "preview body",
    );
    expect(screen.getByRole("region", { name: "Errors" })).toHaveTextContent(
      "errors body",
    );
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ImportMappingLayout
        ref={ref}
        className="custom"
        mapping={<div>m</div>}
      />,
    );
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ImportMappingLayout mapping={<div>mapping</div>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
