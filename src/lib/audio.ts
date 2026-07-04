/**
 * Ambient audio layer — everything is synthesized with WebAudio, no files.
 * Off by default; the HUD toggle enables it. All gains are deliberately low.
 */

let ctx: AudioContext | null = null;
let enabled = false;
let humOsc: OscillatorNode | null = null;
let humGain: GainNode | null = null;
const listeners = new Set<(on: boolean) => void>();

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
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
  if (!c || humOsc) return;
  humOsc = c.createOscillator();
  humGain = c.createGain();
  humOsc.type = "sine";
  humOsc.frequency.value = 52;
  humGain.gain.setValueAtTime(0.0001, c.currentTime);
  humGain.gain.exponentialRampToValueAtTime(0.014, c.currentTime + 1.2);
  // Slow amplitude drift so the hum breathes instead of droning
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.11;
  lfoGain.gain.value = 0.004;
  lfo.connect(lfoGain).connect(humGain.gain);
  lfo.start();
  humOsc.connect(humGain).connect(c.destination);
  humOsc.start();
}

function stopHum() {
  if (!ctx || !humOsc || !humGain) return;
  humGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  const osc = humOsc;
  setTimeout(() => osc.stop(), 500);
  humOsc = null;
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
    blip(2400, 0.04, 0.035);
  },
  /** Two-tone confirm — meaningful completions (toggle on, palette action). */
  confirm() {
    if (!enabled) return;
    blip(880, 0.09, 0.05, "sine");
    blip(1320, 0.12, 0.05, "sine", 0.09);
  },
};
