import { forwardRef } from "react";
import { Select, type SelectProps } from "../../components/Select";

export interface WorkflowState {
  id: string;
  label: string;
  color?: string;
}

export interface WorkflowStatePickerProps
  extends Omit<SelectProps, "options" | "value" | "onChange"> {
  value: string;
  onChange: (stateId: string) => void;
  states: WorkflowState[];
  allowedTransitions?: Record<string, string[]>;
}

export const WorkflowStatePicker = forwardRef<HTMLSelectElement, WorkflowStatePickerProps>(
  function WorkflowStatePicker(
    { value, onChange, states, allowedTransitions, ...rest },
    ref,
  ) {
    const allowed = allowedTransitions?.[value];
    const options = states.map((s) => ({
      value: s.id,
      label: s.label,
      disabled: s.id !== value && allowed ? !allowed.includes(s.id) : false,
    }));

    return (
      <Select
        ref={ref}
        aria-label="Workflow state"
        options={options}
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  },
);
