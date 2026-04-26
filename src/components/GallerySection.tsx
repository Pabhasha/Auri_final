import { useRef, useCallback, useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import ScrollReveal from "./ScrollReveal";
import { Volume2 } from "lucide-react";
import { playTrigger } from "@/lib/audio";

const images = [
  { src: gallery1, alt: "Auri — Sound Waves", freq: 329.63, label: "Crystal" },
  { src: gallery2, alt: "Auri — Digital Voice", freq: 440, label: "Resonance" },
  { src: gallery3, alt: "Auri — Crystal Frequencies", freq: 523.25, label: "Pulse" },
];

const GallerySection = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const playSound = useCallback((freq: number, idx: number) => {
    stopRef.current?.();
    stopRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }

    stopRef.current = playTrigger(freq, { waveform: "triangle", duration: 2.5, peak: 0.18 });
    setPlayingIdx(idx);

    timeoutRef.current = window.setTimeout(() => {
      setPlayingIdx((prev) => (prev === idx ? null : prev));
    }, 2500);
  }, [playingIdx]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground text-center mb-4">
            Visuals
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-12 font-light">
            Click an image to hear its sound
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <button
                onClick={() => playSound(img.freq, i)}
                className="group relative overflow-hidden rounded-2xl border border-border aspect-square w-full hover:border-primary/40 transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
                    playingIdx === i ? "scale-105 brightness-125" : ""
                  }`}
                  loading="lazy"
                />
                {/* Hover glow overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                  playingIdx === i
                    ? "bg-primary/15 shadow-[inset_0_0_40px_hsl(265_80%_65%_/_0.3)]"
                    : "bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100"
                }`} />
                {/* Sound indicator */}
                <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-display transition-all duration-300 ${
                  playingIdx === i ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100 text-muted-foreground"
                }`}>
                  <Volume2 className="w-3 h-3" />
                  <span>{img.label}</span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
