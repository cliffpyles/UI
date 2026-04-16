export interface PriorityDef {
  id: string;
  label: string;
  level: number;
}

export const defaultPriorities: PriorityDef[] = [
  { id: "urgent", label: "Urgent", level: 4 },
  { id: "high", label: "High", level: 3 },
  { id: "medium", label: "Medium", level: 2 },
  { id: "low", label: "Low", level: 1 },
  { id: "none", label: "None", level: 0 },
];
