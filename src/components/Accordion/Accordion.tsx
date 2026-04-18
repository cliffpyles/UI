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
import { Text } from "../../primitives/Text";
import { Icon } from "../../primitives/Icon";
import { Button } from "../Button";
import "./Accordion.css";

// --- Context ---

interface AccordionContextValue {
  expandedValues: string[];
  toggle: (value: string) => void;
  type: "single" | "multiple";
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion compound components must be used within <Accordion>");
  return ctx;
}

interface ItemContextValue {
  value: string;
  isExpanded: boolean;
}

const ItemContext = createContext<ItemContextValue | null>(null);

function useItemContext() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("Accordion.Trigger/Content must be used within <Accordion.Item>");
  return ctx;
}

// --- Root ---

type AccordionType = "single" | "multiple";

interface AccordionOwnProps {
  /** Whether one or multiple items can be open */
  type?: AccordionType;
  /** Controlled value */
  value?: string | string[];
  /** Default value for uncontrolled usage */
  defaultValue?: string | string[];
  /** Change handler */
  onChange?: (value: string | string[]) => void;
  /** Whether all items can be collapsed (single mode) */
  collapsible?: boolean;
  children: ReactNode;
}

export type AccordionProps = AccordionOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      type = "single",
      value: controlledValue,
      defaultValue,
      onChange,
      collapsible = true,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const normalizeValue = (v: string | string[] | undefined): string[] => {
      if (v === undefined) return [];
      return Array.isArray(v) ? v : [v];
    };

    const [internalValue, setInternalValue] = useState<string[]>(
      normalizeValue(defaultValue),
    );
    const isControlled = controlledValue !== undefined;
    const expandedValues = isControlled
      ? normalizeValue(controlledValue)
      : internalValue;
    const baseId = useId();

    const toggle = useCallback(
      (itemValue: string) => {
        let next: string[];

        if (type === "single") {
          if (expandedValues.includes(itemValue)) {
            next = collapsible ? [] : expandedValues;
          } else {
            next = [itemValue];
          }
        } else {
          if (expandedValues.includes(itemValue)) {
            next = expandedValues.filter((v) => v !== itemValue);
          } else {
            next = [...expandedValues, itemValue];
          }
        }

        if (!isControlled) {
          setInternalValue(next);
        }
        onChange?.(type === "single" ? (next[0] ?? "") : next);
      },
      [type, expandedValues, collapsible, isControlled, onChange],
    );

    const classes = ["ui-accordion", className].filter(Boolean).join(" ");

    return (
      <AccordionContext.Provider value={{ expandedValues, toggle, type, baseId }}>
        <Box
          ref={ref as React.Ref<HTMLElement>}
          direction="column"
          className={classes}
          {...props}
        >
          {children}
        </Box>
      </AccordionContext.Provider>
    );
  },
);

// --- Item ---

interface AccordionItemOwnProps {
  value: string;
  children: ReactNode;
}

export type AccordionItemProps = AccordionItemOwnProps & HTMLAttributes<HTMLDivElement>;

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, children, className, ...props }, ref) {
    const { expandedValues } = useAccordionContext();
    const isExpanded = expandedValues.includes(value);

    const classes = [
      "ui-accordion__item",
      isExpanded && "ui-accordion__item--expanded",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <ItemContext.Provider value={{ value, isExpanded }}>
        <div ref={ref} className={classes} {...props}>
          {children}
        </div>
      </ItemContext.Provider>
    );
  },
);

// --- Trigger ---

export type AccordionTriggerProps = HTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ children, className, ...props }, ref) {
    const { toggle, baseId } = useAccordionContext();
    const { value, isExpanded } = useItemContext();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClick = useCallback(() => {
      toggle(value);
    }, [toggle, value]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        // Find the accordion root to get all triggers
        const accordion = containerRef.current?.closest(".ui-accordion");
        if (!accordion) return;

        const triggers = Array.from(
          accordion.querySelectorAll<HTMLElement>(".ui-accordion__trigger"),
        );
        const currentIndex = triggers.indexOf(e.currentTarget as HTMLElement);

        let next = -1;
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            next = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
            break;
          case "ArrowUp":
            e.preventDefault();
            next = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
            break;
          case "Home":
            e.preventDefault();
            next = 0;
            break;
          case "End":
            e.preventDefault();
            next = triggers.length - 1;
            break;
        }

        if (next >= 0) {
          triggers[next].focus();
        }
      },
      [],
    );

    const classes = ["ui-accordion__trigger", className].filter(Boolean).join(" ");

    return (
      <div ref={containerRef}>
        <Text as="h3" color="inherit" className="ui-accordion__heading">
          <Button
            ref={ref as React.Ref<HTMLButtonElement>}
            variant="ghost"
            size="md"
            id={`${baseId}-trigger-${value}`}
            aria-expanded={isExpanded}
            aria-controls={`${baseId}-content-${value}`}
            className={classes}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...props}
          >
            <Box
              direction="row"
              align="center"
              justify="between"
              gap="2"
              className="ui-accordion__trigger-row"
            >
              <span className="ui-accordion__trigger-text">{children}</span>
              <span
                className={`ui-accordion__chevron${isExpanded ? " ui-accordion__chevron--open" : ""}`}
                aria-hidden="true"
              >
                <Icon name="chevron-down" size="sm" aria-hidden="true" />
              </span>
            </Box>
          </Button>
        </Text>
      </div>
    );
  },
);

// --- Content ---

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ children, className, ...props }, ref) {
    const { baseId } = useAccordionContext();
    const { value, isExpanded } = useItemContext();

    const classes = [
      "ui-accordion__content",
      isExpanded && "ui-accordion__content--open",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        id={`${baseId}-content-${value}`}
        role="region"
        aria-labelledby={`${baseId}-trigger-${value}`}
        className={classes}
        hidden={!isExpanded}
        {...props}
      >
        <Box direction="column" className="ui-accordion__content-inner">
          {children}
        </Box>
      </div>
    );
  },
);

AccordionRoot.displayName = "Accordion";
AccordionItem.displayName = "Accordion.Item";
AccordionTrigger.displayName = "Accordion.Trigger";
AccordionContent.displayName = "Accordion.Content";

// --- Compound export ---

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
