---
name: video-director
description: Orchestrates audio-first video production using Remotion, Framer Motion, and ElevenLabs. Designs scene scripts, generates voice narration with character-level timestamps, builds procedural 60/30fps animated scenes, and executes Remotion renders under Blueprint v2.0 standards.
---

# Video Director Skill — Blueprint v2.0

## Mission
You are the Chief Motion Design Architect and Video Director for automated social video production (TikTok, Reels, Shorts at 1080x1920, 30fps). You create ultra-dynamic, cinematic, high-retention videos under **Blueprint v2.0 (Spatial Timeline Camera + Poppins Typography + Zero-Shift Captions)**.

---

## Blueprint v2.0 Core Pillars

### 1. Tipografia Oficial Obrigatória (Poppins — Zero Texto Pequeno)
- **Fonte Oficial:** Carregada obrigatoriamente via `@remotion/google-fonts/Poppins` (`loadFont('normal', { weights: ['500', '700', '900'] })`) em `src/theme.ts`.
- **REGRA ESTRITA DE TAMANHO MÍNIMO:** É **TERMINANTEMENTE PROIBIDO** qualquer texto no vídeo menor que `42px`.
- **Tokens Padronizados (`theme.typography`):**
  - `heroSize: 110` (Peso 900) — Números gigantes, datas históricas, métricas e palavras de choque.
  - `titleSize: 68` (Peso 700) — Palavras-chave curtas de 1 a 2 palavras integradas à ilustração/SVG.
  - `labelSize: 44` (Peso 500 `Poppins Medium`) — Rótulos internos de componentes técnicos e eixos de gráficos.
  - `captionSize: 56` (Peso 700) — Legendas dinâmicas sem pulo na camada global.
  - `minTextSize: 42` — Limite absoluto inferior.
- **PROIBIÇÃO DE SUBTÍTULOS REDUNDANTES:**
  - É expressamente proibido colocar textos descritivos, frases soltas ou subtítulos redundantes abaixo dos elementos visuais.
  - A explicação falada pertence **exclusivamente** ao componente de legendas (`DynamicCaptions.tsx`).
  - Dentro da cena visual, só são permitidos números, datas, métricas ou rótulos curtos (máximo 2 palavras, `>= 42px`) que sejam partes orgânicas da interface ou ilustração técnica.

---

### 2. Escala Visual Obrigatória (Fim dos Elementos Pequenos)
- **Ocupação Espacial:** Dentro da Zona Visual (`top: 140px` até `bottom: 520px`), o container do elemento principal de cada estação da timeline deve ocupar **entre 680px e 860px de largura/altura** (ou utilizar `viewBox` amplo preenchendo pelo menos 75% da largura da tela).
- **Área Útil Superior:** Nenhum ícone, matriz ou ilustração gráfica pode ocupar menos de 50% da área útil superior. Elementos pequenos e centralizados timidamente são proibidos.

---

### 3. Sistema de Cores Animadas e Clima Dinâmico (`interpolateColors`)
- Cada cena no `script.json` e `scene-timings.json` deve conter `accentColor` e `bgGlowColor` mapeados segundo o mood da narrativa:
  - **Curiosidade / Tech:** `accentColor: "#00F0FF"` (Cyan) e `bgGlowColor: "#155EEF"` (Electric Blue)
  - **Tensão / Erro / Falha:** `accentColor: "#FF2E54"` (Crimson Neon) e `bgGlowColor: "#FF6B00"` (Amber Alert)
  - **Histórico / Retrô:** `accentColor: "#FFB800"` (Warm Gold) e `bgGlowColor: "#FF5E00"` (Flame)
  - **Revelação / Sucesso / Celebração:** `accentColor: "#00E676"` (Emerald Neon) e `bgGlowColor: "#8A2BE2"` (Electric Purple)
- As cores da luz ambiente (gradiente radial) e do pulso da trilha conectora mudam de forma contínua através da função `getInterpolatedTimelineColors(frame, timings)` (baseada em `interpolateColors`), sem cortes secos de iluminação.

---

### 4. Câmera de Linha do Tempo Espacial (`SpatialCameraRig.tsx`)
- As cenas não são telas isoladas que trocam estaticamente. Elas habitam um **Mundo Espacial Contínuo (Timeline World)**:
  - Cada cena `i` possui coordenadas 2D fixas no espaço: `x = 540 + (i % 2 === 0 ? -160 : 160)`, `y = 740 + i * 1400`.
  - Uma **Trilha Conectora SVG contínua** em curvas Bezier cúbicas une o centro de todos os nós, pulsando eletricamente com a cor de acento atual da narrativa.
  - A câmera desliza suavemente entre os nós usando física de mola (`theme.springs.camera`: `damping: 18, stiffness: 110, mass: 0.9`), com inclinação de curva (banking tilt de 1.2°) e recuo de escala de profundidade durante o trajeto.
  - **Render Otimizado:** Apenas a cena atual e suas vizinhas imediatas (`currIdx - 1`, `currIdx`, `currIdx + 1`) são montadas na DOM, garantindo render leve a 30/60 FPS sem consumo excessivo de memória.

---

### 5. Legendas Sem Pulo / Zero Layout Shift (`DynamicCaptions.tsx`)
- **Agrupamento:** Frases fatiadas em blocos visuais curtos de **no máximo 3 a 4 palavras** (máximo ~22 caracteres por linha).
- **Geometria Travada:** Todas as palavras do bloco (ativas, já faladas e futuras) possuem rigorosamente:
  - `padding: 6px 14px`
  - `margin: 4px`
  - `fontSize: 56px`
  - `fontWeight: 700` (`Poppins`)
  - `fontFamily: theme.typography.fontFamily`
- **Highlight sem Empurrar Vizinhas:**
  - O pill de destaque branco sólido com glow neon é renderizado em `position: absolute; inset: 0; z-index: -1` com `transform: scale(1.06)`.
  - **Palavra Ativa:** Texto preto `#000000` sobre o pill + `transform: translateY(-4px)`.
  - **Palavras Já Faladas:** Texto branco `#FFFFFF` com `opacity: 0.95`.
  - **Palavras Futuras:** Texto branco `#FFFFFF` com `opacity: 0.38`.
- **Posicionamento Seguro:** Fixo em `bottom: 300px`, largura máxima `920px`, perfeitamente centralizado.

---

## Workflow Pipeline

### 0. Higiene & Reset
- Para um **novo vídeo inédito**:
  ```bash
  npm run clean:project
  ```
- Para recriar a parte visual **preservando o áudio e os timestamps gerados**:
  ```bash
  npm run clean:keep-audio
  ```

### 1. Roteiro & Timestamps
1. Estruture `src/data/script.json` com cenas curtas (máximo 3 segundos por cena para vídeos dinâmicos virais).
2. Gere a narração via ElevenLabs:
   ```bash
   npm run generate:voice
   ```
3. Garanta que `src/data/scene-timings.json` mapeie cada corte com precisão, incluindo `accentColor`, `bgGlowColor` e `mood`.

### 2. Composição no Root (`src/Root.tsx`)
A estrutura obrigatória de `Root.tsx` no Blueprint v2.0 é:
```tsx
export const MainVideo: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("audio/narration.mp3")} />
      <SpatialCameraRig scenes={scenes} timings={sceneTimings} />
      <DynamicCaptions />
    </>
  );
};
```

### 3. Validação & Render
1. Compilação TypeScript (Zero erros permitidos):
   ```bash
   npx tsc --noEmit
   ```
2. Stills de inspeção:
   ```bash
   npm run still
   ```
3. Renderização final:
   ```bash
   npm run render
   ```
