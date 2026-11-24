import fs from "fs";
import path from "path";

const align = JSON.parse(fs.readFileSync("src/data/alignment.json", "utf8"));
const FPS = 30;
const words = [];
let cur = "", st = 0, en = 0;

align.characters.forEach((ch, i) => {
  if (ch === " " || ch === "\n") {
    if (cur) words.push({ text: cur, start: st, end: en, f0: Math.round(st * FPS), f1: Math.round(en * FPS) });
    cur = "";
  } else {
    if (!cur) st = align.character_start_times_seconds[i];
    cur += ch;
    en = align.character_end_times_seconds[i];
  }
});
if (cur) words.push({ text: cur, start: st, end: en, f0: Math.round(st * FPS), f1: Math.round(en * FPS) });

const sceneWordStarts = [
  0,   // S1: Você já se perguntou
  13,  // S2: A resposta não nasceu
  27,  // S3: Na Universidade de Harvard
  50,  // S4: No dia 9 de setembro
  60,  // S5: Os cálculos falharam
  73,  // S6: A cientista pioneira Grace Hopper
  99,  // S7: Presa entre os contatos
  109, // S8: Atraída pelo calor
  121, // S9: Com uma pinça
  149, // S10: A partir daquele dia
  173, // S11: Dos relés gigantes
  188  // S12: E aí, quantos bugs
];

console.log("=== COMPARAÇÃO COM PLANEJAMENTO ===");
sceneWordStarts.forEach((wIdx, i) => {
  const nextWIdx = sceneWordStarts[i+1] !== undefined ? sceneWordStarts[i+1] - 1 : words.length - 1;
  const startWord = words[wIdx];
  const endWord = words[nextWIdx];
  const fromFrame = startWord.f0;
  const toFrame = i === 11 ? 2330 : words[sceneWordStarts[i+1]].f0;
  const duration = toFrame - fromFrame;
  console.log(`Cena ${(i+1).toString().padStart(2, "0")}: [f${fromFrame.toString().padStart(4, " ")} -> f${toFrame.toString().padStart(4, " ")}] (dur=${duration.toString().padStart(3, " ")} frames, ${(duration/30).toFixed(2)}s) | "${startWord.text} ... ${endWord.text}"`);
});
