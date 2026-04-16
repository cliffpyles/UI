import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { FileUploader } from "./FileUploader";

describe("FileUploader", () => {
  it("renders drop zone", () => {
    render(<FileUploader onUpload={() => {}} />);
    expect(screen.getByText(/Drop files/)).toBeInTheDocument();
  });

  it("uploads files via input", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<FileUploader onUpload={fn} />);
    const file = new File(["x"], "test.txt", { type: "text/plain" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    expect(fn).toHaveBeenCalledWith([file]);
  });

  it("rejects oversized file", async () => {
    const user = userEvent.setup();
    const fn = vi.fn();
    render(<FileUploader onUpload={fn} maxSize={5} />);
    const file = new File(["hello world"], "big.txt", { type: "text/plain" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    expect(fn).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<FileUploader onUpload={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
