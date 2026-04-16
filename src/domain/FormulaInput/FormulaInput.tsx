import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import "./FormulaInput.css";

export interface FormulaSchemaField {
  id: string;
  label: string;
  type?: string;
}

export interface FormulaInputProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement> & HTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (value: string) => void;
  schema?: FormulaSchemaField[];
  onValidate?: (value: string) => string | null;
  placeholder?: string;
}

export const FormulaInput = forwardRef<HTMLTextAreaElement, FormulaInputProps>(
  function FormulaInput(
    { value, onChange, schema = [], onValidate, placeholder = "=A + B", className, ...rest },
    ref,
  ) {
    const [error, setError] = useState<string | null>(null);
    const classes = ["ui-formula-input", className].filter(Boolean).join(" ");

    return (
      <div className={classes}>
        <textarea
          ref={ref}
          className="ui-formula-input__field"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (onValidate) setError(onValidate(e.target.value));
          }}
          placeholder={placeholder}
          aria-label="Formula"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "formula-error" : undefined}
          spellCheck={false}
          {...rest}
        />
        {schema.length > 0 && (
          <div className="ui-formula-input__schema">
            <span className="ui-formula-input__schema-label">Fields:</span>
            {schema.map((f) => (
              <button
                key={f.id}
                type="button"
                className="ui-formula-input__token"
                onClick={() => onChange(value + f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
        {error && (
          <div id="formula-error" role="alert" className="ui-formula-input__error">
            {error}
          </div>
        )}
      </div>
    );
  },
);
