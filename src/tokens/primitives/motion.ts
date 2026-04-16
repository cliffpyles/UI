export const duration = {
  instant: "0ms",
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  deliberate: "500ms",
} as const;

export const easing = {
  default: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
  linear: "linear",
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
