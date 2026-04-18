import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { ResizablePanel } from "../ResizablePanel";
import "./ReportBuilderLayout.css";

export interface ReportBuilderLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  palette: ReactNode;
  canvas: ReactNode;
  inspector?: ReactNode;
  toolbar?: ReactNode;
  paletteWidth?: number;
  inspectorWidth?: number;
  minPaletteWidth?: number;
  maxPaletteWidth?: number;
  minInspectorWidth?: number;
  maxInspectorWidth?: number;
  onPaletteResize?: (width: number) => void;
  onInspectorResize?: (width: number) => void;
  paletteLabel?: string;
  canvasLabel?: string;
  inspectorLabel?: string;
  toolbarLabel?: string;
}

export const ReportBuilderLayout = forwardRef<
  HTMLDivElement,
  ReportBuilderLayoutProps
>(function ReportBuilderLayout(
  {
    palette,
    canvas,
    inspector,
    toolbar,
    paletteWidth = 260,
    inspectorWidth = 300,
    minPaletteWidth = 180,
    maxPaletteWidth = 480,
    minInspectorWidth = 220,
    maxInspectorWidth = 520,
    onPaletteResize,
    onInspectorResize,
    paletteLabel = "Palette",
    canvasLabel = "Canvas",
    inspectorLabel = "Inspector",
    toolbarLabel = "Toolbar",
    className,
    ...rest
  },
  ref,
) {
  const [pWidth, setPWidth] = useState(paletteWidth);
  const [iWidth, setIWidth] = useState(inspectorWidth);
  const classes = ["ui-report-builder", className].filter(Boolean).join(" ");

  return (
    <Box
      ref={ref as Ref<HTMLElement>}
      display="flex"
      direction="column"
      className={classes}
      {...rest}
    >
      {toolbar && (
        <Box
          display="flex"
          align="center"
          gap="content"
          padding="content"
          className="ui-report-builder__toolbar"
          aria-label={toolbarLabel}
        >
          {toolbar}
        </Box>
      )}
      <Box display="flex" grow className="ui-report-builder__body">
        <ResizablePanel
          direction="horizontal"
          size={pWidth}
          minSize={minPaletteWidth}
          maxSize={maxPaletteWidth}
          onResize={(s) => {
            setPWidth(s);
            onPaletteResize?.(s);
          }}
          handleLabel="Resize palette panel"
        >
          <aside
            className="ui-report-builder__palette"
            aria-label={paletteLabel}
          >
            {palette}
          </aside>
        </ResizablePanel>
        <section
          className="ui-report-builder__canvas"
          aria-label={canvasLabel}
        >
          {canvas}
        </section>
        {inspector && (
          <ResizablePanel
            direction="horizontal"
            size={iWidth}
            minSize={minInspectorWidth}
            maxSize={maxInspectorWidth}
            onResize={(s) => {
              setIWidth(s);
              onInspectorResize?.(s);
            }}
            handlePosition="start"
            handleLabel="Resize inspector panel"
          >
            <aside
              className="ui-report-builder__inspector"
              aria-label={inspectorLabel}
            >
              {inspector}
            </aside>
          </ResizablePanel>
        )}
      </Box>
    </Box>
  );
});
