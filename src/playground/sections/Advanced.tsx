import { useState } from "react";
import { Text } from "../../primitives/Text";
import { Box } from "../../primitives/Box";
import { Button } from "../../components/Button";
import {
  useKeyboardShortcut,
  KeyboardShortcutCheatSheet,
  ValueChangeIndicator,
  useStaleness,
  usePolling,
  useOptimisticUpdate,
  Tour,
  DragDropProvider,
  Draggable,
  Droppable,
  type DragEndEvent,
} from "../../features";
import { Demo } from "../components/Demo";

export default function Advanced() {
  const [count, setCount] = useState(100);
  const [tourOpen, setTourOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [lastDragEvent, setLastDragEvent] = useState<string>("");

  useKeyboardShortcut("mod+k", () => alert("Search (mod+k)"), {
    description: "Search",
    category: "Navigation",
  });
  useKeyboardShortcut("mod+e", () => alert("Export (mod+e)"), {
    description: "Export data",
    category: "Actions",
  });
  useKeyboardShortcut("mod+/", () => setCheatSheetOpen(true), {
    description: "Show shortcuts",
    category: "Help",
  });

  const [staleDate] = useState(() => new Date(Date.now() - 8 * 60_000));
  const { freshness, age } = useStaleness(staleDate, { staleThreshold: 5 * 60_000 });

  const { data: polled } = usePolling(async () => Math.floor(Math.random() * 1000), {
    interval: 3000,
  });

  const optimistic = useOptimisticUpdate<boolean>(false, async (next) => {
    await new Promise((r) => setTimeout(r, 400));
    return next;
  });

  const handleDragEnd = (e: DragEndEvent) => {
    setLastDragEvent(`Moved ${e.activeId} from ${e.sourceId} to ${e.overId}`);
  };

  return (
    <section>
      <Text as="h2" size="xl" weight="semibold">Advanced Features (Phase 8)</Text>

      <Demo title="Keyboard Shortcuts" description="Global shortcuts with a cheat sheet dialog.">
        <Text>
          Try: {navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"} for search,{" "}
          {navigator.platform.includes("Mac") ? "⌘E" : "Ctrl+E"} for export, or <kbd>?</kbd> for the cheat sheet.
        </Text>
        <Button onClick={() => setCheatSheetOpen(true)}>Open cheat sheet</Button>
        <KeyboardShortcutCheatSheet open={cheatSheetOpen} onOpenChange={setCheatSheetOpen} />
      </Demo>

      <Demo title="Value Change Animation" description="Animated numeric change with direction and highlight.">
        <Box style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
          <ValueChangeIndicator value={count} direction highlight>
            {count.toLocaleString()}
          </ValueChangeIndicator>
          <Button variant="secondary" onClick={() => setCount((c) => c + Math.floor(Math.random() * 50))}>
            Increase
          </Button>
          <Button variant="secondary" onClick={() => setCount((c) => c - Math.floor(Math.random() * 50))}>
            Decrease
          </Button>
        </Box>
      </Demo>

      <Demo title="Staleness Indicator" description="Reports data age against a staleness threshold.">
        <Text>
          Data age: {Math.floor(age / 1000)}s — freshness: <strong>{freshness}</strong>
        </Text>
      </Demo>

      <Demo title="Polling" description="Value refreshed on a fixed interval via a hook.">
        <Text>
          Live value (refreshes every 3s): <strong>{polled ?? "…"}</strong>
        </Text>
      </Demo>

      <Demo title="Optimistic Update" description="UI updates immediately while the async mutation settles.">
        <Box style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
          <Text>Toggle: {optimistic.value ? "ON" : "OFF"}</Text>
          <Button variant="primary" loading={optimistic.isPending} onClick={() => optimistic.update(!optimistic.value)}>
            Toggle
          </Button>
        </Box>
      </Demo>

      <Demo title="Tour" description="Step-through product tour anchored to target elements.">
        <Box style={{ display: "flex", gap: "var(--spacing-3)" }}>
          <Button id="tour-step-1" onClick={() => setTourOpen(true)}>
            Start tour
          </Button>
          <Button id="tour-step-2" variant="secondary">
            Secondary action
          </Button>
          <Button id="tour-step-3" variant="ghost">
            Tertiary action
          </Button>
        </Box>
        {tourOpen && (
          <Tour
            id="demo-tour"
            persist={false}
            steps={[
              { target: "#tour-step-1", title: "Start here", content: "This launches the tour." },
              { target: "#tour-step-2", title: "Secondary", content: "Related actions live here." },
              { target: "#tour-step-3", title: "Tertiary", content: "Less-used actions." },
            ]}
            onComplete={() => setTourOpen(false)}
            onSkip={() => setTourOpen(false)}
          />
        )}
      </Demo>

      <Demo title="Drag and Drop" description="Draggable cards across droppable columns.">
        <Text>{lastDragEvent || "Drag a card between columns."}</Text>
        <DragDropProvider onDragEnd={handleDragEnd}>
          <Box style={{ display: "flex", gap: "var(--spacing-4)", marginTop: "var(--spacing-3)" }}>
            {["col-a", "col-b"].map((col) => (
              <Droppable key={col} id={col}>
                <Box
                  style={{
                    padding: "var(--spacing-3)",
                    minWidth: 200,
                    minHeight: 160,
                    border: "1px solid var(--color-border-default)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-2)",
                  }}
                >
                  <Text style={{ fontWeight: "var(--font-weight-semibold)" }}>{col}</Text>
                  {["card-1", "card-2"].map((card) => (
                    <Draggable key={`${col}-${card}`} id={`${col}-${card}`}>
                      <Box
                        style={{
                          padding: "var(--spacing-2)",
                          background: "var(--color-background-surface-raised)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <Text>{card}</Text>
                      </Box>
                    </Draggable>
                  ))}
                </Box>
              </Droppable>
            ))}
          </Box>
        </DragDropProvider>
      </Demo>
    </section>
  );
}
