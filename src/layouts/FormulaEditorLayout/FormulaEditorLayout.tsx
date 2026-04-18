import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Box } from "../../primitives/Box";
import "./FormulaEditorLayout.css";

export interface FormulaEditorLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  editor: ReactNode;
  suggestions?: ReactNode;
  preview?: ReactNode;
  toolbar?: ReactNode;
}

export const FormulaEditorLayout = forwardRef<
  HTMLDivElement,
  FormulaEditorLayoutProps
>(function FormulaEditorLayout(
  { editor, suggestions, preview, toolbar, className, ...rest },
  ref,
) {
  const classes = ["ui-formula-editor", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      {toolbar && (
        <Box
          align="center"
          gap="content"
          className="ui-formula-editor__toolbar"
          role="toolbar"
          aria-label="Formula toolbar"
        >
          {toolbar}
        </Box>
      )}
      <div className="ui-formula-editor__body">
        <section
          className="ui-formula-editor__editor"
          aria-label="Formula editor"
        >
          {editor}
        </section>
        {suggestions && (
          <aside
            className="ui-formula-editor__suggestions"
            aria-label="Suggestions"
          >
            {suggestions}
          </aside>
        )}
      </div>
      {preview && (
        <section
          className="ui-formula-editor__preview"
          aria-label="Preview"
        >
          {preview}
        </section>
      )}
    </div>
  );
});
