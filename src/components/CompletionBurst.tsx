import { useEffect, useState } from "react";

/**
 * Subtle celebratory glow that fades in once the user has scrolled past
 * the final story chapter. Pure CSS / no external libs to keep it light.
 */
const CompletionBurst = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector('[data-chapter="2"]');
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            setVisible(true);
          }
        });
      },
      { threshold: [0.5] },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
    >
      <div className="w-[60vmin] h-[60vmin] rounded-full opacity-0 animate-[pulse-glow_4s_ease-out_1] bg-[radial-gradient(circle,_hsl(265_80%_65%_/_0.18)_0%,_transparent_70%)]" />
    </div>
  );
};

export default CompletionBurst;
