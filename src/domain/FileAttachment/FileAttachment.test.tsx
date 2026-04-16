import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FileAttachment } from "./FileAttachment";

const FILE = { name: "report.pdf", size: 1024, type: "application/pdf" };

describe("FileAttachment", () => {
  it("renders name and size", () => {
    render(<FileAttachment file={FILE} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("fires actions", async () => {
    const user = userEvent.setup();
    const dl = vi.fn();
    const rm = vi.fn();
    render(<FileAttachment file={FILE} onDownload={dl} onRemove={rm} />);
    await user.click(screen.getByRole("button", { name: /Download/ }));
    await user.click(screen.getByRole("button", { name: /Remove/ }));
    expect(dl).toHaveBeenCalled();
    expect(rm).toHaveBeenCalled();
  });

  it("no a11y violations", async () => {
    const { container } = render(<FileAttachment file={FILE} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
