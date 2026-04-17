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

function collectHeadings(container: Element): Heading[] {
  const raw = Array.from(container.querySelectorAll("h3.pg-demo__title")) as HTMLElement[];
  const used = new Set<string>();
  return raw.map((el) => {
    const text = el.textContent?.trim() ?? "";
    let id = el.id || slugify(text);
    let n = 2;
    while (id && used.has(id)) id = `${slugify(text)}-${n++}`;
    used.add(id);
    el.id = id;
    return { id, text };
  });
}

function headingsEqual(a: Heading[], b: Heading[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].text !== b[i].text) return false;
  }
  return true;
}

export function TableOfContents({ containerSelector, sectionKey }: { containerSelector: string; sectionKey: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let currentHeadings: Heading[] = [];
    let intersectionObserver: IntersectionObserver | null = null;

    const rescan = () => {
      const next = collectHeadings(container);
      if (headingsEqual(next, currentHeadings)) return;
      currentHeadings = next;
      setHeadings(next);
      setActiveId(next[0]?.id ?? "");

      intersectionObserver?.disconnect();
      if (next.length === 0) return;

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) setActiveId(visible[0].target.id);
        },
        { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
      );
      next.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) intersectionObserver?.observe(el);
      });
    };

    const schedule =
      typeof queueMicrotask === "function" ? queueMicrotask : (cb: () => void) => window.setTimeout(cb, 0);
    schedule(rescan);

    const mutationObserver = new MutationObserver(() => schedule(rescan));
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
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
                const el = document.getElementById(h.id);
                const target = el?.closest(".pg-demo") ?? el;
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
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
