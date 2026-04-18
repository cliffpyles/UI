import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "../../components/Button";
import "./InlineEditLayout.css";

export interface InlineEditLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  value: ReactNode;
  editor: ReactNode;
  isEditing: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  displayLabel?: string;
}

export const InlineEditLayout = forwardRef<
  HTMLDivElement,
  InlineEditLayoutProps
>(function InlineEditLayout(
  {
    value,
    editor,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    displayLabel = "Edit value",
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const classes = [
    "ui-inline-edit",
    isEditing && "ui-inline-edit--editing",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!isEditing) return;
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel?.();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSave?.();
    }
  };

  return (
    <div ref={ref} className={classes} onKeyDown={handleKeyDown} {...rest}>
      {isEditing ? (
        <div className="ui-inline-edit__editor">{editor}</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="ui-inline-edit__display"
          onClick={onEdit}
          aria-label={displayLabel}
        >
          {value}
        </Button>
      )}
    </div>
  );
});
