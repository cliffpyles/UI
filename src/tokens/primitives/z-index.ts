export const zIndex = {
  sticky: {
    column: 70,
    tableHeader: 80,
    filter: 90,
    header: 100,
  },
  dropdown: 200,
  modal: 300,
  toast: 400,
} as const;

export type ZIndex = typeof zIndex;
