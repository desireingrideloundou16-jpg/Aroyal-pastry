// Synthétise une musique de fond originale (libre de droits) en WAV stéréo.
// Usage : node music.mjs <sortie.wav> <durée_secondes>
import fs from "node:fs";

const [out, durArg = "72"] = process.argv.slice(2);
const SR = 44100, DUR = Number(durArg), N = Math.floor(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const BPM = 100, BEAT = 60 / BPM, BAR = BEAT * 4;
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

// Progression (MIDI) : Fmaj9 – Dm9 – Bbmaj9 – C6/9 … couleur « pâtisserie chic »
const CHORDS = [
  { root: 41, tones: [53, 57, 60, 64, 67] },
  { root: 38, tones: [50, 53, 57, 60, 64] },
  { root: 46, tones: [50, 53, 57, 58, 62] },
  { root: 48, tones: [52, 55, 57, 60, 62] },
];
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function add(buf, start, len, fn, gain) {
  const s0 = Math.max(0, Math.floor(start * SR)), s1 = Math.min(N, s0 + Math.floor(len * SR));
  for (let i = s0; i < s1; i++) buf[i] += fn((i - s0) / SR) * gain;
}
const both = (start, len, fn, g, pan = 0) => { add(L, start, len, fn, g * (1 - pan) ); add(R, start, len, fn, g * (1 + pan)); };

// Piano électrique : fondamentale + tine aigu, décroissance exponentielle
const ep = f => t => {
  const a = Math.min(1, t / 0.004);
  return a * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2.6)
    + 0.35 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 4)
    + 0.12 * Math.sin(2 * Math.PI * f * 7.1 * t) * Math.exp(-t * 18));
};
const pad = f => t => Math.min(1, t / 0.9) * Math.min(1, (BAR - t) / 0.5) *
  (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.003 * t + 1) + 0.25 * Math.sin(2 * Math.PI * f * 2.001 * t));
const bass = f => t => Math.min(1, t / 0.01) * Math.exp(-t * 1.6) * (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t));
const kick = t => Math.exp(-t * 18) * Math.sin(2 * Math.PI * (48 + 90 * Math.exp(-t * 35)) * t);
const shaker = () => { let lp = 0; return t => { const n = rnd() * 2 - 1; const hp = n - lp; lp += 0.35 * (n - lp); return hp * Math.exp(-t * 38); }; };
const snap = () => { let lp = 0; return t => { const n = rnd() * 2 - 1; lp += 0.5 * (n - lp); return (lp * 0.8 + 0.4 * Math.sin(2 * Math.PI * 190 * t)) * Math.exp(-t * 22); }; };

const bars = Math.ceil(DUR / BAR);
const ARP = [0, 2, 1, 3, 4, 3, 2, 1]; // motif de croches
for (let b = 0; b < bars; b++) {
  const c = CHORDS[b % 4], t0 = b * BAR;
  const intro = b < 2, full = b >= 2;
  c.tones.forEach((m, i) => both(t0, BAR, pad(hz(m)), 0.018, (i - 2) * 0.15));
  ARP.forEach((idx, k) => {
    const m = c.tones[idx] + 12 * (k === 4 && b % 2 ? 1 : 0);
    both(t0 + k * BEAT / 2, 1.6, ep(hz(m)), intro ? 0.05 : 0.07, k % 2 ? 0.35 : -0.35);
  });
  if (full) {
    both(t0, BEAT * 1.8, bass(hz(c.root)), 0.16);
    both(t0 + BEAT * 2.5, BEAT * 1.2, bass(hz(c.root + 7)), 0.11);
    for (let k = 0; k < 4; k++) if (k % 2 === 0) both(t0 + k * BEAT, 0.4, kick, 0.22);
    for (let k = 0; k < 4; k++) if (k % 2 === 1) both(t0 + k * BEAT, 0.3, snap(), 0.07);
    for (let k = 0; k < 8; k++) both(t0 + k * BEAT / 2 + (k % 2 ? 0.012 : 0), 0.12, shaker(), k % 2 ? 0.05 : 0.028, k % 2 ? 0.4 : -0.4);
  }
}

// Écho stéréo croisé (espace) puis fondus d'entrée/sortie et normalisation douce
const D = Math.floor(SR * BEAT * 0.75);
for (let i = D; i < N; i++) { L[i] += R[i - D] * 0.28; R[i] += L[i - D] * 0.28; }
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, g = Math.min(1, t / 1.2) * Math.min(1, (DUR - t) / 3.5);
  L[i] = Math.tanh(L[i] * 1.1) * g; R[i] = Math.tanh(R[i] * 1.1) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
fs.writeFileSync(out, buf);
console.log("musique écrite :", out, DUR + "s");
