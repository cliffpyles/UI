import { forwardRef } from "react";
import { Select, type SelectProps } from "../../components/Select";
import {
  filterOperatorLabels,
  operatorsByType,
  type FilterFieldType,
  type FilterOperator,
} from "./operators";

export interface OperatorSelectProps
  extends Omit<SelectProps, "options" | "value" | "onChange"> {
  fieldType: FilterFieldType;
  value: FilterOperator;
  onChange: (op: FilterOperator) => void;
}

export const OperatorSelect = forwardRef<HTMLSelectElement, OperatorSelectProps>(
  function OperatorSelect({ fieldType, value, onChange, ...rest }, ref) {
    const ops = operatorsByType[fieldType];
    const options = ops.map((op) => ({ value: op, label: filterOperatorLabels[op] }));

    return (
      <Select
        ref={ref}
        aria-label="Operator"
        options={options}
        value={value}
        onChange={(v) => onChange(v as FilterOperator)}
        {...rest}
      />
    );
  },
);
