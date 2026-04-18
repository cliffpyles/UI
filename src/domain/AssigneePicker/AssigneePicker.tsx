import { forwardRef } from "react";
import { Box } from "../../primitives/Box";
import { UserPicker, type UserPickerProps } from "../UserPicker";

export interface AssigneePickerProps extends UserPickerProps {
  /** Current user id — enables "Assign to me" shortcut when provided via `users` list. */
  currentUserId?: string;
}

/**
 * AssigneePicker wraps `UserPicker` with assignment-specific defaults
 * (placeholder "Unassigned"). See design/components/domain/AssigneePicker.md.
 */
export const AssigneePicker = forwardRef<HTMLDivElement, AssigneePickerProps>(
  function AssigneePicker(
    { placeholder = "Unassigned", className, currentUserId, ...rest },
    ref,
  ) {
    const classes = ["ui-assignee-picker", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        direction="row"
        align="center"
        gap="2"
        className={classes}
        data-current-user-id={currentUserId}
      >
        <UserPicker placeholder={placeholder} {...rest} />
      </Box>
    );
  },
);

AssigneePicker.displayName = "AssigneePicker";
