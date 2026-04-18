/* eslint-disable react-refresh/only-export-components */
import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useId,
  type ReactNode,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { Box } from "../../primitives/Box";
import { Button } from "../Button";
import "./Tabs.css";

// Button automatically wraps its children in the Text primitive, so tab
// labels render through Text per the Tabs spec without extra markup here.

// --- Context ---

interface TabsContextValue {
  value: string;
  onSelect: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

// --- Root ---

interface TabsOwnProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  children: ReactNode;
}

export type TabsProps = TabsOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(
    { value: controlledValue, defaultValue, onChange, children, className, ...props },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const baseId = useId();

    const handleSelect = useCallback(
      (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onChange?.(val);
      },
      [isControlled, onChange],
    );

    const classes = ["ui-tabs", className].filter(Boolean).join(" ");

    return (
      <TabsContext.Provider value={{ value: currentValue, onSelect: handleSelect, baseId }}>
        <Box
          ref={ref as React.Ref<HTMLElement>}
          direction="column"
          className={classes}
          {...props}
        >
          {children}
        </Box>
      </TabsContext.Provider>
    );
  },
);

// --- Tab List ---

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ children, className, ...props }, ref) {
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      const list = listRef.current;
      if (!list) return;

      const tabs = Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
      );
      const current = tabs.indexOf(document.activeElement as HTMLElement);
      if (current === -1) return;

      let next = -1;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          next = current < tabs.length - 1 ? current + 1 : 0;
          break;
        case "ArrowLeft":
          e.preventDefault();
          next = current > 0 ? current - 1 : tabs.length - 1;
          break;
        case "Home":
          e.preventDefault();
          next = 0;
          break;
        case "End":
          e.preventDefault();
          next = tabs.length - 1;
          break;
      }

      if (next >= 0) {
        tabs[next].focus();
        tabs[next].click();
      }
    }, []);

    const classes = ["ui-tabs__list", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={(node) => {
          (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement | null;
          if (typeof ref === "function") ref(node as HTMLDivElement | null);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement | null;
        }}
        role="tablist"
        display="flex"
        align="center"
        gap="0"
        className={classes}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Tab ---

interface TabOwnProps {
  /** Value identifying this tab */
  value: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  children: ReactNode;
}

export type TabProps = TabOwnProps &
  Omit<HTMLAttributes<HTMLButtonElement>, "value">;

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  function Tab({ value, disabled = false, children, className, ...props }, ref) {
    const { value: selected, onSelect, baseId } = useTabsContext();
    const isSelected = selected === value;

    const handleClick = useCallback(() => {
      if (!disabled) {
        onSelect(value);
      }
    }, [disabled, onSelect, value]);

    const classes = [
      "ui-tabs__tab",
      isSelected && "ui-tabs__tab--active",
      disabled && "ui-tabs__tab--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="md"
        role="tab"
        type="button"
        id={`${baseId}-tab-${value}`}
        aria-selected={isSelected}
        aria-controls={`${baseId}-panel-${value}`}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

// --- Tab Panel ---

interface TabPanelOwnProps {
  /** Value identifying which tab this panel belongs to */
  value: string;
  children: ReactNode;
}

export type TabPanelProps = TabPanelOwnProps & HTMLAttributes<HTMLDivElement>;

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ value, children, className, ...props }, ref) {
    const { value: selected, baseId } = useTabsContext();
    const isActive = selected === value;

    if (!isActive) return null;

    const classes = ["ui-tabs__panel", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

// --- Compound export ---

TabsRoot.displayName = "Tabs";
TabsList.displayName = "Tabs.List";
Tab.displayName = "Tabs.Tab";
TabPanel.displayName = "Tabs.Panel";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabPanel,
});
