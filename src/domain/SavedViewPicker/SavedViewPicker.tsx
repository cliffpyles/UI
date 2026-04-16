import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { Button } from "../../components/Button";
import { Icon } from "../../primitives/Icon";
import "./SavedViewPicker.css";

export interface SavedView {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface SavedViewPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  views: SavedView[];
  current: string | null;
  onChange: (id: string) => void;
  onSave?: (name: string) => void;
  onDelete?: (id: string) => void;
  placeholder?: string;
}

export const SavedViewPicker = forwardRef<HTMLDivElement, SavedViewPickerProps>(
  function SavedViewPicker(
    {
      views,
      current,
      onChange,
      onSave,
      onDelete,
      placeholder = "Select view",
      className,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const classes = ["ui-saved-view-picker", className].filter(Boolean).join(" ");

    useEffect(() => {
      function handler(e: MouseEvent) {
        if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
      }
      if (open) document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const currentView = views.find((v) => v.id === current);

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {currentView?.name ?? placeholder}
          <Icon name="chevron-down" size="xs" aria-hidden />
        </Button>
        {open && (
          <div className="ui-saved-view-picker__panel" role="listbox">
            {views.map((v) => (
              <div
                key={v.id}
                role="option"
                aria-selected={v.id === current}
                className={
                  "ui-saved-view-picker__option" +
                  (v.id === current ? " ui-saved-view-picker__option--active" : "")
                }
              >
                <button
                  type="button"
                  className="ui-saved-view-picker__select"
                  onClick={() => {
                    onChange(v.id);
                    setOpen(false);
                  }}
                >
                  {v.name}
                  {v.isDefault && <span className="ui-saved-view-picker__badge">default</span>}
                </button>
                {onDelete && !v.isDefault && (
                  <button
                    type="button"
                    className="ui-saved-view-picker__delete"
                    onClick={() => onDelete(v.id)}
                    aria-label={`Delete ${v.name}`}
                  >
                    <Icon name="trash" size="xs" aria-hidden />
                  </button>
                )}
              </div>
            ))}
            {onSave && (
              <div className="ui-saved-view-picker__save">
                {saving ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (name.trim()) {
                        onSave(name.trim());
                        setName("");
                        setSaving(false);
                        setOpen(false);
                      }
                    }}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="View name"
                      aria-label="New view name"
                      className="ui-saved-view-picker__input"
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className="ui-saved-view-picker__add"
                    onClick={() => setSaving(true)}
                  >
                    <Icon name="plus" size="xs" aria-hidden /> Save current view
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
