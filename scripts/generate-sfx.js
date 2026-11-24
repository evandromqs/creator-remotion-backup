import fs from "fs";
import path from "path";

const SAMPLE_RATE = 44100;

function createWavBuffer(samples) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);

  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // audio format 1 = PCM
  buffer.writeUInt16LE(1, 22);  // num channels = 1 (mono)
  buffer.writeUInt32LE(SAMPLE_RATE, 24); // sample rate
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intVal = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.round(intVal), 44 + i * 2);
  }

  return buffer;
}

// Pseudo-random determinístico para síntese sonora
function makeSeededRandom(seed = 12345) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const outDir = "./public/audio/sfx";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Whoosh Fast (0.35s)
(() => {
  const duration = 0.35;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(101);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.sin(t * Math.PI); // Parábola suave de volume
    const noise = (rnd() * 2 - 1) * 0.7;
    const tone = Math.sin(2 * Math.PI * (150 + 600 * t) * (i / SAMPLE_RATE)) * 0.3;
    samples[i] = (noise + tone) * env * 0.6;
  }
  fs.writeFileSync(path.join(outDir, "whoosh_fast.wav"), createWavBuffer(samples));
})();

// 2. Glitch Digital (0.25s)
(() => {
  const duration = 0.25;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(202);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = 1 - t;
    const step = Math.floor(t * 12);
    const freqs = [880, 440, 1760, 220, 1320, 660, 1980, 330, 1500, 500, 2000, 100];
    const f = freqs[step % freqs.length];
    const wave = Math.sin(2 * Math.PI * f * (i / SAMPLE_RATE)) > 0 ? 0.5 : -0.5;
    const noise = (rnd() * 2 - 1) * 0.3;
    samples[i] = (wave + noise) * env * 0.5;
  }
  fs.writeFileSync(path.join(outDir, "glitch_digital.wav"), createWavBuffer(samples));
})();

// 3. Odometer Tick (0.05s)
(() => {
  const duration = 0.05;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.exp(-t * 25);
    const tone = Math.sin(2 * Math.PI * (900 - 400 * t) * (i / SAMPLE_RATE));
    samples[i] = tone * env * 0.7;
  }
  fs.writeFileSync(path.join(outDir, "odometer_tick.wav"), createWavBuffer(samples));
})();

// 4. Relay Clack (0.12s) - duplo clique mecânico
(() => {
  const duration = 0.12;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(404);

  const clickAt = (startSample, amp) => {
    for (let i = 0; i < 600 && startSample + i < numSamples; i++) {
      const t = i / 600;
      const env = Math.exp(-t * 18);
      const tone = Math.sin(2 * Math.PI * 1200 * (i / SAMPLE_RATE)) * 0.6;
      const noise = (rnd() * 2 - 1) * 0.4;
      samples[startSample + i] += (tone + noise) * env * amp;
    }
  };

  clickAt(0, 0.7);
  clickAt(Math.floor(0.04 * SAMPLE_RATE), 0.85); // Segundo impacto mais forte
  fs.writeFileSync(path.join(outDir, "relay_clack.wav"), createWavBuffer(samples));
})();

// 5. Stamp Heavy (0.35s)
(() => {
  const duration = 0.35;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(505);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.exp(-t * 10);
    const sub = Math.sin(2 * Math.PI * (90 - 40 * t) * (i / SAMPLE_RATE)) * 0.7;
    const noise = (rnd() * 2 - 1) * Math.exp(-t * 30) * 0.5;
    samples[i] = (sub + noise) * env * 0.8;
  }
  fs.writeFileSync(path.join(outDir, "stamp_heavy.wav"), createWavBuffer(samples));
})();

// 6. System Crash (0.45s)
(() => {
  const duration = 0.45;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(606);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = t < 0.8 ? 1 : (1 - t) * 5; // Sustain longo e corte repentino
    const buzz = Math.sin(2 * Math.PI * 130 * (i / SAMPLE_RATE)) > 0 ? 0.6 : -0.6;
    const sub = Math.sin(2 * Math.PI * 65 * (i / SAMPLE_RATE)) * 0.4;
    const noise = (rnd() * 2 - 1) * 0.25;
    samples[i] = (buzz + sub + noise) * env * 0.75;
  }
  fs.writeFileSync(path.join(outDir, "system_crash.wav"), createWavBuffer(samples));
})();

// 7. Scanner Beep (0.2s)
(() => {
  const duration = 0.2;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);

  const p1 = Math.floor(0.06 * SAMPLE_RATE);
  const p2Start = Math.floor(0.09 * SAMPLE_RATE);
  const p2End = Math.floor(0.18 * SAMPLE_RATE);

  for (let i = 0; i < numSamples; i++) {
    if (i < p1) {
      const t = i / p1;
      const env = Math.sin(t * Math.PI);
      samples[i] = Math.sin(2 * Math.PI * 1100 * (i / SAMPLE_RATE)) * env * 0.5;
    } else if (i >= p2Start && i < p2End) {
      const t = (i - p2Start) / (p2End - p2Start);
      const env = Math.sin(t * Math.PI);
      samples[i] = Math.sin(2 * Math.PI * 1650 * (i / SAMPLE_RATE)) * env * 0.6;
    }
  }
  fs.writeFileSync(path.join(outDir, "scanner_beep.wav"), createWavBuffer(samples));
})();

// 8. Moth Flutter (0.35s)
(() => {
  const duration = 0.35;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(808);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.sin(t * Math.PI);
    const flutterMod = Math.sin(2 * Math.PI * 35 * (i / SAMPLE_RATE)); // Batidas de 35Hz
    const noise = (rnd() * 2 - 1) * 0.5;
    samples[i] = noise * (0.5 + 0.5 * flutterMod) * env * 0.45;
  }
  fs.writeFileSync(path.join(outDir, "moth_flutter.wav"), createWavBuffer(samples));
})();

// 9. Spark Zap (0.25s)
(() => {
  const duration = 0.25;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(909);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.exp(-t * 12);
    const tone = Math.sin(2 * Math.PI * (2400 + rnd() * 800) * (i / SAMPLE_RATE)) * 0.5;
    const noise = (rnd() * 2 - 1) * 0.5;
    samples[i] = (tone + noise) * env * 0.65;
  }
  fs.writeFileSync(path.join(outDir, "spark_zap.wav"), createWavBuffer(samples));
})();

// 10. Stamp Vintage (0.25s)
(() => {
  const duration = 0.25;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);
  const rnd = makeSeededRandom(1010);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.exp(-t * 16);
    const thud = Math.sin(2 * Math.PI * (160 - 80 * t) * (i / SAMPLE_RATE)) * 0.7;
    const paper = (rnd() * 2 - 1) * Math.exp(-t * 40) * 0.35;
    samples[i] = (thud + paper) * env * 0.7;
  }
  fs.writeFileSync(path.join(outDir, "stamp_vintage.wav"), createWavBuffer(samples));
})();

// 11. UI Success (0.4s) - Acorde ascendente C5 -> G5
(() => {
  const duration = 0.4;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);

  const t1 = Math.floor(0.15 * SAMPLE_RATE);

  for (let i = 0; i < numSamples; i++) {
    if (i < t1) {
      const t = i / t1;
      const env = Math.sin(t * Math.PI);
      samples[i] = Math.sin(2 * Math.PI * 523.25 * (i / SAMPLE_RATE)) * env * 0.45;
    } else {
      const t = (i - t1) / (numSamples - t1);
      const env = Math.exp(-t * 6);
      const tone1 = Math.sin(2 * Math.PI * 783.99 * (i / SAMPLE_RATE)) * 0.5; // G5
      const tone2 = Math.sin(2 * Math.PI * 1046.50 * (i / SAMPLE_RATE)) * 0.25; // C6
      samples[i] = (tone1 + tone2) * env * 0.5;
    }
  }
  fs.writeFileSync(path.join(outDir, "ui_success.wav"), createWavBuffer(samples));
})();

// 12. Pop CTA (0.15s)
(() => {
  const duration = 0.15;
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const env = Math.exp(-t * 18);
    const freq = 480 * Math.exp(-t * 10) + 120;
    const tone = Math.sin(2 * Math.PI * freq * (i / SAMPLE_RATE));
    samples[i] = tone * env * 0.65;
  }
  fs.writeFileSync(path.join(outDir, "pop_cta.wav"), createWavBuffer(samples));
})();

console.log("✅ 12 SFX procedurais sintetizados com sucesso em public/audio/sfx/!");
