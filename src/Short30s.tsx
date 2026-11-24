/**
 * SHORT 30S — Corte de 30 segundos do vídeo "Einstein e o GPS"
 * Direção Criativa: Roteiro acelerado de 9 cenas / 900 frames @ 30fps
 *
 * ESTRUTURA NARRATIVA (Diretor):
 *  ACT 1 - HOOK     (0s-5s)   : Celular com GPS → "Você já parou para pensar?"
 *  ACT 2 - TENSÃO   (5s-14s)  : O erro de 11km + O Sputnik + O Desvio
 *  ACT 3 - CONFLITO (14s-21s) : Relógio atômico + Alerta de dessincronia
 *  ACT 4 - VIRADA   (21s-27s) : Einstein + A equação +38µs
 *  ACT 5 - PAYOFF   (27s-30s) : Impacto global + CTA
 */

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { getSceneComponent } from "./components/SceneRegistry";

// Composição curada de 9 cenas que formam o roteiro de 30 segundos
const short30sScript = [
  // === ACT 1: HOOK (0 - 150f / 0s - 5s) ===
  // Entrada impactante — celular animado com GPS pulsando
  {
    id: "hook",
    component: "MapHook3D",
    from: 0,
    durationInFrames: 150, // 5s
  },

  // === ACT 2: O PROBLEMA (150 - 390f / 5s - 13s) ===
  // Contador de 11km subindo — cria urgência
  {
    id: "erro-11km",
    component: "GpsDriftCounter",
    from: 150,
    durationInFrames: 150, // 5s
  },
  // Sputnik 1957 — contexto histórico rápido
  {
    id: "sputnik",
    component: "SputnikOrbit3D",
    from: 300,
    durationInFrames: 90, // 3s — cena curta, impactante
  },

  // === ACT 3: O CORAÇÃO DO GPS (390 - 570f / 13s - 19s) ===
  // 31 satélites orbitando — grandiosidade do sistema
  {
    id: "constellation",
    component: "SatelliteConstellation",
    from: 390,
    durationInFrames: 90, // 3s
  },
  // Relógio atômico — o "herói" da história
  {
    id: "atomic-clock",
    component: "AtomicClock3D",
    from: 480,
    durationInFrames: 90, // 3s
  },
  // Alerta de dessincronia — clímax de tensão
  {
    id: "glitch",
    component: "ClockGlitchChaos",
    from: 570,
    durationInFrames: 90, // 3s — curto e perturbador
  },

  // === ACT 4: A VIRADA (660 - 810f / 22s - 27s) ===
  // Einstein explica — spacetime grid
  {
    id: "einstein",
    component: "EinsteinEquation",
    from: 660,
    durationInFrames: 90, // 3s
  },
  // O saldo +38µs — revelação numérica
  {
    id: "big-number",
    component: "BigNumberPop",
    from: 750,
    durationInFrames: 90, // 3s
  },

  // === ACT 5: PAYOFF + CTA (810 - 900f / 27s - 30s) ===
  // Impacto global + call to action
  {
    id: "cta",
    component: "CtaLab",
    from: 810,
    durationInFrames: 90, // 3s
  },
];

export const Short30s: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#090c13", overflow: "hidden" }}>
      {/* Narração recortada — primeiros 30 segundos */}
      <Audio src={staticFile("narracao.mp3")} endAt={900} />

      {short30sScript.map((scene) => {
        const SceneComponent = getSceneComponent(scene.component);
        return (
          <Sequence
            key={scene.id}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
            layout="none"
          >
            {/* Passamos o objeto de cena com 'from' para que os componentes
                possam calcular frames relativos corretamente */}
            <SceneComponent scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
