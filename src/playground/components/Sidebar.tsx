import { useEffect, useMemo, useRef, useState } from "react";
import { SECTIONS, type SectionId } from "../sections";

interface SidebarProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export const SIDEBAR_SEARCH_ID = "pg-sidebar-search";

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const [filter, setFilter] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? SECTIONS.filter((s) => s.label.toLowerCase().includes(q)) : SECTIONS;
  }, [filter]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, typeof SECTIONS>();
    for (const s of filtered) {
      const arr = byGroup.get(s.group) ?? [];
      arr.push(s);
      byGroup.set(s.group, arr);
    }
    return Array.from(byGroup.entries());
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      onNavigate(filtered[0].id);
    } else if (e.key === "Escape") {
      setFilter("");
      e.currentTarget.blur();
    } else if (e.key === "ArrowDown" && filtered.length > 0) {
      e.preventDefault();
      const currentIdx = filtered.findIndex((s) => s.id === active);
      const next = filtered[(currentIdx + 1) % filtered.length];
      if (next) onNavigate(next.id);
    } else if (e.key === "ArrowUp" && filtered.length > 0) {
      e.preventDefault();
      const currentIdx = filtered.findIndex((s) => s.id === active);
      const prev = filtered[(currentIdx - 1 + filtered.length) % filtered.length];
      if (prev) onNavigate(prev.id);
    }
  };

  return (
    <nav className="pg-sidebar" aria-label="Playground sections">
      <input
        id={SIDEBAR_SEARCH_ID}
        ref={searchRef}
        className="pg-sidebar__search"
        type="search"
        placeholder="Filter sections  (press /)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        onKeyDown={handleSearchKey}
        aria-label="Filter sections"
      />
      {groups.length === 0 && <div className="pg-sidebar__empty">No matches</div>}
      {groups.map(([group, items]) => (
        <div key={group} className="pg-sidebar__group">
          <div className="pg-sidebar__group-label">{group}</div>
          <ul className="pg-sidebar__list">
            {items.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`pg-sidebar__link${active === s.id ? " pg-sidebar__link--active" : ""}`}
                  onClick={() => onNavigate(s.id)}
                  aria-current={active === s.id ? "page" : undefined}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
