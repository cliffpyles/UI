import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { ResizablePanel } from "../ResizablePanel";
import "./FacetedSearchLayout.css";

export interface FacetedSearchLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "results"> {
  facets: ReactNode;
  results: ReactNode;
  resultsHeader?: ReactNode;
  facetsWidth?: number;
  minFacetsWidth?: number;
  maxFacetsWidth?: number;
  onFacetsResize?: (width: number) => void;
  facetsLabel?: string;
  resultsLabel?: string;
}

export const FacetedSearchLayout = forwardRef<HTMLDivElement, FacetedSearchLayoutProps>(
  function FacetedSearchLayout(
    {
      facets,
      results,
      resultsHeader,
      facetsWidth = 260,
      minFacetsWidth = 200,
      maxFacetsWidth = 480,
      onFacetsResize,
      facetsLabel = "Facets",
      resultsLabel = "Results",
      className,
      ...rest
    },
    ref,
  ) {
    const [width, setWidth] = useState(facetsWidth);
    const classes = ["ui-faceted-search", className].filter(Boolean).join(" ");
    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        display="flex"
        className={classes}
        {...rest}
      >
        <ResizablePanel
          direction="horizontal"
          size={width}
          minSize={minFacetsWidth}
          maxSize={maxFacetsWidth}
          onResize={(s) => {
            setWidth(s);
            onFacetsResize?.(s);
          }}
          handleLabel="Resize facets panel"
        >
          <aside
            className="ui-faceted-search__facets"
            role="complementary"
            aria-label={facetsLabel}
          >
            {facets}
          </aside>
        </ResizablePanel>
        <Box
          as="main"
          direction="column"
          grow
          minWidth={0}
          className="ui-faceted-search__results"
          aria-label={resultsLabel}
        >
          {resultsHeader && (
            <header className="ui-faceted-search__results-header">
              {resultsHeader}
            </header>
          )}
          <div className="ui-faceted-search__results-body">{results}</div>
        </Box>
      </Box>
    );
  },
);
