import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { PermissionMatrixLayout } from "./PermissionMatrixLayout";

const roles = [
  { id: "admin", label: "Admin" },
  { id: "member", label: "Member" },
];

const resources = [
  { id: "billing", label: "Billing" },
  { id: "users", label: "Users", actions: ["read", "write"] },
];

describe("PermissionMatrixLayout", () => {
  it("renders role and resource headers", () => {
    render(
      <PermissionMatrixLayout
        roles={roles}
        resources={resources}
        renderCell={() => <input type="checkbox" aria-label="allow" />}
      />,
    );
    expect(screen.getByRole("columnheader", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Member" })).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("read")).toBeInTheDocument();
    expect(screen.getByText("write")).toBeInTheDocument();
  });

  it("invokes renderCell with role, resource, and action", async () => {
    const renderCell = vi.fn(
      (role: { id: string }, resource: { id: string }, action?: string) =>
        `${role.id}:${resource.id}${action ? `:${action}` : ""}`,
    );
    render(
      <PermissionMatrixLayout
        roles={roles}
        resources={resources}
        renderCell={renderCell}
      />,
    );
    expect(renderCell).toHaveBeenCalled();
    expect(screen.getByText("admin:billing")).toBeInTheDocument();
    expect(screen.getByText("admin:users:read")).toBeInTheDocument();
  });

  it("triggers interaction in rendered cell", async () => {
    const onChange = vi.fn();
    render(
      <PermissionMatrixLayout
        roles={roles}
        resources={[{ id: "billing", label: "Billing" }]}
        renderCell={(role) => (
          <input
            type="checkbox"
            aria-label={`allow-${role.id}`}
            onChange={onChange}
          />
        )}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "allow-admin" }));
    expect(onChange).toHaveBeenCalled();
  });

  it("renders toolbar slot", () => {
    render(
      <PermissionMatrixLayout
        roles={roles}
        resources={resources}
        renderCell={() => null}
        toolbar={<button>Save</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PermissionMatrixLayout
        ref={ref}
        className="custom"
        roles={roles}
        resources={resources}
        renderCell={() => null}
      />,
    );
    expect(ref.current?.className).toContain("ui-permission-matrix");
    expect(ref.current?.className).toContain("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <PermissionMatrixLayout
        roles={roles}
        resources={resources}
        renderCell={(role, resource, action) => (
          <input
            type="checkbox"
            aria-label={`${role.id}-${resource.id}-${action ?? "all"}`}
          />
        )}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
