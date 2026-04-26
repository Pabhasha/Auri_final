import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { playTrigger, getAudioContext, getMasterGain } from "@/lib/audio";

interface AudioTriggerProps {
  label: string;
  frequency: number;
  waveform?: OscillatorType;
  duration?: number;
  className?: string;
  /** Optional real audio file URL. If set, plays this instead of the synth. */
  src?: string;
}

const AudioTrigger = ({
  label,
  frequency,
  waveform = "sine",
  duration = 3,
  className = "",
  src,
}: AudioTriggerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (src) {
      // Real audio file path — route through shared master gain so global
      // volume/mute controls apply.
      if (!audioRef.current) {
        const el = new Audio(src);
        el.preload = "auto";
        el.addEventListener("ended", () => setIsPlaying(false));
        el.addEventListener("pause", () => {
          // Reflect external pauses (e.g., end of track) in UI.
          if (el.ended || el.paused) setIsPlaying((p) => (el.paused && !el.ended ? p : false));
        });
        audioRef.current = el;
        try {
          const ctx = getAudioContext();
          const master = getMasterGain();
          const source = ctx.createMediaElementSource(el);
          source.connect(master);
          sourceRef.current = source;
        } catch {
          /* already connected or unsupported */
        }
      }
      // Resume from current position rather than restarting.
      void audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    stopRef.current = playTrigger(frequency, { waveform, duration, peak: 0.18 });
    setIsPlaying(true);
    timeoutRef.current = window.setTimeout(stop, duration * 1000);
  }, [src, frequency, waveform, duration, stop]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      // For src audio, pause without resetting position so next click resumes.
      if (src && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
      stop();
    } else {
      play();
    }
  }, [isPlaying, src, play, stop]);

  useEffect(() => () => stop(), [stop]);

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-display tracking-wide hover:bg-primary/20 hover:border-primary/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 box-glow-sm ${
        isPlaying ? "box-glow border-primary/50 bg-primary/20" : ""
      } ${className}`}
    >
      {isPlaying ? (
        <Pause className="w-3.5 h-3.5 fill-current" />
      ) : (
        <Play className="w-3.5 h-3.5 fill-current" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default AudioTrigger;
