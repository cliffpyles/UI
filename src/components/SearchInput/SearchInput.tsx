import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type InputHTMLAttributes,
} from "react";
import { Icon } from "../../primitives/Icon";
import { Spinner } from "../../primitives/Spinner";
import { Button } from "../Button";
import { Input } from "../Input";
import "./SearchInput.css";

// Composition: Input owns the chrome; Box-style layout comes from Input's
// leadingIcon/trailingIcon slots. We pass Icon, Spinner, and Button as the
// adornments rather than overlaying raw markup.

type SearchInputSize = "sm" | "md" | "lg";

interface SearchInputOwnProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the value changes (debounced) */
  onChange?: (value: string) => void;
  /** Called when a search is submitted (Enter key) */
  onSearch?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounce?: number;
  /** Whether search is in progress */
  loading?: boolean;
  /** Visual size */
  size?: SearchInputSize;
}

export type SearchInputProps = SearchInputOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange"
  >;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value: controlledValue,
      defaultValue = "",
      onChange,
      onSearch,
      placeholder = "Search...",
      debounce = 300,
      loading = false,
      size = "md",
      className,
      disabled,
      ...props
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    // Cleanup debounce on unmount
    useEffect(() => {
      return () => clearTimeout(debounceRef.current);
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onChange?.(newValue);
        }, debounce);
      },
      [isControlled, onChange, debounce],
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue("");
      }
      onChange?.("");
      clearTimeout(debounceRef.current);

      const input = inputRef.current;
      if (input) input.focus();
    }, [isControlled, onChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          e.preventDefault();
          if (!isControlled) {
            setInternalValue("");
          }
          onChange?.("");
          clearTimeout(debounceRef.current);
        } else if (e.key === "Enter") {
          e.preventDefault();
          clearTimeout(debounceRef.current);
          onSearch?.(currentValue);
        }
      },
      [isControlled, onChange, onSearch, currentValue],
    );

    const classes = ["ui-search-input", className].filter(Boolean).join(" ");
    const hasValue = currentValue.length > 0;

    const leadingAdornment = loading ? (
      <Spinner size="sm" aria-hidden="true" />
    ) : (
      <Icon name="search" size="sm" aria-hidden="true" />
    );

    const trailingAdornment =
      hasValue && !disabled ? (
        <Button
          variant="ghost"
          size="sm"
          icon="x"
          onClick={handleClear}
          aria-label="Clear search"
          className="ui-search-input__clear"
        />
      ) : undefined;

    return (
      <Input
        ref={(node) => {
          (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }}
        type="search"
        size={size}
        className={classes}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={props["aria-label"] ?? placeholder}
        leadingIcon={leadingAdornment}
        trailingIcon={trailingAdornment}
        {...props}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";
