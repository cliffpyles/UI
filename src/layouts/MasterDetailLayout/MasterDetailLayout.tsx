import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ResizablePanel } from "../ResizablePanel";
import "./MasterDetailLayout.css";

export interface MasterDetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  master: ReactNode;
  detail: ReactNode;
  masterWidth?: number;
  minMasterWidth?: number;
  maxMasterWidth?: number;
  onMasterResize?: (width: number) => void;
  empty?: ReactNode;
  hasSelection?: boolean;
  masterLabel?: string;
  detailLabel?: string;
}

export const MasterDetailLayout = forwardRef<HTMLDivElement, MasterDetailLayoutProps>(
  function MasterDetailLayout(
    {
      master,
      detail,
      masterWidth = 320,
      minMasterWidth = 240,
      maxMasterWidth = 600,
      onMasterResize,
      empty,
      hasSelection = true,
      masterLabel = "Master list",
      detailLabel = "Detail",
      className,
      ...rest
    },
    ref,
  ) {
    const [width, setWidth] = useState(masterWidth);
    const classes = ["ui-master-detail", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <ResizablePanel
          direction="horizontal"
          size={width}
          minSize={minMasterWidth}
          maxSize={maxMasterWidth}
          onResize={(s) => {
            setWidth(s);
            onMasterResize?.(s);
          }}
          handleLabel="Resize master panel"
        >
          <section
            className="ui-master-detail__master"
            aria-label={masterLabel}
          >
            {master}
          </section>
        </ResizablePanel>
        <section
          className="ui-master-detail__detail"
          aria-label={detailLabel}
        >
          {hasSelection ? detail : empty}
        </section>
      </div>
    );
  },
);
