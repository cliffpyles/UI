import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&amp;|&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TableOfContents({ containerSelector, sectionKey }: { containerSelector: string; sectionKey: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const raw = Array.from(container.querySelectorAll("h3")) as HTMLElement[];
    const used = new Set<string>();
    const next: Heading[] = raw.map((el) => {
      const text = el.textContent?.trim() ?? "";
      let id = el.id || slugify(text);
      let n = 2;
      while (id && used.has(id)) id = `${slugify(text)}-${n++}`;
      used.add(id);
      el.id = id;
      return { id, text };
    });

    const handle = queueMicrotask
      ? (queueMicrotask(() => {
          setHeadings(next);
          setActiveId(next[0]?.id ?? "");
        }),
        0)
      : window.setTimeout(() => {
          setHeadings(next);
          setActiveId(next[0]?.id ?? "");
        }, 0);

    if (next.length === 0) {
      return () => window.clearTimeout(handle);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    raw.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      window.clearTimeout(handle);
    };
  }, [containerSelector, sectionKey]);

  if (headings.length < 2) return null;

  return (
    <aside className="pg-toc" aria-label="On this page">
      <div className="pg-toc__label">On this page</div>
      <ul>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              className={`pg-toc__link${activeId === h.id ? " pg-toc__link--active" : ""}`}
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
