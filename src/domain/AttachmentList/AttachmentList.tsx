import { forwardRef, type HTMLAttributes } from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import { FileAttachment, type FileData } from "../FileAttachment";
import "./AttachmentList.css";

export interface AttachmentListProps extends HTMLAttributes<HTMLDivElement> {
  files: FileData[];
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onDownload?: (index: number) => void;
  onPreview?: (index: number) => void;
  editable?: boolean;
  emptyMessage?: string;
}

export const AttachmentList = forwardRef<HTMLDivElement, AttachmentListProps>(
  function AttachmentList(
    {
      files,
      onAdd,
      onRemove,
      onDownload,
      onPreview,
      editable = true,
      emptyMessage = "No attachments",
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-attachment-list", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {files.length === 0 ? (
          <div className="ui-attachment-list__empty">{emptyMessage}</div>
        ) : (
          <ul className="ui-attachment-list__items">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <FileAttachment
                  file={f}
                  onDownload={onDownload ? () => onDownload(i) : undefined}
                  onPreview={onPreview ? () => onPreview(i) : undefined}
                  onRemove={editable && onRemove ? () => onRemove(i) : undefined}
                />
              </li>
            ))}
          </ul>
        )}
        {editable && onAdd && (
          <Button variant="secondary" size="sm" onClick={onAdd}>
            <Icon name="plus" size="xs" aria-hidden /> Add attachment
          </Button>
        )}
      </div>
    );
  },
);
