import { useEffect, useState } from "react";

const chapters = ["Origin", "Discovery", "Purpose"];

const ChapterNav = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-chapter]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.chapter);
            if (!isNaN(idx)) setActive(idx);
          }
        });
      },
      { threshold: 0.35 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (i: number) =>
    document.querySelector(`[data-chapter="${i}"]`)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Desktop: vertical right rail */}
      <nav
        aria-label="Chapter navigation"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-4"
      >
        {chapters.map((label, i) => (
          <button
            key={label}
            onClick={() => jumpTo(i)}
            aria-label={`Jump to ${label}`}
            className="group flex items-center gap-3"
          >
            <span
              className={`text-xs font-display tracking-wide transition-all duration-300 ${
                active === i
                  ? "opacity-100 text-primary"
                  : "opacity-0 group-hover:opacity-70 text-muted-foreground"
              }`}
            >
              {label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                active === i
                  ? "w-3 h-3 bg-primary box-glow-sm"
                  : "w-2 h-2 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Mobile: compact bottom-center pill */}
      <nav
        aria-label="Chapter navigation"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex md:hidden items-center gap-3 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border box-glow-sm"
      >
        {chapters.map((label, i) => (
          <button
            key={label}
            onClick={() => jumpTo(i)}
            aria-label={`Jump to ${label}`}
            className="flex items-center justify-center w-8 h-8 -m-1 p-1"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                active === i
                  ? "w-2.5 h-2.5 bg-primary box-glow-sm"
                  : "w-2 h-2 bg-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
};

export default ChapterNav;
