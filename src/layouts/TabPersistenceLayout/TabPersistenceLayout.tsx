import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "../../primitives/Icon";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Tabs } from "../../components/Tabs";
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

    return (
      <div ref={ref} className={classes} {...rest}>
        <Tabs value={activeId} onChange={onActivate}>
          <Tabs.List aria-label="Open tabs" className="ui-tab-persist__bar">
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
                    <Tabs.Tab value={tab.id} className="ui-tab-persist__tab">
                      {tab.unsaved && (
                        <span className="ui-tab-persist__dot" aria-hidden="true" />
                      )}
                      <Text as="span" className="ui-tab-persist__title">{tab.title}</Text>
                    </Tabs.Tab>
                    {tab.closable !== false && onClose && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ui-tab-persist__close"
                        aria-label={`Close ${tab.title}`}
                        onClick={() => onClose(tab.id)}
                      >
                        <Icon name="x" size="xs" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            {onAddTab && (
              <Button
                variant="ghost"
                size="sm"
                className="ui-tab-persist__add"
                aria-label="New tab"
                onClick={onAddTab}
              >
                <Icon name="plus" size="sm" />
              </Button>
            )}
          </Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Panel
              key={tab.id}
              value={tab.id}
              className="ui-tab-persist__panel"
            >
              {tab.content}
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    );
  },
);
