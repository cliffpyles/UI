import { createContext } from "react";

export interface ShortcutMetadata {
  description: string;
  category?: string;
}

export interface RegisteredShortcut extends ShortcutMetadata {
  id: string;
  combo: string;
  handler: (e: KeyboardEvent) => void;
}

export interface KeyboardShortcutContextValue {
  register: (shortcut: RegisteredShortcut) => () => void;
  getAll: () => RegisteredShortcut[];
  subscribe: (listener: () => void) => () => void;
}

export const KeyboardShortcutContext = createContext<KeyboardShortcutContextValue | null>(null);
