import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { SearchInput } from "../../components/SearchInput";
import { Spinner } from "../../primitives/Spinner";
import { UserAvatar, type UserData } from "../UserAvatar";
import { UserChip } from "../UserChip";
import "./UserPicker.css";

export interface UserPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: UserData[];
  onChange: (users: UserData[]) => void;
  users?: UserData[];
  onSearch?: (query: string) => void | Promise<void>;
  multiple?: boolean;
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export const UserPicker = forwardRef<HTMLDivElement, UserPickerProps>(
  function UserPicker(
    {
      value,
      onChange,
      users = [],
      onSearch,
      multiple = true,
      loading,
      placeholder = "Search users…",
      emptyMessage = "No users found",
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listId = useId();
    const classes = ["ui-user-picker", className].filter(Boolean).join(" ");

    const selectedIds = useMemo(
      () => new Set(value.map((u) => u.id ?? u.name)),
      [value],
    );

    const filtered = useMemo(() => {
      if (onSearch) return users;
      if (!query) return users;
      const q = query.toLowerCase();
      return users.filter((u) => u.name.toLowerCase().includes(q));
    }, [users, query, onSearch]);

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const toggle = (user: UserData) => {
      const key = user.id ?? user.name;
      if (selectedIds.has(key)) {
        onChange(value.filter((u) => (u.id ?? u.name) !== key));
      } else {
        onChange(multiple ? [...value, user] : [user]);
        if (!multiple) setOpen(false);
      }
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={classes}
        {...rest}
      >
        <div className="ui-user-picker__selected">
          {value.map((u) => (
            <UserChip
              key={u.id ?? u.name}
              user={u}
              removable
              onRemove={() => toggle(u)}
            />
          ))}
        </div>
        <SearchInput
          value={query}
          debounce={0}
          onChange={(v) => {
            setQuery(v);
            void onSearch?.(v);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          loading={loading}
          disabled={disabled}
          aria-controls={listId}
          aria-expanded={open}
          role="combobox"
          aria-autocomplete="list"
        />
        {open && (
          <ul id={listId} role="listbox" className="ui-user-picker__list">
            {loading ? (
              <li className="ui-user-picker__loading">
                <Spinner size="sm" /> Loading…
              </li>
            ) : filtered.length === 0 ? (
              <li className="ui-user-picker__empty">{emptyMessage}</li>
            ) : (
              filtered.map((u) => {
                const key = u.id ?? u.name;
                const selected = selectedIds.has(key);
                return (
                  <li
                    key={key}
                    role="option"
                    aria-selected={selected}
                    className={
                      "ui-user-picker__option" +
                      (selected ? " ui-user-picker__option--selected" : "")
                    }
                    onClick={() => toggle(u)}
                  >
                    <UserAvatar user={u} size="sm" />
                    <span className="ui-user-picker__option-name">{u.name}</span>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  },
);
