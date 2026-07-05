/**
 * Procedural instrumentation ambience — Web Audio synthesis, no samples.
 *
 * Layers:
 *  1. Room tone: two detuned triangle waves through a lowpass filter whose cutoff breathes on
 *     a ~28s LFO. Shifted base frequency to E2 (82Hz) and raised filter cutoff to 280Hz
 *     to allow warm mid-bass harmonics to project clearly on laptop speakers.
 *  2. Depth-linked pitch: the drone fundamental slides down a few Hz as the
 *     visitor descends the page (fed by the HUD's scroll progress).
 *  3. Tactile UI ticks: a clean 35ms sine blip at 1200Hz, mixed softly to match ear sensitivity.
 *  4. Sonar ping for waypoint activation: sine with a fast downward pitch
 *     envelope through a short feedback delay for the tail.
 */

interface Bed {
  ctx: AudioContext;
  master: GainNode;
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  delaySend: GainNode;
}

const BASE_F = 82; // drone fundamental at E2 (warm bass, audible on small speakers)
const DETUNE = 2.5; // Hz between the two oscillators
const DEPTH_DROP = 8; // Hz shed by full descent

let bed: Bed | null = null;
let enabled = false;
let depth = 0; // last known scroll depth 0..1
let volume = 0.65; // master volume level
let suspendTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<(on: boolean) => void>();

function buildBed(): Bed | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // --- layer 1+2: the drone ---
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.55; // Raised significantly for rich hum presence

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 280; // Raised to let warm low-mid harmonics project
  filter.Q.value = 0.8;

  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  oscA.type = "triangle";
  oscB.type = "triangle";
  oscA.frequency.value = BASE_F;
  oscB.frequency.value = BASE_F + DETUNE;
  
  oscA.connect(droneGain);
  oscB.connect(droneGain);
  droneGain.connect(filter);
  filter.connect(master);

  // cutoff breathes on a ~28s cycle
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 1 / 28;
  lfoGain.gain.value = 80; // Modulates filter frequency between 200Hz and 360Hz
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  oscA.start();
  oscB.start();
  lfo.start();

  // --- ping tail: short feedback delay ---
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.11;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const delaySend = ctx.createGain();
  delaySend.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  return { ctx, master, oscA, oscB, delaySend };
}

function rampMaster(target: number) {
  if (!bed) return;
  const g = bed.master.gain;
  const t = bed.ctx.currentTime;
  g.cancelScheduledValues(t);
  g.setValueAtTime(g.value, t);
  g.linearRampToValueAtTime(target * volume, t + 0.3);
}

function applyDepth() {
  if (!bed) return;
  const t = bed.ctx.currentTime;
  const f = BASE_F - depth * DEPTH_DROP;
  bed.oscA.frequency.setTargetAtTime(f, t, 0.6);
  bed.oscB.frequency.setTargetAtTime(f + DETUNE, t, 0.6);
}

/** Synthesize a clean, short sinusoidal blip for tactile feedback. */
function playTick(freq = 1200, dur = 0.035, gain = 0.04) {
  if (!enabled || !bed) return;
  if (bed.ctx.state === "suspended") {
    void bed.ctx.resume();
  }
  const { ctx, master } = bed;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  isEnabled: () => enabled,
  getVolume: () => volume,
  setVolume(v: number) {
    volume = Math.min(1, Math.max(0, v));
    if (enabled && bed) {
      const g = bed.master.gain;
      const t = bed.ctx.currentTime;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(volume, t + 0.1);
    }
    listeners.forEach((fn) => fn(enabled));
  },

  subscribe(fn: (on: boolean) => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },

  toggle() {
    enabled = !enabled;
    if (enabled) {
      if (!bed) bed = buildBed();
      if (!bed) {
        enabled = false;
        return;
      }
      if (suspendTimer) {
        clearTimeout(suspendTimer);
        suspendTimer = null;
      }
      void bed.ctx.resume();
      applyDepth();
      rampMaster(1);
      sfx.confirm();
    } else if (bed) {
      rampMaster(0);
      const b = bed;
      suspendTimer = setTimeout(() => void b.ctx.suspend(), 400);
    }
    listeners.forEach((fn) => fn(enabled));
  },

  /** Feed the drone the current scroll depth (0..1). */
  setDepth(p: number) {
    depth = Math.min(1, Math.max(0, p));
    if (enabled) applyDepth();
  },

  /** Tactical UI click feedback. */
  click() {
    playTick(1200, 0.035, 0.04);
  },

  /** Two-tone confirmation chime. */
  confirm() {
    if (!enabled || !bed) return;
    if (bed.ctx.state === "suspended") {
      void bed.ctx.resume();
    }
    const { ctx, master } = bed;
    const t = ctx.currentTime;
    
    // First tone
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, t);
    g1.gain.setValueAtTime(0.04, t);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc1.connect(g1).connect(master);
    osc1.start(t);
    osc1.stop(t + 0.1);

    // Second tone, slightly staggered and higher pitch
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, t + 0.07);
    g2.gain.setValueAtTime(0.04, t + 0.07);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.07 + 0.1);
    osc2.connect(g2).connect(master);
    osc2.start(t + 0.07);
    osc2.stop(t + 0.07 + 0.12);
  },

  /** Sonar ping — waypoint activations on the descent path. */
  ping() {
    if (!enabled || !bed) return;
    if (bed.ctx.state === "suspended") {
      void bed.ctx.resume();
    }
    const { ctx, master, delaySend } = bed;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1150, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.3);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(g);
    g.connect(master);
    g.connect(delaySend);
    osc.start(t);
    osc.stop(t + 0.4);
  },

  /** Tear down entirely. */
  dispose() {
    if (suspendTimer) clearTimeout(suspendTimer);
    if (bed) void bed.ctx.close();
    bed = null;
    enabled = false;
  },
};
