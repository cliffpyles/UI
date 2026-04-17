import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./ImportMappingLayout.css";

export interface ImportMappingLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  upload?: ReactNode;
  mapping: ReactNode;
  preview?: ReactNode;
  errors?: ReactNode;
  footer?: ReactNode;
}

export const ImportMappingLayout = forwardRef<
  HTMLDivElement,
  ImportMappingLayoutProps
>(function ImportMappingLayout(
  { upload, mapping, preview, errors, footer, className, ...rest },
  ref,
) {
  const classes = ["ui-import-mapping", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={classes} {...rest}>
      {upload && (
        <section
          className="ui-import-mapping__upload"
          role="region"
          aria-label="Upload"
        >
          {upload}
        </section>
      )}
      <section
        className="ui-import-mapping__mapping"
        role="region"
        aria-label="Column mapping"
      >
        {mapping}
      </section>
      {preview && (
        <section
          className="ui-import-mapping__preview"
          role="region"
          aria-label="Preview"
        >
          {preview}
        </section>
      )}
      {errors && (
        <section
          className="ui-import-mapping__errors"
          role="region"
          aria-label="Errors"
        >
          {errors}
        </section>
      )}
      {footer && <footer className="ui-import-mapping__footer">{footer}</footer>}
    </div>
  );
});
