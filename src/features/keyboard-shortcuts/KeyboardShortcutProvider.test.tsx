import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "vitest-axe";
import { KeyboardShortcutProvider } from "./KeyboardShortcutProvider";
import { useKeyboardShortcut } from "./useKeyboardShortcut";
import { KeyboardShortcutCheatSheet } from "./KeyboardShortcutCheatSheet";
import { normalizeCombo, formatComboLabel } from "./normalizeCombo";

function TestShortcut({ combo, onFire, description = "Test", category = "General" }: {
  combo: string;
  onFire: () => void;
  description?: string;
  category?: string;
}) {
  useKeyboardShortcut(combo, onFire, { description, category });
  return <div>probe</div>;
}

describe("normalizeCombo", () => {
  it("maps mod to meta on mac and ctrl on others", () => {
    expect(normalizeCombo("mod+k", true)).toBe("meta+k");
    expect(normalizeCombo("mod+k", false)).toBe("ctrl+k");
  });

  it("sorts modifiers deterministically", () => {
    expect(normalizeCombo("shift+ctrl+s", false)).toBe(normalizeCombo("ctrl+shift+s", false));
  });

  it("formats combos per platform", () => {
    expect(formatComboLabel("meta+k", true)).toBe("⌘K");
    expect(formatComboLabel("ctrl+k", false)).toBe("Ctrl+K");
  });
});

describe("KeyboardShortcutProvider", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fires handler on matching key press", () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+k" onFire={handler} />
      </KeyboardShortcutProvider>,
    );
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not fire when focus is in an input", () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+k" onFire={handler} />
        <input data-testid="field" />
      </KeyboardShortcutProvider>,
    );
    const input = screen.getByTestId("field");
    input.focus();
    fireEvent.keyDown(input, { key: "k", ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it("warns on conflict in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+s" onFire={() => {}} description="Save" />
        <TestShortcut combo="ctrl+s" onFire={() => {}} description="Save As" />
      </KeyboardShortcutProvider>,
    );
    expect(warn).toHaveBeenCalled();
  });

  it("cleans up on unmount", () => {
    const handler = vi.fn();
    const { unmount } = render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+k" onFire={handler} />
      </KeyboardShortcutProvider>,
    );
    unmount();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("KeyboardShortcutCheatSheet", () => {
  it("opens on ? key and lists shortcuts by category", async () => {
    render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+k" onFire={() => {}} description="Search" category="Navigation" />
        <TestShortcut combo="ctrl+e" onFire={() => {}} description="Export" category="Actions" />
        <KeyboardShortcutCheatSheet />
      </KeyboardShortcutProvider>,
    );
    act(() => {
      fireEvent.keyDown(window, { key: "?" });
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("is accessible", async () => {
    const { container } = render(
      <KeyboardShortcutProvider>
        <TestShortcut combo="ctrl+k" onFire={() => {}} description="Search" category="Navigation" />
        <KeyboardShortcutCheatSheet open />
      </KeyboardShortcutProvider>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows empty state when no shortcuts registered", () => {
    render(
      <KeyboardShortcutProvider>
        <KeyboardShortcutCheatSheet open />
      </KeyboardShortcutProvider>,
    );
    expect(screen.getByText("No keyboard shortcuts registered.")).toBeInTheDocument();
  });
});
