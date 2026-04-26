import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { setMasterVolume } from "@/lib/audio";

const SoundControls = () => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showSlider, setShowSlider] = useState(false);

  const apply = (v: number, mute: boolean) => {
    setMasterVolume(mute ? 0 : v / 100);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    apply(volume, next);
  };

  const handleVolume = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (muted && v > 0) setMuted(false);
    apply(v, false);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {showSlider && (
        <div className="w-24 animate-fade-in">
          <Slider
            value={[muted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolume}
            className="[&_[data-slot=track]]:h-1 [&_[data-slot=thumb]]:w-3 [&_[data-slot=thumb]]:h-3"
          />
        </div>
      )}
      <button
        onClick={toggleMute}
        className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 box-glow-sm"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SoundControls;
