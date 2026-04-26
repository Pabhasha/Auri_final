import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { getAudioContext, getMasterGain } from "@/lib/audio";
import auriAwakening from "@/assets/audio/auri-awakening.mp3";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wiredRef = useRef(false);

  // Route the <audio> element through the shared master gain so the
  // global volume/mute control affects it.
  const wireToMasterGain = () => {
    if (wiredRef.current || !audioRef.current) return;
    try {
      const ctx = getAudioContext();
      const master = getMasterGain();
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(master);
      wiredRef.current = true;
    } catch {
      // If already wired or unsupported, fall back to default output.
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    wireToMasterGain();
    // Ensure context is running (browsers suspend until user gesture)
    try {
      await getAudioContext().resume();
    } catch {
      /* noop */
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
    setCurrentTime(audio.currentTime);
  };

  return (
    <section className="py-24 px-4 relative" id="music">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(265_80%_65%_/_0.06)_0%,_transparent_50%)]" />

      <div className="max-w-xl mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground text-center mb-3">
          Final Composition
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-12 font-light">
          The culmination of Auri's journey
        </p>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 box-glow-sm hover:box-glow transition-shadow duration-700">
          <audio ref={audioRef} src={auriAwakening} preload="metadata" />

          {/* Track info */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              isPlaying ? "box-glow border-primary/40" : ""
            }`}>
              <Volume2 className={`w-6 h-6 text-primary transition-all duration-300 ${isPlaying ? "animate-pulse-glow" : ""}`} />
            </div>
            <div>
              <h3 className="font-display font-medium text-foreground text-lg">Awakening</h3>
              <p className="text-muted-foreground text-sm">Auri · Final Composition</p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-1.5 bg-muted rounded-full cursor-pointer mb-3 group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity box-glow-sm" />
            </div>
          </div>

          {/* Time */}
          <div className="flex justify-between text-xs text-muted-foreground mb-6 font-body">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className={`w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center hover:bg-primary/30 hover:border-primary/60 hover:scale-105 active:scale-95 transition-all duration-300 box-glow-sm hover:box-glow ${
                isPlaying ? "box-glow border-primary/60" : ""
              }`}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary fill-current" />
              ) : (
                <Play className="w-6 h-6 text-primary fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicPlayer;
