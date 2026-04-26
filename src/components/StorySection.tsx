import { useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import AudioTrigger from "./AudioTrigger";
import WaveformVisualizer from "./WaveformVisualizer";
import { playTrigger } from "@/lib/audio";

interface StorySectionProps {
  title: string;
  subtitle: string;
  body: string;
  audio: { label: string; frequency: number; waveform?: OscillatorType; src?: string };
  index: number;
}

const chapterStyles = [
  // Origin — glitchy, dark
  "bg-[radial-gradient(ellipse_at_top_left,_hsl(265_80%_65%_/_0.06)_0%,_transparent_50%)]",
  // Discovery — moving, mid
  "bg-[radial-gradient(ellipse_at_center,_hsl(220_60%_50%_/_0.08)_0%,_transparent_60%)]",
  // Purpose — brighter, resolved
  "bg-[radial-gradient(ellipse_at_bottom_right,_hsl(265_80%_65%_/_0.1)_0%,_transparent_50%)]",
];

const InteractiveWord = ({ word, frequency }: { word: string; frequency: number }) => {
  const playTinySound = useCallback(() => {
    playTrigger(frequency, { waveform: "sine", duration: 0.45, peak: 0.1, attack: 0.05 });
  }, [frequency]);

  return (
    <span
      onMouseEnter={playTinySound}
      onTouchStart={playTinySound}
      className="text-primary/90 cursor-default hover:text-primary hover:text-glow transition-all duration-300 font-normal"
    >
      {word}
    </span>
  );
};

const highlightWords: Record<number, Record<string, number>> = {
  0: { silence: 523, sound: 392, echoes: 330, voice: 440, fragments: 261, melodies: 349, hum: 293, presence: 466 },
  1: { melody: 349, frequencies: 466, expression: 392, connection: 293, note: 330, experiment: 440, soundscapes: 523, communicate: 261 },
  2: { bridge: 440, creativity: 523, music: 349, world: 392, digital: 261, emotional: 330, form: 293, share: 466 },
};

const renderBody = (body: string, chapterIndex: number) => {
  const words = body.split(" ");
  const highlights = highlightWords[chapterIndex] || {};

  return words.map((word, i) => {
    const clean = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    const freq = highlights[clean];
    if (freq) {
      return (
        <span key={i}>
          <InteractiveWord word={word} frequency={freq} />{" "}
        </span>
      );
    }
    return <span key={i}>{word} </span>;
  });
};

const StorySection = ({ title, subtitle, body, audio, index }: StorySectionProps) => {
  return (
    <section data-chapter={index} className="py-20 sm:py-28 px-4 relative overflow-hidden scroll-mt-8">
      {/* Chapter atmosphere */}
      <div className={`absolute inset-0 ${chapterStyles[index] || ""}`} />

      {/* Alternating subtle background */}
      {index % 2 === 1 && (
        <div className="absolute inset-0 bg-muted/20" />
      )}

      <div className="max-w-2xl mx-auto relative z-10">
        <ScrollReveal>
          <p className="text-primary/60 text-xs font-display tracking-[0.3em] uppercase mb-3">
            Chapter {index + 1}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-2">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-primary/70 font-display text-sm sm:text-base mb-8 italic">
            {subtitle}
          </p>
        </ScrollReveal>

        {body.split(". ").filter(Boolean).map((sentence, si) => (
          <ScrollReveal key={si} delay={300 + si * 120}>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-light mb-4">
              {renderBody(sentence.endsWith(".") ? sentence : sentence + ".", index)}
            </p>
          </ScrollReveal>
        ))}

        {/* Waveform visualizer for chapter 2 */}
        {index === 1 && (
          <ScrollReveal delay={350}>
            <WaveformVisualizer />
          </ScrollReveal>
        )}

        <ScrollReveal delay={400}>
          <AudioTrigger
            label={audio.label}
            frequency={audio.frequency}
            waveform={audio.waveform}
            src={audio.src}
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StorySection;
