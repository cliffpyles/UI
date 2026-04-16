import { forwardRef, type HTMLAttributes } from "react";
import { Icon, type IconName } from "../../primitives/Icon";
import { FileSize } from "../FileSize";
import "./FileAttachment.css";

export interface FileData {
  name: string;
  size: number;
  type?: string;
  url?: string;
}

export interface FileAttachmentProps extends HTMLAttributes<HTMLDivElement> {
  file: FileData;
  onDownload?: () => void;
  onPreview?: () => void;
  onRemove?: () => void;
}

function iconForType(type?: string): IconName {
  if (!type) return "upload";
  if (type.startsWith("image/")) return "eye";
  if (type.startsWith("video/")) return "eye";
  return "upload";
}

export const FileAttachment = forwardRef<HTMLDivElement, FileAttachmentProps>(
  function FileAttachment(
    { file, onDownload, onPreview, onRemove, className, ...rest },
    ref,
  ) {
    const classes = ["ui-file-attachment", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-file-attachment__icon" aria-hidden="true">
          <Icon name={iconForType(file.type)} size="md" />
        </div>
        <div className="ui-file-attachment__body">
          <div className="ui-file-attachment__name" title={file.name}>
            {file.name}
          </div>
          <div className="ui-file-attachment__meta">
            <FileSize bytes={file.size} />
            {file.type && <span> · {file.type}</span>}
          </div>
        </div>
        <div className="ui-file-attachment__actions">
          {onPreview && (
            <button
              type="button"
              className="ui-file-attachment__action"
              onClick={onPreview}
              aria-label={`Preview ${file.name}`}
            >
              <Icon name="eye" size="xs" aria-hidden />
            </button>
          )}
          {onDownload && (
            <button
              type="button"
              className="ui-file-attachment__action"
              onClick={onDownload}
              aria-label={`Download ${file.name}`}
            >
              <Icon name="download" size="xs" aria-hidden />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              className="ui-file-attachment__action ui-file-attachment__action--destructive"
              onClick={onRemove}
              aria-label={`Remove ${file.name}`}
            >
              <Icon name="trash" size="xs" aria-hidden />
            </button>
          )}
        </div>
      </div>
    );
  },
);
