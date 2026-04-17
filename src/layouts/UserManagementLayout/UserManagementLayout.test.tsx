import { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import { axe } from "vitest-axe";
import { UserManagementLayout } from "./UserManagementLayout";

describe("UserManagementLayout", () => {
  it("renders the table region", () => {
    render(<UserManagementLayout table={<table><tbody><tr><td>user</td></tr></tbody></table>} />);
    expect(screen.getByRole("region", { name: "User management" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "user" })).toBeInTheDocument();
  });

  it("renders toolbar and footer slots", () => {
    render(
      <UserManagementLayout
        toolbar={<button>Invite</button>}
        table={<div>table</div>}
        footer={<div>page 1</div>}
      />,
    );
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
    expect(screen.getByText("page 1")).toBeInTheDocument();
  });

  it("shows bulk actions when selectedCount > 0", () => {
    render(
      <UserManagementLayout
        table={<div>t</div>}
        selectedCount={3}
        bulkActions={<button>Delete</button>}
      />,
    );
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("hides bulk actions when selectedCount is 0", () => {
    render(
      <UserManagementLayout
        table={<div>t</div>}
        bulkActions={<button>Delete</button>}
      />,
    );
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <UserManagementLayout
        ref={ref}
        className="custom"
        table={<div>t</div>}
      />,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.className).toContain("ui-user-management");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <UserManagementLayout
        toolbar={<button>Invite</button>}
        table={<table><tbody><tr><td>u</td></tr></tbody></table>}
        selectedCount={2}
        bulkActions={<button>Remove</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
