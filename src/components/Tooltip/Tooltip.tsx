import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import "./Tooltip.css";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipOwnProps {
  /** Content to display in the tooltip */
  content: ReactNode;
  /** Preferred side to display the tooltip */
  side?: TooltipSide;
  /** Delay in ms before showing the tooltip on hover */
  delay?: number;
  /** Maximum width of the tooltip in px */
  maxWidth?: number;
  /** The trigger element */
  children: ReactNode;
}

export type TooltipProps = TooltipOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "content">;

const FLIP_MAP: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function getFlippedSide(
  side: TooltipSide,
  tooltipEl: HTMLElement | null,
): TooltipSide {
  if (!tooltipEl) return side;
  const rect = tooltipEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (side === "top" && rect.top < 0) return FLIP_MAP[side];
  if (side === "bottom" && rect.bottom > vh) return FLIP_MAP[side];
  if (side === "left" && rect.left < 0) return FLIP_MAP[side];
  if (side === "right" && rect.right > vw) return FLIP_MAP[side];

  return side;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { content, side = "top", delay = 500, maxWidth = 240, children, ...props },
    ref,
  ) {
    const [isVisible, setIsVisible] = useState(false);
    const [flippedSide, setFlippedSide] = useState(side);
    const tooltipId = useId();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const show = useCallback(() => {
      setIsVisible(true);
    }, []);

    const hide = useCallback(() => {
      setIsVisible(false);
      setFlippedSide(side);
    }, [side]);

    const handleMouseEnter = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(show, delay);
    }, [show, delay]);

    const handleMouseLeave = useCallback(() => {
      clearTimeout(hoverTimeoutRef.current);
      hide();
    }, [hide]);

    const handleFocus = useCallback(() => {
      show();
    }, [show]);

    const handleBlur = useCallback(() => {
      hide();
    }, [hide]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          hide();
        }
      },
      [hide],
    );

    useEffect(() => {
      return () => clearTimeout(hoverTimeoutRef.current);
    }, []);

    // Use a ref callback to check flipping when the tooltip mounts
    const tooltipRefCallback = useCallback(
      (el: HTMLDivElement | null) => {
        (tooltipRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;

        if (el) {
          const computed = getFlippedSide(side, el);
          if (computed !== side) {
            setFlippedSide(computed);
          }
        }
      },
      [side, ref],
    );

    return (
      <>
        <span
          className="ui-tooltip-trigger"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-describedby={isVisible ? tooltipId : undefined}
        >
          {children}
        </span>
        {isVisible && (
          <div
            ref={tooltipRefCallback}
            id={tooltipId}
            role="tooltip"
            className={`ui-tooltip ui-tooltip--${flippedSide}`}
            style={{ maxWidth: `${maxWidth}px` }}
            {...props}
          >
            {content}
          </div>
        )}
      </>
    );
  },
);
