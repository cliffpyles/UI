import { useMemo, useState } from "react";
import { SECTIONS, type SectionId } from "../sections";

interface SidebarProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const [filter, setFilter] = useState("");

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = q ? SECTIONS.filter((s) => s.label.toLowerCase().includes(q)) : SECTIONS;
    const byGroup = new Map<string, typeof SECTIONS>();
    for (const s of filtered) {
      const arr = byGroup.get(s.group) ?? [];
      arr.push(s);
      byGroup.set(s.group, arr);
    }
    return Array.from(byGroup.entries());
  }, [filter]);

  return (
    <nav className="pg-sidebar" aria-label="Playground sections">
      <input
        className="pg-sidebar__search"
        type="search"
        placeholder="Filter sections…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter sections"
      />
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
