import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { OrgSwitcher } from "./OrgSwitcher";

const ORGS = [
  { id: "1", name: "Acme" },
  { id: "2", name: "Globex" },
];

describe("OrgSwitcher", () => {
  it("renders current org", () => {
    render(<OrgSwitcher orgs={ORGS} currentOrg="1" onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toHaveValue("1");
  });

  it("fires onChange", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<OrgSwitcher orgs={ORGS} currentOrg="1" onChange={fn} />);
    await user.selectOptions(screen.getByRole("combobox"), "2");
    expect(fn).toHaveBeenCalledWith("2");
  });

  it("forwards ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <OrgSwitcher
        ref={ref}
        orgs={ORGS}
        currentOrg="1"
        onChange={() => {}}
        className="x"
        data-testid="o"
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("o")).toHaveClass("ui-org-switcher", "x");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <OrgSwitcher orgs={ORGS} currentOrg="1" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
