import { forwardRef } from "react";
import { UserPicker, type UserPickerProps } from "../UserPicker";

export type AssigneePickerProps = UserPickerProps;

export const AssigneePicker = forwardRef<HTMLDivElement, AssigneePickerProps>(
  function AssigneePicker({ placeholder = "Assign…", ...rest }, ref) {
    return <UserPicker ref={ref} placeholder={placeholder} {...rest} />;
  },
);
