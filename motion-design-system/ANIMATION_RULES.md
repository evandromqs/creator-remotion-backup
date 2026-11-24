# Regras de Animação — Remotion & Modern Explainer

## 1. REGRA MANDATÓRIA: DINAMISMO CONTÍNUO (REGRA DOS 3 SEGUNDOS)

> **REGRA DE OURO:** Nenhum elemento visual principal ou componente em tela pode permanecer completamente estático por **mais de 3 segundos (90 frames a 30fps)**.

Para manter retenção máxima e ritmo visual profissional sem poluição:
1. **Micro-interações contínuas em repouso:**
   - **Float Loop:** Todo card, satélite, ícone ou objeto em cena deve ter flutuação senoidal suave contínua (`floatLoop(frame)`).
   - **Breathe / Pulse:** Pulsação sutil de escala (±2% a 4%) em anéis de sinal, badges e destaques (`pulseLoop(frame)`).
   - **Glow Shimmer:** Variação cíclica de brilho e opacidade nas bordas (`glowSweep` ou `opacityPulse`).
2. **Entradas Secundárias Escalonadas (Micro-staggers):**
   - Se uma cena dura mais de 3 segundos, elementos adicionais (como setas, badges, medidores ou dados complementares) devem entrar escalonados após o 2º ou 3º segundo, renovando o foco visual.
3. **Traçado Contínuo ou Ondas Constantes:**
   - Feixes de satélite, ondas de rádio e partículas devem manter ciclos repetitivos ou movimento de fluxo constante.

---

## 2. Motor Determinístico Baseado em Frames

No Remotion, **não utilize** animações CSS tradicionais (`transition` ou `@keyframes`) para controlar a animação do vídeo. Todo movimento deve ser determinístico e calculado por frame usando as APIs nativas do Remotion:

- `useCurrentFrame()`
- `useVideoConfig()`
- `interpolate()`
- `spring()`
- `Easing`

## 2. Organização de Assets Estáticos

Arquivos e referências carregados em tempo de renderização devem ficar organizados na pasta `public/` do projeto Remotion e referenciados com `staticFile()`.

## 3. Presets de Animação Reutilizáveis

O sistema deve fornecer presets modulares e configuráveis para manter o movimento suave e intencional:

| Preset | Função Narrativa |
| :--- | :--- |
| **Fade In** | Entrada suave por opacidade |
| **Slide In** | Entrada direcional controlada |
| **Pop In** | Surgimento rápido com escala e overshoot sutil via `spring()` |
| **Scale Up** | Crescimento progressivo para destaque ou foco |
| **Float** | Movimento contínuo e sutil de flutuação em elementos de apoio |
| **Bounce** | Ênfase elástica controlada sem exagero infantil |
| **Draw On** | Desenho progressivo de linhas, setas e conexões SVG (`strokeDashoffset`) |
| **Morph** | Transição controlada entre formas geométricas |
| **Stagger** | Entrada escalonada de listas, ícones ou múltiplos elementos |
| **Camera Push** | Aproximação suave de câmera para foco narrativo |
| **Camera Pull** | Afastamento suave de câmera para revelar contexto |

## 4. Formatos de Composição

Todas as demonstrações e cenas-modelo devem ser validadas nos dois formatos principais:
- **16:9** (horizontal — YouTube, apresentações, tutoriais)
- **9:16** (vertical — Shorts, Reels, TikTok)
