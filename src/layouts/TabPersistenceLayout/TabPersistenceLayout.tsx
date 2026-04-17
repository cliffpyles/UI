import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { Icon } from "../../primitives/Icon";
import "./TabPersistenceLayout.css";

export interface PersistentTab {
  id: string;
  title: string;
  closable?: boolean;
  unsaved?: boolean;
  content: ReactNode;
}

export interface TabPersistenceLayoutProps extends HTMLAttributes<HTMLDivElement> {
  tabs: PersistentTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose?: (id: string) => void;
  onReorder?: (fromId: string, toId: string) => void;
  onAddTab?: () => void;
}

export const TabPersistenceLayout = forwardRef<HTMLDivElement, TabPersistenceLayoutProps>(
  function TabPersistenceLayout(
    {
      tabs,
      activeId,
      onActivate,
      onClose,
      onReorder,
      onAddTab,
      className,
      ...rest
    },
    ref,
  ) {
    const dragIdRef = useRef<string | null>(null);

    const classes = ["ui-tab-persist", className].filter(Boolean).join(" ");
    const active = tabs.find((t) => t.id === activeId);

    const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
      const idx = tabs.findIndex((t) => t.id === id);
      if (e.key === "ArrowRight" && idx < tabs.length - 1) {
        e.preventDefault();
        onActivate(tabs[idx + 1]!.id);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        onActivate(tabs[idx - 1]!.id);
      }
    };

    return (
      <div ref={ref} className={classes} {...rest}>
        <div
          role="tablist"
          aria-label="Open tabs"
          className="ui-tab-persist__bar"
        >
          <div className="ui-tab-persist__tabs">
            {tabs.map((tab) => {
              const selected = tab.id === activeId;
              return (
                <div
                  key={tab.id}
                  className={[
                    "ui-tab-persist__tab-wrap",
                    selected && "ui-tab-persist__tab-wrap--active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  draggable={!!onReorder}
                  onDragStart={() => {
                    dragIdRef.current = tab.id;
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIdRef.current && onReorder) {
                      onReorder(dragIdRef.current, tab.id);
                    }
                    dragIdRef.current = null;
                  }}
                >
                  <button
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    className="ui-tab-persist__tab"
                    onClick={() => onActivate(tab.id)}
                    onKeyDown={(e) => onTabKeyDown(e, tab.id)}
                  >
                    {tab.unsaved && (
                      <span className="ui-tab-persist__dot" aria-hidden="true" />
                    )}
                    <span className="ui-tab-persist__title">{tab.title}</span>
                  </button>
                  {tab.closable !== false && onClose && (
                    <button
                      type="button"
                      className="ui-tab-persist__close"
                      aria-label={`Close ${tab.title}`}
                      onClick={() => onClose(tab.id)}
                    >
                      <Icon name="x" size="xs" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {onAddTab && (
            <button
              type="button"
              className="ui-tab-persist__add"
              aria-label="New tab"
              onClick={onAddTab}
            >
              <Icon name="plus" size="sm" />
            </button>
          )}
        </div>
        {active && (
          <div
            role="tabpanel"
            id={`tabpanel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
            className="ui-tab-persist__panel"
          >
            {active.content}
          </div>
        )}
      </div>
    );
  },
);
