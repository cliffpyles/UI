import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type InputHTMLAttributes,
} from "react";
import { Spinner } from "../../primitives/Spinner";
import "./SearchInput.css";

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

      // Focus the input after clearing
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

    const wrapperClasses = [
      "ui-search-input",
      `ui-search-input--${size}`,
      disabled && "ui-search-input--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const hasValue = currentValue.length > 0;

    return (
      <div className={wrapperClasses}>
        <span className="ui-search-input__icon" aria-hidden="true">
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>
        <input
          ref={(node) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          type="search"
          className="ui-search-input__field"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={props["aria-label"] ?? placeholder}
          {...props}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            className="ui-search-input__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
