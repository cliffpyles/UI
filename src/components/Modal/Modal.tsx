import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useId,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { VisuallyHidden } from "../../primitives/VisuallyHidden";
import { Button } from "../Button";
// Close button uses `Button icon="x"` — Button composes Icon internally.
import "./Modal.css";

type ModalSize = "sm" | "md" | "lg";

interface ModalOwnProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Title rendered in the modal header */
  title?: ReactNode;
  /** Description rendered below the title */
  description?: ReactNode;
  /** Content rendered in the modal footer */
  footer?: ReactNode;
  /** Size of the modal */
  size?: ModalSize;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Modal body content */
  children: ReactNode;
}

export type ModalProps = ModalOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  function Modal(
    {
      open,
      onClose,
      title,
      description,
      footer,
      size = "md",
      closeOnOverlayClick = true,
      closeOnEscape = true,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<Element | null>(null);
    const titleId = useId();
    const descriptionId = useId();

    // Capture the element that was focused when the modal opens
    useEffect(() => {
      if (open) {
        triggerRef.current = document.activeElement;
      }
    }, [open]);

    // Focus the first focusable element when modal opens
    useEffect(() => {
      if (!open || !dialogRef.current) return;
      const firstFocusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        dialogRef.current.focus();
      }
    }, [open]);

    // Return focus to trigger on close
    useEffect(() => {
      if (!open) {
        const trigger = triggerRef.current;
        if (trigger && trigger instanceof HTMLElement) {
          trigger.focus();
        }
      }
    }, [open]);

    // Lock body scroll
    useEffect(() => {
      if (!open) return;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Handle keydown for Escape and focus trapping
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          e.stopPropagation();
          onClose();
          return;
        }

        if (e.key === "Tab" && dialogRef.current) {
          const focusableEls = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
          if (focusableEls.length === 0) {
            e.preventDefault();
            return;
          }

          const firstEl = focusableEls[0];
          const lastEl = focusableEls[focusableEls.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      },
      [closeOnEscape, onClose],
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose();
        }
      },
      [closeOnOverlayClick, onClose],
    );

    if (!open) return null;

    const classes = [
      "ui-modal",
      `ui-modal--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const modal = (
      <Box
        align="center"
        justify="center"
        className="ui-modal-overlay"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
      >
        <Box
          ref={(node) => {
            (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement | null;
            if (typeof ref === "function") ref(node as HTMLDivElement | null);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement | null;
          }}
          direction="column"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          className={classes}
          tabIndex={-1}
          {...props}
        >
          <Box
            align="center"
            justify="between"
            gap="3"
            className="ui-modal__header"
          >
            {title ? (
              <Text
                as="h2"
                id={titleId}
                size="lg"
                weight="semibold"
                color="primary"
                className="ui-modal__title"
              >
                {title}
              </Text>
            ) : (
              <VisuallyHidden>
                <Text as="h2" id={titleId} size="lg">
                  Dialog
                </Text>
              </VisuallyHidden>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon="x"
              className="ui-modal__close"
              onClick={onClose}
              aria-label="Close"
            />
          </Box>
          {description && (
            <Text
              as="p"
              id={descriptionId}
              size="sm"
              color="secondary"
              className="ui-modal__description"
            >
              {description}
            </Text>
          )}
          <Box direction="column" grow className="ui-modal__body">
            {children}
          </Box>
          {footer && (
            <Box
              align="center"
              justify="end"
              className="ui-modal__footer"
            >
              {footer}
            </Box>
          )}
        </Box>
      </Box>
    );

    return createPortal(modal, document.body);
  },
);

Modal.displayName = "Modal";
