import align from "../data/alignment.json";

export const FPS = 30;

export type Word = {
  text: string;
  cleanText: string;
  start: number;
  end: number;
  f0: number;
  f1: number;
  isAlert: boolean;
};

export type SceneProps = {
  from: number;
  to: number;
};

export interface CaptionGroup {
  id: number;
  words: Word[];
  startFrame: number;
  endFrame: number;
  text: string;
}

const ALERT_WORDS = [
  "einstein",
  "perdido",
  "erraria",
  "quilômetros",
  "guerra",
  "sputnik",
  "doppler",
  "enlouqueceu",
  "relatividade",
  "devagar",
  "rápido",
  "microssegundos",
  "rio",
  "distância",
  "reprogramar",
  "desacelerar",
  "dança",
  "delivery",
];

// Parser determinístico de palavras a partir dos caracteres e timestamps da ElevenLabs
export const words: Word[] = (() => {
  const out: Word[] = [];
  let cur = "";
  let st = 0;
  let en = 0;

  align.characters.forEach((ch, i) => {
    if (ch === " " || ch === "\n") {
      if (cur) {
        out.push(mk(cur, st, en));
        cur = "";
      }
    } else {
      if (!cur) {
        st = align.character_start_times_seconds[i];
      }
      cur += ch;
      en = align.character_end_times_seconds[i];
    }
  });

  if (cur) {
    out.push(mk(cur, st, en));
  }

  return out;
})();

function mk(text: string, start: number, end: number): Word {
  const cleanText = text.toLowerCase().replace(/[^\wÀ-ÿ]/g, "");
  const isAlert = ALERT_WORDS.includes(cleanText);
  return {
    text,
    cleanText,
    start,
    end,
    f0: Math.round(start * FPS),
    f1: Math.round(end * FPS),
    isAlert,
  };
}

/**
 * Retorna o frame absoluto de início (f0) da n-ésima ocorrência de um termo na narração.
 */
export const at = (term: string, nth = 0): number => {
  const cleanTerm = term.toLowerCase().replace(/[^\wÀ-ÿ]/g, "");
  const matches = words.filter(
    (w) =>
      w.text.toLowerCase().includes(term.toLowerCase()) ||
      w.cleanText.includes(cleanTerm)
  );
  return matches[nth]?.f0 ?? 0;
};

/**
 * Retorna o frame absoluto de término (f1) da n-ésima ocorrência de um termo na narração.
 */
export const atEnd = (term: string, nth = 0): number => {
  const cleanTerm = term.toLowerCase().replace(/[^\wÀ-ÿ]/g, "");
  const matches = words.filter(
    (w) =>
      w.text.toLowerCase().includes(term.toLowerCase()) ||
      w.cleanText.includes(cleanTerm)
  );
  return matches[nth]?.f1 ?? 0;
};

// Índices exatos das palavras de início de cada uma das 16 cenas de "A Origem do GPS"
export const SCENE_WORD_INDICES = [
  0,   // S01: "Você abre o mapa no celular..."
  16,  // S02: "Sem a física moderna, o seu GPS..."
  35,  // S03: "Tudo começou em mil novecentos e cinquenta e sete..."
  53,  // S04: "Cientistas perceberam que o sinal de rádio..."
  70,  // S05: "A sacada genial foi: se sabemos a órbita..."
  88,  // S06: "Assim nasceu o projeto GPS: uma constelação..."
  108, // S07: "Dentro de cada um, um relógio atômico..."
  126, // S08: "Mas quando os primeiros satélites subiram..."
  137, // S09: "A teoria da relatividade de Einstein prevê..."
  164, // S10: "Segundo: longe da gravidade pesada..."
  181, // S11: "O resultado dessa conta cósmica?..."
  200, // S12: "Parece pouco? Multiplicado pela velocidade..."
  223, // S13: "Engenheiros militares tiveram que reprogramar..."
  241, // S14: "Em mil novecentos e oitenta e três, o governo..."
  262, // S15: "Hoje, do seu pedido de comida aos aviões..."
  278, // S16: "Sabia que Einstein guia o seu delivery?..."
];

export const TOTAL_COMPOSITION_FRAMES = 3405; // ~113.5s (@ 30fps)

/**
 * Retorna o intervalo exato de frames { from, to, duration } para uma cena de 1 a 16.
 */
export const sceneRange = (
  n: number
): { from: number; to: number; duration: number } => {
  const idx = Math.max(1, Math.min(16, Math.floor(n))) - 1;
  const startWordIdx = SCENE_WORD_INDICES[idx];
  const from = words[startWordIdx].f0;

  let to: number;
  if (idx === 15) {
    to = TOTAL_COMPOSITION_FRAMES;
  } else {
    const nextStartWordIdx = SCENE_WORD_INDICES[idx + 1];
    to = words[nextStartWordIdx].f0;
  }

  return {
    from,
    to,
    duration: to - from,
  };
};

/**
 * Grupos de Legendas Karaoke Pré-calculados (2 a 3 palavras para ritmo veloz)
 */
export const captionGroups: CaptionGroup[] = (() => {
  const groups: CaptionGroup[] = [];
  let currentGroupWords: Word[] = [];
  let groupId = 0;

  words.forEach((w, idx) => {
    currentGroupWords.push(w);

    const hasPunctuation = /[.,?!:;"]$/.test(w.text);
    const reachedLimit = currentGroupWords.length >= 3;
    const isLastWord = idx === words.length - 1;

    if ((hasPunctuation && currentGroupWords.length >= 2) || reachedLimit || isLastWord) {
      const startFrame = currentGroupWords[0].f0;
      const nextWord = words[idx + 1];
      const endFrame = nextWord ? nextWord.f0 : currentGroupWords[currentGroupWords.length - 1].f1 + 8;

      groups.push({
        id: groupId++,
        words: [...currentGroupWords],
        startFrame,
        endFrame,
        text: currentGroupWords.map((cw) => cw.text).join(" "),
      });
      currentGroupWords = [];
    }
  });

  if (currentGroupWords.length > 0) {
    const startFrame = currentGroupWords[0].f0;
    const endFrame = currentGroupWords[currentGroupWords.length - 1].f1 + 8;
    groups.push({
      id: groupId++,
      words: currentGroupWords,
      startFrame,
      endFrame,
      text: currentGroupWords.map((cw) => cw.text).join(" "),
    });
  }

  return groups;
})();

/**
 * Beats de impacto sincronizados com a locução do GPS
 */
export const beats = {
  hookEinstein: at("Einstein", 0),
  desvio11km: at("onze", 0),
  sputnik: at("Sputnik", 0),
  doppler: at("Doppler", 0),
  genial: at("genial", 0),
  constelacao: at("constelação", 0),
  relogioAtomico: at("atômico", 0),
  enlouqueceu: at("enlouqueceu", 0),
  relatividade: at("relatividade", 0),
  menosSete: at("sete", 0),
  maisQuarentaECinco: at("quarenta", 0),
  trintaEOito: at("trinta", 0),
  rio: at("rio", 0),
  reprogramar: at("reprogramar", 0),
  liberou: at("liberou", 0),
  delivery: at("delivery", 0),
};
