export interface ThemeContract {
  // Structural
  "color-background-surface": string;
  "color-background-surface-raised": string;
  "color-background-surface-sunken": string;
  "color-background-overlay": string;
  "color-text-primary": string;
  "color-text-secondary": string;
  "color-text-tertiary": string;
  "color-text-disabled": string;
  "color-border-default": string;
  "color-border-strong": string;

  // Action
  "color-action-primary": string;
  "color-action-primary-hover": string;
  "color-action-primary-bg": string;
  "color-action-secondary": string;
  "color-action-destructive": string;
  "color-focus-ring": string;

  // Status
  "color-status-success-bg": string;
  "color-status-success-text": string;
  "color-status-success-icon": string;
  "color-status-warning-bg": string;
  "color-status-warning-text": string;
  "color-status-warning-icon": string;
  "color-status-error-bg": string;
  "color-status-error-text": string;
  "color-status-error-icon": string;
  "color-status-info-bg": string;
  "color-status-info-text": string;
  "color-status-info-icon": string;

  // Categorical
  "color-categorical-1": string;
  "color-categorical-2": string;
  "color-categorical-3": string;
  "color-categorical-4": string;
  "color-categorical-5": string;
  "color-categorical-6": string;
  "color-categorical-7": string;
  "color-categorical-8": string;
}

export const lightTheme: ThemeContract = {
  "color-background-surface": "#ffffff",
  "color-background-surface-raised": "#f9fafb",
  "color-background-surface-sunken": "#f3f4f6",
  "color-background-overlay": "rgba(0, 0, 0, 0.5)",
  "color-text-primary": "#111827",
  "color-text-secondary": "#6b7280",
  "color-text-tertiary": "#9ca3af",
  "color-text-disabled": "#d1d5db",
  "color-border-default": "#e5e7eb",
  "color-border-strong": "#d1d5db",
  "color-action-primary": "#2563eb",
  "color-action-primary-hover": "#1d4ed8",
  "color-action-primary-bg": "#eff6ff",
  "color-action-secondary": "#4b5563",
  "color-action-destructive": "#dc2626",
  "color-focus-ring": "rgba(59, 130, 246, 0.5)",
  "color-status-success-bg": "#f0fdf4",
  "color-status-success-text": "#16a34a",
  "color-status-success-icon": "#22c55e",
  "color-status-warning-bg": "#fffbeb",
  "color-status-warning-text": "#b45309",
  "color-status-warning-icon": "#f59e0b",
  "color-status-error-bg": "#fef2f2",
  "color-status-error-text": "#b91c1c",
  "color-status-error-icon": "#ef4444",
  "color-status-info-bg": "#eff6ff",
  "color-status-info-text": "#1d4ed8",
  "color-status-info-icon": "#3b82f6",
  "color-categorical-1": "#3b82f6",
  "color-categorical-2": "#14b8a6",
  "color-categorical-3": "#f59e0b",
  "color-categorical-4": "#a855f7",
  "color-categorical-5": "#ec4899",
  "color-categorical-6": "#6366f1",
  "color-categorical-7": "#f97316",
  "color-categorical-8": "#06b6d4",
};

export const darkTheme: ThemeContract = {
  "color-background-surface": "#111827",
  "color-background-surface-raised": "#1f2937",
  "color-background-surface-sunken": "#030712",
  "color-background-overlay": "rgba(0, 0, 0, 0.7)",
  "color-text-primary": "#f3f4f6",
  "color-text-secondary": "#9ca3af",
  "color-text-tertiary": "#6b7280",
  "color-text-disabled": "#4b5563",
  "color-border-default": "#374151",
  "color-border-strong": "#4b5563",
  "color-action-primary": "#60a5fa",
  "color-action-primary-hover": "#93c5fd",
  "color-action-primary-bg": "#172554",
  "color-action-secondary": "#d1d5db",
  "color-action-destructive": "#f87171",
  "color-focus-ring": "rgba(96, 165, 250, 0.5)",
  "color-status-success-bg": "#052e16",
  "color-status-success-text": "#4ade80",
  "color-status-success-icon": "#4ade80",
  "color-status-warning-bg": "#451a03",
  "color-status-warning-text": "#fbbf24",
  "color-status-warning-icon": "#fbbf24",
  "color-status-error-bg": "#450a0a",
  "color-status-error-text": "#f87171",
  "color-status-error-icon": "#f87171",
  "color-status-info-bg": "#172554",
  "color-status-info-text": "#60a5fa",
  "color-status-info-icon": "#60a5fa",
  "color-categorical-1": "#60a5fa",
  "color-categorical-2": "#2dd4bf",
  "color-categorical-3": "#fbbf24",
  "color-categorical-4": "#c084fc",
  "color-categorical-5": "#f472b6",
  "color-categorical-6": "#818cf8",
  "color-categorical-7": "#fb923c",
  "color-categorical-8": "#22d3ee",
};
