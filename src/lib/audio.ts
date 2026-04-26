/**
 * Shared audio utilities. All synthesized sounds route through a single
 * masterGain node so the global mute/volume control affects everything,
 * and a single "current trigger" reference ensures only one short sound
 * plays at a time with smooth fade-in / fade-out (no abrupt cuts).
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
};

export const getMasterGain = (): GainNode => {
  const ctx = getAudioContext();
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
};

/** Set master volume 0..1, with smooth ramp. */
export const setMasterVolume = (v: number) => {
  const ctx = getAudioContext();
  const g = getMasterGain();
  g.gain.cancelScheduledValues(ctx.currentTime);
  g.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.15);
};

type ActiveSound = {
  osc: OscillatorNode;
  gain: GainNode;
  stopAt: number;
};

let activeTrigger: ActiveSound | null = null;

/**
 * Play a short tone exclusive to "trigger" interactions (story chips,
 * gallery, word hovers). Any prior trigger fades out smoothly first.
 */
export const playTrigger = (
  frequency: number,
  options: {
    waveform?: OscillatorType;
    duration?: number;
    peak?: number;
    attack?: number;
  } = {},
): (() => void) => {
  const { waveform = "sine", duration = 2.5, peak = 0.18, attack = 0.2 } = options;
  const ctx = getAudioContext();
  const master = getMasterGain();

  // Fade out any currently playing trigger
  if (activeTrigger) {
    const { osc, gain } = activeTrigger;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.25);
    try {
      osc.stop(now + 0.3);
    } catch {
      /* noop */
    }
    activeTrigger = null;
  }

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  gain.connect(master);

  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = frequency;
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + duration + 0.05);

  const sound: ActiveSound = { osc, gain, stopAt: now + duration };
  activeTrigger = sound;

  osc.onended = () => {
    if (activeTrigger === sound) activeTrigger = null;
  };

  // Returns a manual stop fn (with fade) for components that want it.
  return () => {
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.25);
    try {
      osc.stop(t + 0.3);
    } catch {
      /* noop */
    }
    if (activeTrigger === sound) activeTrigger = null;
  };
};
