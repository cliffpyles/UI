import { forwardRef, type HTMLAttributes } from "react";
import { VisuallyHidden } from "../../primitives/VisuallyHidden";
import { EmptyChart } from "../EmptyChart";
import "./HeatmapGrid.css";

export interface HeatmapGridProps extends HTMLAttributes<HTMLDivElement> {
  data: number[][];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: [string, string];
  ariaLabel?: string;
  cellSize?: number;
}

function interpolate(min: string, max: string, t: number): string {
  // simple linear interpolation in hex; accepts #rrggbb
  const parse = (h: string) => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const [r1, g1, b1] = parse(min);
  const [r2, g2, b2] = parse(max);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const HeatmapGrid = forwardRef<HTMLDivElement, HeatmapGridProps>(
  function HeatmapGrid(
    {
      data,
      xLabels,
      yLabels,
      colorScale = ["#f1f5f9", "#1d4ed8"],
      ariaLabel = "Heatmap",
      cellSize = 28,
      className,
      ...rest
    },
    ref,
  ) {
    const classes = ["ui-heatmap-grid", className].filter(Boolean).join(" ");

    if (data.length === 0 || data[0].length === 0) {
      return (
        <div ref={ref} className={classes} {...rest}>
          <EmptyChart />
        </div>
      );
    }

    const flat = data.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const range = max - min || 1;

    return (
      <div
        ref={ref}
        className={classes}
        role="figure"
        aria-label={ariaLabel}
        {...rest}
      >
        <table className="ui-heatmap-grid__table">
          {xLabels && (
            <thead>
              <tr>
                {yLabels && (
                  <th>
                    <VisuallyHidden>Row labels</VisuallyHidden>
                  </th>
                )}
                {xLabels.map((x) => (
                  <th key={x} scope="col">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {yLabels && <th scope="row">{yLabels[i]}</th>}
                {row.map((v, j) => {
                  const t = (v - min) / range;
                  const bg = interpolate(colorScale[0], colorScale[1], t);
                  return (
                    <td
                      key={j}
                      className="ui-heatmap-grid__cell"
                      style={{
                        background: bg,
                        width: cellSize,
                        height: cellSize,
                      }}
                    >
                      <span className="ui-heatmap-grid__value">{v}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);
