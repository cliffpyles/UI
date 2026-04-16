import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { FilePreview } from "./FilePreview";

describe("FilePreview", () => {
  it("renders image", () => {
    render(
      <FilePreview
        file={{ name: "a.png", size: 1, type: "image/png", url: "data:image/png;base64,x" }}
      />,
    );
    expect(screen.getByAltText("a.png")).toBeInTheDocument();
  });

  it("renders fallback for unknown type", () => {
    render(<FilePreview file={{ name: "a.bin", size: 100, type: "application/octet-stream" }} />);
    expect(screen.getByText(/No preview available/)).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <FilePreview file={{ name: "a.bin", size: 10 }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
