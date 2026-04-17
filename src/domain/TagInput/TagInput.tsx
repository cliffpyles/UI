import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { Box } from "../../primitives/Box";
import { Tag } from "../../components/Tag";
import "./TagInput.css";

export interface TagInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  onSearch?: (query: string) => void;
  allowCreate?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}

export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(
  function TagInput(
    {
      value,
      onChange,
      suggestions = [],
      onSearch,
      allowCreate = true,
      placeholder = "Add tag…",
      disabled,
      maxTags,
      className,
      ...rest
    },
    ref,
  ) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const classes = ["ui-tag-input", className].filter(Boolean).join(" ");

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const filtered = suggestions.filter(
      (s) => !value.includes(s) && (!query || s.toLowerCase().includes(query.toLowerCase())),
    );

    const canAdd = !maxTags || value.length < maxTags;

    const addTag = (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed || value.includes(trimmed) || !canAdd) return;
      onChange([...value, trimmed]);
      setQuery("");
    };

    const removeTag = (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Enter" || e.key === ",") && query.trim()) {
        e.preventDefault();
        if (allowCreate || suggestions.includes(query.trim())) {
          addTag(query.trim());
        }
      } else if (e.key === "Backspace" && !query && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={classes}
        {...rest}
      >
        <Box
          className="ui-tag-input__control"
          display="flex"
          align="center"
          gap="1"
          wrap
        >
          {value.map((tag) => (
            <Tag key={tag} removable onRemove={() => removeTag(tag)}>
              {tag}
            </Tag>
          ))}
          <input
            className="ui-tag-input__field"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            disabled={disabled || !canAdd}
            aria-label="Add tag"
          />
        </Box>
        {open && filtered.length > 0 && (
          <ul className="ui-tag-input__list" role="listbox">
            {filtered.map((s) => (
              <li
                key={s}
                role="option"
                aria-selected={false}
                className="ui-tag-input__option"
                onClick={() => addTag(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
