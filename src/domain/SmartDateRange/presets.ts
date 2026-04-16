export interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePreset {
  id: string;
  label: string;
  compute: (now: Date) => DateRangeValue;
}

const DAY = 86_400_000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export const defaultPresets: DateRangePreset[] = [
  { id: "today", label: "Today", compute: (n) => ({ start: startOfDay(n), end: endOfDay(n) }) },
  {
    id: "yesterday",
    label: "Yesterday",
    compute: (n) => {
      const d = new Date(n.getTime() - DAY);
      return { start: startOfDay(d), end: endOfDay(d) };
    },
  },
  {
    id: "7d",
    label: "Last 7 days",
    compute: (n) => ({ start: startOfDay(new Date(n.getTime() - 6 * DAY)), end: endOfDay(n) }),
  },
  {
    id: "30d",
    label: "Last 30 days",
    compute: (n) => ({ start: startOfDay(new Date(n.getTime() - 29 * DAY)), end: endOfDay(n) }),
  },
  {
    id: "mtd",
    label: "Month to date",
    compute: (n) => ({
      start: new Date(n.getFullYear(), n.getMonth(), 1),
      end: endOfDay(n),
    }),
  },
  {
    id: "qtd",
    label: "Quarter to date",
    compute: (n) => ({
      start: new Date(n.getFullYear(), Math.floor(n.getMonth() / 3) * 3, 1),
      end: endOfDay(n),
    }),
  },
  {
    id: "ytd",
    label: "Year to date",
    compute: (n) => ({ start: new Date(n.getFullYear(), 0, 1), end: endOfDay(n) }),
  },
];

export function toInputValue(d: Date | null): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
