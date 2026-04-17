import { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FullPageFormLayout } from "./FullPageFormLayout";

describe("FullPageFormLayout", () => {
  it("renders header, body, footer, and sidebar slots", () => {
    render(
      <FullPageFormLayout
        header={<h1>Edit user</h1>}
        footer={<button type="submit">Save</button>}
        sidebar={<p>help text</p>}
      >
        <label>
          Name
          <input />
        </label>
      </FullPageFormLayout>,
    );
    expect(screen.getByRole("heading", { name: "Edit user" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Form help" })).toHaveTextContent(
      "help text",
    );
  });

  it("shows dirty indicator when isDirty", () => {
    render(
      <FullPageFormLayout
        header={<h1>Title</h1>}
        footer={<button type="submit">Save</button>}
        isDirty
      >
        <input />
      </FullPageFormLayout>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");
  });

  it("fires onSubmit", async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(
      <FullPageFormLayout
        onSubmit={onSubmit}
        footer={<button type="submit">Save</button>}
      >
        <input name="x" />
      </FullPageFormLayout>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLFormElement>();
    render(
      <FullPageFormLayout
        ref={ref}
        className="custom"
        footer={<button type="submit">s</button>}
      >
        <input />
      </FullPageFormLayout>,
    );
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(ref.current).toHaveClass("custom");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <FullPageFormLayout
        header={<h1>h</h1>}
        footer={<button type="submit">Save</button>}
      >
        <label>
          Name
          <input />
        </label>
      </FullPageFormLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
