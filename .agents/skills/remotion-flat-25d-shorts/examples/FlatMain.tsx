import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { DynamicCaptions } from "../components/DynamicCaptions";
import scenesData from "../data/scenes.json";
import { C, SceneShell } from "./primitives";
import {
  S1Hook,
  S2Drift,
  S3Sputnik,
  S4Doppler,
  S5Idea,
  S6Constellation,
  S7AtomicClock,
  S8ClockChaos,
  S9Relativity,
} from "./scenesPart1";
import {
  S10SpeedSlow,
  S11GravityFast,
  S12Plus45,
  S13CosmicMath,
  S14CarIntoRiver,
  S15Engineers,
  S16Timeline1983,
  S17WorldDependence,
  S18CtaLab,
} from "./scenesPart2";

const SCENE_MAP: Record<string, { Comp: React.FC; accent: string }> = {
  MapHook3D: { Comp: S1Hook, accent: C.teal },
  GpsDriftCounter: { Comp: S2Drift, accent: C.coral },
  SputnikOrbit3D: { Comp: S3Sputnik, accent: C.mustard },
  DopplerWaves: { Comp: S4Doppler, accent: C.blue },
  TriangulationGlobe: { Comp: S5Idea, accent: C.mustard },
  SatelliteConstellation: { Comp: S6Constellation, accent: C.teal },
  AtomicClock3D: { Comp: S7AtomicClock, accent: C.mustard },
  ClockGlitchChaos: { Comp: S8ClockChaos, accent: C.coral },
  EinsteinEquation: { Comp: S9Relativity, accent: C.teal },
  TimeSlowSatellite: { Comp: S10SpeedSlow, accent: C.coral },
  TimeFastGravity: { Comp: S11GravityFast, accent: C.teal },
  BigNumberPop: { Comp: S12Plus45, accent: C.teal },
  EquationResult: { Comp: S13CosmicMath, accent: C.mustard },
  CarIntoRiver3D: { Comp: S14CarIntoRiver, accent: C.coral },
  EngineersReprogram: { Comp: S15Engineers, accent: C.green },
  Timeline1983: { Comp: S16Timeline1983, accent: C.mustard },
  WorldDependence: { Comp: S17WorldDependence, accent: C.teal },
  CtaLab: { Comp: S18CtaLab, accent: C.mustard },
};

export const FlatMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    {scenesData.audio?.narration && <Audio src={staticFile("narracao.mp3")} />}

    {scenesData.scenes.map((scene) => {
      const entry = SCENE_MAP[scene.component] || { Comp: S1Hook, accent: C.teal };
      const { Comp, accent } = entry;
      return (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
        >
          <SceneShell accent={accent}>
            <Comp />
          </SceneShell>
        </Sequence>
      );
    })}

    <DynamicCaptions />
  </AbsoluteFill>
);
