import { forwardRef } from "react";
import { Select, type SelectProps } from "../../components/Select";
import { defaultPriorities, type PriorityDef } from "./priorities";

export interface PriorityPickerProps
  extends Omit<SelectProps, "options" | "value" | "onChange"> {
  value: string;
  onChange: (priority: string) => void;
  priorities?: PriorityDef[];
}

export const PriorityPicker = forwardRef<HTMLSelectElement, PriorityPickerProps>(
  function PriorityPicker(
    { value, onChange, priorities = defaultPriorities, ...rest },
    ref,
  ) {
    const options = priorities.map((p) => ({ value: p.id, label: p.label }));
    return (
      <Select
        ref={ref}
        aria-label="Priority"
        options={options}
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  },
);
