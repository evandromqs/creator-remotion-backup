import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "yl2ZDV1MzN4HbQJbMihG";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY missing");
  process.exit(1);
}

const scenesDef = [
  {
    id: "hook",
    component: "HedyHook",
    text: "O Bluetooth do seu fone de ouvido existe graças a uma atriz de Hollywood e um piano.",
  },
  {
    id: "torpedo",
    component: "TorpedoJam",
    text: "Em 1942, na Segunda Guerra Mundial, a estrela Hedy Lamarr descobriu que torpedos guiados por rádio podiam ser facilmente bloqueados pelo inimigo.",
  },
  {
    id: "piano",
    component: "PianoIdea",
    text: "Junto com o compositor George Antheil, ela criou um sistema genial inspirado em um piano mecânico perfurado.",
  },
  {
    id: "hopping",
    component: "FrequencyHopping",
    text: "O sinal saltava entre 88 frequências diferentes em sincronia, tornando impossível interceptar ou travar o torpedo.",
  },
  {
    id: "bluetooth",
    component: "NavyToBluetooth",
    text: "A Marinha engavetou a patente na época, mas décadas depois esse salto de frequência virou a base do Bluetooth e da conexão sem fio.",
  },
  {
    id: "cta",
    component: "EvandroLabCta",
    text: "E aí, você já sabia que uma atriz ajudou a criar o seu fone sem fio? Comenta aqui embaixo o que achou e segue o canal Evandro Lab para mais histórias!",
  },
];

const fullText = scenesDef.map((s) => s.text).join(" ");

const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "xi-api-key": API_KEY,
  },
  body: JSON.stringify({
    text: fullText,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.15,
      use_speaker_boost: true,
    },
  }),
});

if (!res.ok) {
  const txt = await res.text();
  console.error("ElevenLabs error:", res.status, txt);
  process.exit(1);
}

const data = await res.json();
const audioBuf = Buffer.from(data.audio_base64, "base64");
fs.writeFileSync(path.resolve(process.cwd(), "public/hedy_narracao.mp3"), audioBuf);

const { characters, character_start_times_seconds, character_end_times_seconds } = data.alignment;
const FPS = 30;

// Reconstruct words with exact start/end frames
const words = [];
let curWord = "";
let curStart = null;
let curEnd = null;

for (let i = 0; i < characters.length; i++) {
  const ch = characters[i];
  const st = character_start_times_seconds[i];
  const en = character_end_times_seconds[i];
  if (/\s/.test(ch)) {
    if (curWord.length > 0) {
      words.push({
        text: curWord,
        from: Math.round(curStart * FPS),
        to: Math.max(Math.round(curStart * FPS) + 1, Math.round(curEnd * FPS)),
        highlight: false,
      });
      curWord = "";
      curStart = null;
      curEnd = null;
    }
  } else {
    if (curStart === null) curStart = st;
    curEnd = en;
    curWord += ch;
  }
}
if (curWord.length > 0) {
  words.push({
    text: curWord,
    from: Math.round(curStart * FPS),
    to: Math.max(Math.round(curStart * FPS) + 1, Math.round(curEnd * FPS)),
    highlight: false,
  });
}

const totalSec = character_end_times_seconds[character_end_times_seconds.length - 1] || 0;
const totalFrames = Math.ceil((totalSec + 0.6) * FPS);

// Map words into each scene based on word counts
let cursor = 0;
const scenes = [];
for (let sIdx = 0; sIdx < scenesDef.length; sIdx++) {
  const def = scenesDef[sIdx];
  const expectedCount = def.text.trim().split(/\s+/).length;
  const slice = words.slice(cursor, cursor + expectedCount);
  cursor += expectedCount;

  const from = sIdx === 0 ? 0 : slice[0]?.from ?? scenes[sIdx - 1].from + scenes[sIdx - 1].durationInFrames;
  const nextWord = words[cursor];
  const endFrame = nextWord ? nextWord.from : totalFrames;

  scenes.push({
    id: def.id,
    index: sIdx + 1,
    component: def.component,
    from,
    durationInFrames: Math.max(30, endFrame - from),
    narration: def.text,
    captions: slice,
  });
}

// Ensure contiguous scenes from 0 to totalFrames
for (let i = 0; i < scenes.length - 1; i++) {
  scenes[i].durationInFrames = scenes[i + 1].from - scenes[i].from;
}
const last = scenes[scenes.length - 1];
last.durationInFrames = totalFrames - last.from;

const outJson = {
  meta: {
    title: "Hedy Lamarr e o Bluetooth",
    channel: "Evandro Lab",
    language: "pt-BR",
    width: 1080,
    height: 1920,
    fps: FPS,
    durationInFrames: totalFrames,
    durationSec: Number((totalFrames / FPS).toFixed(2)),
    composition: "HedyBluetooth",
  },
  audio: {
    narration: { src: "public/hedy_narracao.mp3", volume: 1 },
  },
  scenes,
};

fs.writeFileSync(path.resolve(process.cwd(), "src/data/hedy_scenes.json"), JSON.stringify(outJson, null, 2));
console.log(`Generated audio (${totalSec.toFixed(2)}s / ${totalFrames}f) and ${scenes.length} scenes!`);
for (const s of scenes) {
  console.log(`- ${s.id} (${s.component}): from=${s.from} dur=${s.durationInFrames} words=${s.captions.length}`);
}
