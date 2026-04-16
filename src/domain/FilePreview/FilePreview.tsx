import { forwardRef, type HTMLAttributes } from "react";
import type { FileData } from "../FileAttachment";
import { Icon } from "../../primitives/Icon";
import "./FilePreview.css";

export interface FilePreviewProps extends HTMLAttributes<HTMLDivElement> {
  file: FileData;
  maxHeight?: number | string;
}

export const FilePreview = forwardRef<HTMLDivElement, FilePreviewProps>(
  function FilePreview({ file, maxHeight = 320, className, style, ...rest }, ref) {
    const classes = ["ui-file-preview", className].filter(Boolean).join(" ");
    const mergedStyle = { ...style, maxHeight };

    const isImage = file.type?.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    const isText = file.type?.startsWith("text/");

    return (
      <div ref={ref} className={classes} style={mergedStyle} {...rest}>
        {isImage && file.url ? (
          <img src={file.url} alt={file.name} className="ui-file-preview__image" />
        ) : isPdf && file.url ? (
          <iframe
            src={file.url}
            className="ui-file-preview__pdf"
            title={file.name}
          />
        ) : isText && file.url ? (
          <iframe
            src={file.url}
            className="ui-file-preview__pdf"
            title={file.name}
          />
        ) : (
          <div className="ui-file-preview__fallback" role="img" aria-label={file.name}>
            <Icon name="eye-off" size="lg" aria-hidden />
            <span>No preview available</span>
            <small>{file.name}</small>
          </div>
        )}
      </div>
    );
  },
);
