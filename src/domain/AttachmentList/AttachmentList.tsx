import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { FileAttachment } from "../FileAttachment";
import "./AttachmentList.css";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType?: string;
  url?: string;
}

export interface AttachmentListProps extends HTMLAttributes<HTMLDivElement> {
  items: Attachment[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  onPreview?: (id: string) => void;
  onDownload?: (id: string) => void;
  emptyLabel?: ReactNode;
  readOnly?: boolean;
}

export const AttachmentList = forwardRef<HTMLDivElement, AttachmentListProps>(
  function AttachmentList(
    {
      items,
      onAdd,
      onRemove,
      onPreview,
      onDownload,
      emptyLabel = "No attachments",
      readOnly = false,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-attachment-list", className].filter(Boolean).join(" ");
    const showAdd = !readOnly && !!onAdd;

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="column"
        gap="2"
        className={classes}
        {...rest}
      >
        {items.length === 0 ? (
          <Text
            as="p"
            size="sm"
            color="tertiary"
            className="ui-attachment-list__empty"
          >
            {emptyLabel}
          </Text>
        ) : (
          <Box role="list" direction="column" gap="1">
            {items.map((item) => (
              <FileAttachment
                key={item.id}
                role="listitem"
                file={{
                  name: item.name,
                  size: item.size,
                  type: item.mimeType,
                  url: item.url,
                }}
                onPreview={onPreview ? () => onPreview(item.id) : undefined}
                onDownload={onDownload ? () => onDownload(item.id) : undefined}
                onRemove={
                  !readOnly && onRemove ? () => onRemove(item.id) : undefined
                }
              />
            ))}
          </Box>
        )}
        {showAdd && (
          <Button
            variant="ghost"
            size="sm"
            icon="plus"
            aria-label="Add attachment"
            onClick={onAdd}
          >
            Add attachment
          </Button>
        )}
      </Box>
    );
  },
);

AttachmentList.displayName = "AttachmentList";
