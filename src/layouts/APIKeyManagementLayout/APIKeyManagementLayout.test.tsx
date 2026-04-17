import { createRef, useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { APIKeyManagementLayout } from "./APIKeyManagementLayout";

describe("APIKeyManagementLayout", () => {
  it("renders keys table", () => {
    render(
      <APIKeyManagementLayout
        keys={<table><tbody><tr><td>key 1</td></tr></tbody></table>}
      />,
    );
    expect(screen.getByRole("region", { name: "API key management" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "key 1" })).toBeInTheDocument();
  });

  it("hides createForm when showCreate is false", () => {
    render(
      <APIKeyManagementLayout
        keys={<div>k</div>}
        createForm={<form aria-label="new"><input /></form>}
      />,
    );
    expect(
      screen.queryByRole("group", { name: "Create API key" }),
    ).not.toBeInTheDocument();
  });

  it("shows createForm when showCreate toggles to true", async () => {
    function Wrapper() {
      const [show, setShow] = useState(false);
      return (
        <APIKeyManagementLayout
          toolbar={<button onClick={() => setShow(true)}>New key</button>}
          keys={<div>k</div>}
          createForm={<div>form body</div>}
          showCreate={show}
        />
      );
    }
    render(<Wrapper />);
    expect(screen.queryByText("form body")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "New key" }));
    expect(screen.getByRole("group", { name: "Create API key" })).toBeInTheDocument();
    expect(screen.getByText("form body")).toBeInTheDocument();
  });

  it("renders toolbar and footer slots", () => {
    render(
      <APIKeyManagementLayout
        toolbar={<button>Create</button>}
        keys={<div>k</div>}
        footer={<div>footer</div>}
      />,
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByText("footer")).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <APIKeyManagementLayout
        ref={ref}
        className="custom"
        keys={<div>k</div>}
      />,
    );
    expect(ref.current?.className).toContain("ui-api-keys");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <APIKeyManagementLayout
        toolbar={<button>Create</button>}
        keys={<table><tbody><tr><td>k</td></tr></tbody></table>}
        createForm={<div>form</div>}
        showCreate
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
