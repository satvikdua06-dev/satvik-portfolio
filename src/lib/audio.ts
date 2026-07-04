/**
 * Ambient audio layer — everything is synthesized with WebAudio, no files.
 * Off by default; the HUD toggle enables it. All gains are deliberately low.
 */

let ctx: AudioContext | null = null;
let enabled = false;
let humOscs: OscillatorNode[] = [];
let humGain: GainNode | null = null;
const listeners = new Set<(on: boolean) => void>();

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) {
      console.warn("Web Audio API is not supported in this browser.");
      return null;
    }
    ctx = new AC();
    console.log("Web Audio: AudioContext created. State:", ctx.state);
  }
  if (ctx.state === "suspended") {
    console.log("Web Audio: AudioContext is suspended, attempting to resume...");
    ctx.resume()
      .then(() => {
        console.log("Web Audio: AudioContext resumed successfully. State:", ctx?.state);
      })
      .catch((err) => {
        console.error("Web Audio: Failed to resume AudioContext:", err);
      });
  }
  return ctx;
}

function blip(freq: number, dur: number, gain: number, type: OscillatorType = "square", when = 0) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function startHum() {
  const c = ensureCtx();
  if (!c || humOscs.length > 0) return;

  humGain = c.createGain();
  humGain.gain.setValueAtTime(0.0001, c.currentTime);
  // Fade in the hum over 1.5s to 0.32 gain level
  humGain.gain.exponentialRampToValueAtTime(0.32, c.currentTime + 1.5);

  // Fundamental frequency at 55Hz (sine) - deep sub-bass for subwoofers/headphones
  const osc1 = c.createOscillator();
  const g1 = c.createGain();
  osc1.type = "sine";
  osc1.frequency.value = 55;
  g1.gain.value = 0.55;
  osc1.connect(g1).connect(humGain);

  // First harmonic at 110Hz (triangle) - warm, easily audible on laptop speakers
  const osc2 = c.createOscillator();
  const g2 = c.createGain();
  osc2.type = "triangle";
  osc2.frequency.value = 110;
  g2.gain.value = 0.28;
  osc2.connect(g2).connect(humGain);

  // Second harmonic at 165Hz (sine) - adds harmonic warmth
  const osc3 = c.createOscillator();
  const g3 = c.createGain();
  osc3.type = "sine";
  osc3.frequency.value = 165;
  g3.gain.value = 0.12;
  osc3.connect(g3).connect(humGain);

  // Slow amplitude drift so the hum breathes instead of droning
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.15;
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(humGain.gain);

  humGain.connect(c.destination);

  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();

  humOscs = [osc1, osc2, osc3, lfo];
}

function stopHum() {
  if (!ctx || humOscs.length === 0 || !humGain) return;

  humGain.gain.setValueAtTime(humGain.gain.value, ctx.currentTime);
  humGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

  const oscsToStop = [...humOscs];
  setTimeout(() => {
    oscsToStop.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // ignore
      }
    });
  }, 500);

  humOscs = [];
  humGain = null;
}

export const sfx = {
  isEnabled: () => enabled,
  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  toggle() {
    enabled = !enabled;
    if (enabled) {
      startHum();
      sfx.confirm();
    } else {
      stopHum();
    }
    listeners.forEach((fn) => fn(enabled));
  },
  /** Short UI tick — pointer presses on interactive elements. */
  click() {
    if (!enabled) return;
    blip(2400, 0.04, 0.18);
  },
  /** Two-tone confirm — meaningful completions (toggle on, palette action). */
  confirm() {
    if (!enabled) return;
    blip(880, 0.09, 0.22, "sine");
    blip(1320, 0.12, 0.22, "sine", 0.09);
  },
};
