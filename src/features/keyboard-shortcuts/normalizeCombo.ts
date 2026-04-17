export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

function normalizePart(part: string, mac: boolean): string {
  const p = part.toLowerCase().trim();
  if (p === "mod") return mac ? "meta" : "ctrl";
  if (p === "cmd" || p === "command") return "meta";
  if (p === "control") return "ctrl";
  if (p === "option" || p === "opt") return "alt";
  if (p === "esc") return "escape";
  if (p === " " || p === "space") return "space";
  return p;
}

export function normalizeCombo(combo: string, mac = isMac()): string {
  const parts = combo.split("+").map((p) => normalizePart(p, mac));
  const modifiers = parts.filter((p) => p === "meta" || p === "ctrl" || p === "alt" || p === "shift").sort();
  const key = parts.find((p) => p !== "meta" && p !== "ctrl" && p !== "alt" && p !== "shift");
  return [...modifiers, key].filter(Boolean).join("+");
}

export function eventToCombo(e: KeyboardEvent, mac = isMac()): string {
  const parts: string[] = [];
  if (e.metaKey) parts.push("meta");
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  let key = e.key.toLowerCase();
  if (key === " ") key = "space";
  if (key === "escape") key = "escape";
  if (!["meta", "control", "alt", "shift"].includes(key)) {
    parts.push(key);
  }
  return normalizeCombo(parts.join("+"), mac);
}

export function formatComboLabel(combo: string, mac = isMac()): string {
  const parts = combo.split("+");
  const map: Record<string, string> = mac
    ? { meta: "⌘", ctrl: "⌃", alt: "⌥", shift: "⇧" }
    : { meta: "Win", ctrl: "Ctrl", alt: "Alt", shift: "Shift" };
  return parts
    .map((p) => map[p] ?? (p.length === 1 ? p.toUpperCase() : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(mac ? "" : "+");
}
