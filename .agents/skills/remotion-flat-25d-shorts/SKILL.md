---
name: remotion-flat-25d-shorts
description: Padrão oficial para criação e renderização de vídeos verticais 9:16 (Shorts/Reels/TikTok) em Remotion com estética Solid Flat Colors 2.5D, primitivas SVG extrudadas e isométricas, sincronia palavra por palavra com a narração, enquadramento central de 50% na área segura e legendas na área segura inferior do Instagram. Use sempre que o usuário pedir para criar, animar ou renderizar vídeos explicativos/educativos em Remotion nesse formato.
---

# Remotion Solid Flat Colors 2.5D — Padrão Oficial de Vídeo Vertical (9:16)

Este skill padroniza a arquitetura visual, espacial, cromática, de animação e de entrega de vídeos verticais explicativos (`1080×1920`, `30 fps`) no **Remotion**, utilizando exclusivamente SVG 2.5D nativo leve (cores sólidas chapadas com extrusão 2.5D, projeção isométrica 2:1 e sombras projetadas), sincronizado quadro a quadro com os *timestamps* da narração.

---

## 1. Regras Mandatórias de Layout & Direção de Arte (Invioláveis)

1. **Formato do Canvas:** Vertical `1080×1920` a `30 fps`.
2. **Proibição de Elementos Superiores:**
   - **NUNCA** renderizar `InfographicCard`, cabeçalhos, títulos, subtítulos ou badges no topo da tela (`y < 420`).
   - O terço superior deve permanecer completamente limpo, exibindo apenas o fundo atmosférico (`FlatBG`).
3. **Zona Visual Central (50% da Tela / Área Segura):**
   - Todo o diorama/elemento visual 2.5D da cena deve estar centralizado dentro da faixa útil **`y: 440..1380`** e **`x: 100..980`**, ocupando aproximadamente **50% da área da tela** dentro da área segura.
4. **Legendas na Área Segura Inferior do Instagram (`DynamicCaptions`):**
   - **Posição fixa:** `bottom: 260px`, `left: 60px`, `right: 60px`, `zIndex: 990` (bem acima dos botões de UI do Reels/Instagram/TikTok).
   - **Agrupamento:** **2 a 3 palavras por vez**, seguindo estritamente os *timestamps* por palavra (`from` / `to` em frames) definidos em `src/data/scenes.json`.
   - **Estilo visual único (Sem demarcação):**
     - **Sem highlight/destaque** de cor para palavra ativa (todas as palavras usam a mesma cor padrão `#000000`).
     - **Caixa:** fundo branco sólido (`backgroundColor: "#FFFFFF"`), contorno preto (`border: "4px solid #000000"`), `borderRadius: 16`, `padding: "12px 24px"`.
     - **Tipografia:** `Montserrat` peso `900`, `uppercase`, `fontSize: 52`, `lineHeight: 1.15`.
5. **Regra dos 3 Segundos (Zero Elementos Estáticos):**
   - Nenhum elemento visual pode permanecer estático por mais de **90 frames (3 segundos a 30fps)**.
   - Toda animação deve ser 100% determinística via `useCurrentFrame()` (é **proibido** usar `@keyframes` CSS ou `Math.random()`).
   - Aplique movimento contínuo em repouso combinando: `wave(f, speed, amp, phase)`, `strokeDashoffset` contínuo (`-f * speed`), órbitas trigonométricas, ponteiros em rotação ou piscar periódico de olhos (`f % 60 < 4`).
6. **Proibição de Three.js / WebGL Pesado:**
   - Utilize **exclusivamente SVG 2.5D nativo** no Remotion. Isso mantém o bundle leve e reduz o tempo de renderização de ~1 hora para ~4 minutos em vídeos de ~2 minutos.

---

## 2. Paleta Oficial Solid Flat Colors 2.5D (`C`)

Toda forma 2.5D usa um par de cores sólidas chapadas: **Face Frontal / Topo** + **Face Lateral / Extrusão (`depth`)**, sem gradientes pesados ou brilhos WebGL.

| Papel / Elemento | Face Frontal (`fill` / `top`) | Extrusão / Sombra (`side` / `left`) |
|---|---|---|
| **Background Principal** | `bg: "#14213D"` | `bg2: "#1C2E52"` |
| **Escuro / Ink / Slate** | `ink: "#0B1426"`, `slate: "#1F2F4A"` | `slateD: "#101A2C"` |
| **Superfícies Claras (Creme)** | `cream: "#F6EEDF"` | `creamD: "#CFC3AC"` |
| **Coral (Alerta / Erro)** | `coral: "#FF6B5B"` | `coralD: "#C4473A"` |
| **Mostarda (Destaque / Energia)** | `mustard: "#FFC145"` | `mustardS: "#D39520"` |
| **Teal (Sinal / GPS / Sucesso)** | `teal: "#2EC4B6"` | `tealD: "#1E8C82"` |
| **Azul (Terra / Órbita / Painel)** | `blue: "#3A86FF"` | `blueD: "#2459B8"` |
| **Verde (Continentes / Plataformas)** | `green: "#7BD389"` | `greenD: "#4E9E5C"` |
| **Roxo (Dúvida / Pergunta)** | `purple: "#8B5CF6"` | `purpleD: "#5B34B8"` |
| **Metal (Antenas / Estrutura)** | `metal: "#DDE3EA"` | `metalD: "#8D99AE"` |

> Em caixas isométricas (`<IsoBox>`), utilize três tons chapados: topo claro (`top`), face esquerda mais escura (`left`) e face direita intermediária (`right`).

---

## 3. Catálogo de Primitivas 2.5D e Helpers (`examples/primitives.tsx`)

### 3.1 Helpers Matemáticos Determinísticos
- `wave(f, speed, amp, phase = 0)`: oscilação senoidal suave contínua (`Math.sin(f / speed + phase) * amp`).
- `pop(f, delay, fps, damping = 11)`: entrada física com *spring* (`stiffness: 140, mass: 0.7`).
- `kick(f, at, len = 12, amt = 0.15)`: pulso momentâneo de escala para enfatizar palavras-chave ou números exatos na narração.

### 3.2 Primitivas Geométricas 2.5D
- `<Slab x y w h r fill side depth />`: retângulo arredondado com extrusão sólida inferior (`depth`).
- `<Disc cx cy r fill side depth />`: disco/círculo com extrusão sólida inferior.
- `<ExText x y size fill side depth>`: tipografia extrudada em múltiplas camadas sólidas para números e anos marcantes.
- `<IsoBox x y w h height top left right />` + `makeIso(cx, cy, w, h)`: prisma isométrico 2:1 a partir do centro da base `(x, y)` e conversor de coordenadas UV para plano isométrico.
- `<Shadow cx cy rx ry o />`: sombra elíptica chapada ancorada no chão (`#000` com opacidade ~`0.24–0.30`).

### 3.3 Atores e Cenários Reutilizáveis (Coerência Visual)
- `<CityTile cx cy w h f fps delay river />`: tabuleiro urbano isométrico 2.5D com prédios animados em *stagger* e modo opcional `river={true}` (rio isométrico animado + ponte).
- `<Pin x y color dark s rot />`: marcador de mapa 2.5D com sombra deslocada e anel de pulso opcional.
- `<FlatEarth cx cy r f clipId />`: globo terrestre 2.5D com continentes em rotação contínua (`clipPath`) e sombra hemisférica inferior.
- `<FlatSatellite x y s rot f />`: satélite 2.5D com painéis solares azuis extrudados, corpo mostarda e LED piscante.
- `<AnalogClock cx cy r rim rimD angleDeg minuteDeg />`: relógio analógico 2.5D parametrizável para velocidades lentas, normais ou caóticas.
- `<EinsteinHead x y s f />`: personagem flat estilizado com cabelo animado por `wave()` e piscar de olhos periódico (`f % 60 < 4`).
- `<SceneShell accent>` + `<FlatBG accent>`: invólucro padrão de cada cena com transição de entrada suave (`8–12` frames, zoom `1.06 -> 1`) e fundo parallax com círculos e estrelas cintilantes.

---

## 4. Metodologia de Sincronia Beat-por-Palavra com a Narração

A coerência entre áudio e imagem nasce de sincronizar cada entrada visual diretamente com os *timestamps* por palavra em `src/data/scenes.json`:

1. **Conversão Global → Local:**
   Cada `<Sequence from={scene.from} durationInFrames={scene.durationInFrames}>` zera o `useCurrentFrame()` para `0` dentro do componente da cena. Logo, o frame local de qualquer palavra é:
   ```ts
   const relFrame = word.from - scene.from;
   ```
2. **Coreografia de Beats:**
   - **Entradas de objetos (`pop`):** dispare `pop(f, relFrame, fps)` no exato instante em que o substantivo/conceito aparece na fala.
   - **Ênfase rítmica (`kick`):** aplique `scale={pop(...) * kick(f, relFrame, 14, 0.18)}` quando números ou palavras de impacto forem falados.
   - **Contadores e trajetórias (`interpolate`):** anime valores numéricos e deslocamentos entre `[relStart, relEnd]` com `Easing.out(Easing.cubic)` e `clamp`.
3. **Continuidade Visual (Visual Storytelling):**
   - Reutilize os mesmos atores (`CityTile`, `FlatEarth`, `FlatSatellite`, `AnalogClock`, `EinsteinHead`) entre cenas consecutivas alterando apenas seu estado/contexto (ex.: o mesmo tabuleiro urbano da introdução reaparece no cálculo do erro de 11 km e depois na cena do carro caindo no rio).

---

## 5. Fluxo de Trabalho (3 Agentes), Renderização e Entrega

### 5.1 Separação em 3 Papéis / Agentes
1. **Agente 1 — Criador de Elementos & Primitivas:**
   - Cria/mantém `src/flat/primitives.tsx` e os atores 2.5D garantindo animações contínuas determinísticas (Regra dos 3s).
2. **Agente 2 — Diretor de Cena, Espaço & Legendas:**
   - Implementa as cenas sincronizadas aos *timestamps* de `scenes.json`, mantendo 100% dos elementos na área central (`y: 440..1380`), sem elementos no topo, e assegura `DynamicCaptions.tsx` na área segura inferior do Instagram.
3. **Agente 3 — Revisor Técnico:**
   - Executa `npx tsc --noEmit` (deve sair com código `0`).
   - Verifica ausência de cards/elementos acima de `y = 420` e valida quadros-chave extraídos com `ffmpeg -y -loglevel error -ss <t> -i out/<video>.mp4 -frames:v 1`.

### 5.2 Renderização Limpa e Envio via Telegram (Painel MQS)
- **Renderização isolada:** execute o comando de renderização do Remotion sozinho em sua chamada shell (sem encadear vários comandos pesados após o render no PowerShell para evitar travamentos de subshell):
  ```powershell
  npx remotion render FlatMain out/video_flat_full.mp4
  ```
- **Inspeção visual pós-render:** extraia amostras de quadros com `ffmpeg` e abra com `read_file` para confirmar enquadramento central de 50%, cores sólidas 2.5D e legendas na área segura inferior.
- **Entrega ao Painel MQS:** envie o `.mp4` finalizado diretamente pelo bot do Telegram utilizando as credenciais configuradas no projeto `painelmqs` (`TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` ou tabela `mqs_site_data` no Supabase via API `sendVideo` com `supports_streaming: "true"`).

---

## 6. Arquivos de Referência (`examples/`)
Consulte os arquivos de referência incluídos nesta skill para reutilizar ou adaptar diretamente em novos projetos:
- `examples/primitives.tsx` — Paleta `C`, helpers `wave`/`pop`/`kick`, primitivas 2.5D e atores reutilizáveis.
- `examples/DynamicCaptions.tsx` — Componente padrão de legendas (2–3 palavras, área segura Instagram, fundo branco, contorno preto, sem highlight).
- `examples/FlatMain.tsx` — Orquestrador de composição completa lendo `scenes.json`.
