import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./SharedLinkLayout.css";

export interface SharedLinkLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  url: string;
  onCopy?: () => void;
  embed?: ReactNode;
  preview?: ReactNode;
  options?: ReactNode;
  copyLabel?: string;
  urlLabel?: string;
}

export const SharedLinkLayout = forwardRef<HTMLDivElement, SharedLinkLayoutProps>(
  function SharedLinkLayout(
    {
      url,
      onCopy,
      embed,
      preview,
      options,
      copyLabel = "Copy link",
      urlLabel = "Shareable link",
      className,
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const classes = ["ui-shared-link", className].filter(Boolean).join(" ");

    const handleCopy = () => {
      inputRef.current?.select();
      onCopy?.();
    };

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className="ui-shared-link__row">
          <label className="ui-shared-link__label">
            {urlLabel}
            <input
              ref={inputRef}
              type="text"
              className="ui-shared-link__input"
              value={url}
              readOnly
            />
          </label>
          <button
            type="button"
            className="ui-shared-link__copy"
            onClick={handleCopy}
          >
            {copyLabel}
          </button>
        </div>
        {preview && (
          <section
            className="ui-shared-link__section"
            aria-label="Link preview"
          >
            {preview}
          </section>
        )}
        {embed && (
          <section
            className="ui-shared-link__section"
            aria-label="Embed code"
          >
            {embed}
          </section>
        )}
        {options && (
          <section
            className="ui-shared-link__section"
            aria-label="Sharing options"
          >
            {options}
          </section>
        )}
      </div>
    );
  },
);
