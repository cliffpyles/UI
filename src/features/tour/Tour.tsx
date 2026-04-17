import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "../../components/Button";
import { Text } from "../../primitives/Text";
import "./Tour.css";

export interface TourStep {
  /** CSS selector or element ref for the target. */
  target: string;
  title: ReactNode;
  content: ReactNode;
}

export interface TourProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  id: string;
  steps: TourStep[];
  /** Start the tour. Defaults to true. */
  open?: boolean;
  /** Controlled step index. */
  stepIndex?: number;
  onStepChange?: (index: number) => void;
  onComplete?: () => void;
  onSkip?: () => void;
  /** Persist completion in localStorage. Defaults to true. */
  persist?: boolean;
  /** Labels for navigation buttons. */
  labels?: {
    next?: string;
    previous?: string;
    finish?: string;
    skip?: string;
    progress?: (current: number, total: number) => string;
  };
}

const STORAGE_PREFIX = "ui-tour-";
const MAX_STEPS = 7;

function isCompleted(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id) === "complete";
  } catch {
    return false;
  }
}

function markComplete(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, "complete");
  } catch {
    // ignore
  }
}

function getTargetRect(selector: string): DOMRect | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const Tour = forwardRef<HTMLDivElement, TourProps>(function Tour(
  {
    id,
    steps,
    open = true,
    stepIndex: stepIndexProp,
    onStepChange,
    onComplete,
    onSkip,
    persist = true,
    labels,
    className,
    ...rest
  },
  ref,
) {
  const boundedSteps = steps.slice(0, MAX_STEPS);
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = stepIndexProp !== undefined;
  const index = isControlled ? stepIndexProp : internalIndex;
  const [rect, setRect] = useState<DOMRect | null>(null);

  const setIndex = useCallback(
    (next: number) => {
      if (!isControlled) setInternalIndex(next);
      onStepChange?.(next);
    },
    [isControlled, onStepChange],
  );

  const step = boundedSteps[index];
  const reducedMotion = prefersReducedMotion();

  const shouldShow = open && !!step && (!persist || !isCompleted(id));

  useLayoutEffect(() => {
    if (!shouldShow || !step) return;
    const update = () => setRect(getTargetRect(step.target));
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [shouldShow, step]);

  const handleNext = useCallback(() => {
    if (index + 1 >= boundedSteps.length) {
      if (persist) markComplete(id);
      onComplete?.();
    } else {
      setIndex(index + 1);
    }
  }, [index, boundedSteps.length, persist, id, onComplete, setIndex]);

  const handlePrevious = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index, setIndex]);

  const handleSkip = useCallback(() => {
    if (persist) markComplete(id);
    onSkip?.();
  }, [persist, id, onSkip]);

  useEffect(() => {
    if (!shouldShow) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrevious();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shouldShow, handleNext, handlePrevious, handleSkip]);

  const popoverStyle = useMemo(() => {
    if (!rect) return { display: "none" as const };
    const top = rect.bottom + 12;
    const left = Math.max(12, rect.left);
    return { top, left };
  }, [rect]);

  if (!shouldShow || !step) return null;

  const nextLabel = index + 1 >= boundedSteps.length ? (labels?.finish ?? "Finish") : (labels?.next ?? "Next");
  const previousLabel = labels?.previous ?? "Previous";
  const skipLabel = labels?.skip ?? "Skip tour";
  const progressLabel = (labels?.progress ?? ((c, t) => `Step ${c} of ${t}`))(index + 1, boundedSteps.length);

  const overlay = (
    <div
      className={["ui-tour", reducedMotion && "ui-tour--reduced-motion", className].filter(Boolean).join(" ")}
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Tour: ${id}`}
      {...rest}
    >
      {rect ? (
        <div
          className="ui-tour__cutout"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
          aria-hidden="true"
        />
      ) : (
        <div className="ui-tour__scrim" aria-hidden="true" />
      )}
      <div className="ui-tour__popover" style={popoverStyle} role="document">
        <div className="ui-tour__progress" aria-live="polite">{progressLabel}</div>
        <Text as="h3" size="lg" weight="semibold" className="ui-tour__title">
          {step.title}
        </Text>
        <div className="ui-tour__content">{step.content}</div>
        <div className="ui-tour__actions">
          <Button variant="ghost" size="sm" onClick={handleSkip}>{skipLabel}</Button>
          <div className="ui-tour__nav">
            {index > 0 && (
              <Button variant="secondary" size="sm" onClick={handlePrevious}>{previousLabel}</Button>
            )}
            <Button variant="primary" size="sm" onClick={handleNext}>{nextLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
});
