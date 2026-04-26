import { Play } from "lucide-react";
import auriCharacter from "@/assets/auri-character.png";
import { useEffect, useState, useCallback, useRef } from "react";
import ParticleField from "./ParticleField";
import { getAudioContext, getMasterGain } from "@/lib/audio";
import auriBegin from "@/assets/audio/auri-begin.mp3";

const HeroSection = ({ onPlayClick }: { onPlayClick: () => void }) => {
  const [parallaxY, setParallaxY] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  // No local audio context — uses shared master gain.

  useEffect(() => {
    const handleScroll = () => {
      setParallaxY(window.scrollY * 0.25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseOffset({
        x: (e.clientX - cx) / cx * 12,
        y: (e.clientY - cy) / cy * 8,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const beginAudioRef = useRef<HTMLAudioElement | null>(null);
  const beginConnectedRef = useRef(false);

  const ensureBeginAudio = useCallback(() => {
    if (!beginAudioRef.current) {
      const el = new Audio(auriBegin);
      el.preload = "auto";
      beginAudioRef.current = el;
    }
    if (!beginConnectedRef.current && beginAudioRef.current) {
      try {
        const ctx = getAudioContext();
        const master = getMasterGain();
        const source = ctx.createMediaElementSource(beginAudioRef.current);
        source.connect(master);
        beginConnectedRef.current = true;
      } catch {
        /* already connected */
      }
    }
    return beginAudioRef.current!;
  }, []);

  const [isBeginPlaying, setIsBeginPlaying] = useState(false);

  const playClickSound = useCallback(() => {
    const el = ensureBeginAudio();
    if (!el.paused) {
      el.pause();
      setIsBeginPlaying(false);
      return;
    }
    void el.play();
    setIsBeginPlaying(true);
    el.onended = () => setIsBeginPlaying(false);
    el.onpause = () => {
      if (el.ended) setIsBeginPlaying(false);
    };
  }, [ensureBeginAudio]);

  const handleBeginJourney = useCallback(() => {
    playClickSound();
    onPlayClick();
  }, [playClickSound, onPlayClick]);

  useEffect(() => () => {
    beginAudioRef.current?.pause();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Particle background */}
      <ParticleField />

      {/* Parallax background layers */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background"
        style={{ transform: `translateY(${parallaxY * 0.5}px)` }}
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(265_80%_65%_/_0.12)_0%,_transparent_60%)]"
        style={{ transform: `translateY(${parallaxY * 0.3}px)` }}
      />

      <div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        style={{ transform: `translateY(${parallaxY * 0.15}px)` }}
      >
        {/* Character image with mouse parallax + click sound */}
        <div
          className="relative animate-float cursor-pointer"
          style={{
            transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={playClickSound}
        >
          {/* Glow aura — intensifies on hover */}
          <div
            className="absolute inset-0 blur-3xl rounded-full scale-75 transition-all duration-700"
            style={{
              backgroundColor: `hsl(265 80% 65% / ${isHovered ? 0.4 : 0.2})`,
              transform: `scale(${isHovered ? 0.85 : 0.75})`,
            }}
          />
          {/* Depth layer — blurred background ring */}
          <div className="absolute -inset-4 blur-2xl bg-primary/10 rounded-full animate-pulse-glow" />
          <img
            src={auriCharacter}
            alt="Auri — Virtual Music Artist"
            className={`relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-full border border-border transition-all duration-500 ${
              isHovered ? "box-glow scale-105 border-primary/50" : "box-glow-sm"
            }`}
          />
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight text-glow text-foreground mt-4">
          Auri
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-base sm:text-lg max-w-md font-light leading-relaxed">
          Where silence became sound
        </p>

        {/* CTA */}
        <button
          onClick={handleBeginJourney}
          className="mt-6 flex items-center gap-3 px-6 py-3 rounded-full bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 box-glow-sm hover:box-glow group"
        >
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          <span className="font-display text-sm tracking-wide">Begin the Journey</span>
        </button>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-pulse-glow">
          <span className="text-muted-foreground/50 text-xs font-display tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
