import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DataSourceSetupLayout } from "./DataSourceSetupLayout";

describe("DataSourceSetupLayout", () => {
  it("renders required credentials slot", () => {
    render(
      <DataSourceSetupLayout
        credentials={<input aria-label="API key" />}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Credentials" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("API key")).toBeInTheDocument();
  });

  it("renders optional slots when provided", () => {
    render(
      <DataSourceSetupLayout
        credentials={<div>creds</div>}
        testConnection={<button>Test</button>}
        schemaPreview={<div>schema</div>}
        syncSettings={<div>sync</div>}
        footer={<button>Save</button>}
      />,
    );
    expect(
      screen.getByRole("region", { name: "Test connection" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Schema preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Sync settings" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("omits optional sections when not provided", () => {
    render(<DataSourceSetupLayout credentials={<div>c</div>} />);
    expect(
      screen.queryByRole("region", { name: "Schema preview" }),
    ).not.toBeInTheDocument();
  });

  it("fires test connection handler", async () => {
    const onTest = vi.fn();
    render(
      <DataSourceSetupLayout
        credentials={<div>c</div>}
        testConnection={<button onClick={onTest}>Test</button>}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Test" }));
    expect(onTest).toHaveBeenCalledTimes(1);
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DataSourceSetupLayout
        ref={ref}
        credentials={<div>c</div>}
        className="custom"
        data-testid="ds"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("ds")).toHaveClass(
      "ui-data-source-setup",
      "custom",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DataSourceSetupLayout
        credentials={<label>Key<input /></label>}
        testConnection={<button>Test</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
