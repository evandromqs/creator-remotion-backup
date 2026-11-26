import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ModernBackground } from "../motion/Background";
import { MOTION_PALETTE } from "../motion/tokens";
import { springPop } from "../motion/presets";
import { VectorEarth } from "../motion/illustrations/VectorEarth";
import { VectorSatellite } from "../motion/illustrations/VectorSatellite";
import { VectorAtomicClock } from "../motion/illustrations/VectorAtomicClock";
import { VectorPhoneGps } from "../motion/illustrations/VectorPhoneGps";
import { VectorTriangulation } from "../motion/illustrations/VectorTriangulation";
import { VectorSpacetimeGrid } from "../motion/illustrations/VectorSpacetimeGrid";

export interface SceneComponentProps {
  scene: any;
}

const centeredContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// ==========================================
// CENA 1: MapHook3D (0-177f) — Introdução
// ==========================================
export const MapHook3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;
  const pop = springPop(rel, 30, 0);

  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />
      <div style={{ transform: `scale(${pop})` }}>
        <VectorPhoneGps scale={1.35} driftError={false} />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 2: GpsDriftCounter (177-399f) — O Desvio
// ==========================================
export const GpsDriftCounter: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <VectorSatellite scale={1.25} showWaves={true} angle={0} />
        <VectorEarth size={620} showOrbits={true} />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 3: SputnikOrbit3D (399-597f) — Sputnik 1957
// ==========================================
export const SputnikOrbit3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <VectorEarth size={680} showOrbits={true} orbitCount={4} />
        <div
          style={{
            position: "absolute",
            transform: `rotate(${rel * 1.5}deg) translateX(340px) rotate(-${rel * 1.5}deg)`,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#E2E8F0",
              boxShadow: "0 0 24px #F59E0B",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 4: DopplerWaves (597-795f) — Efeito Doppler
// ==========================================
export const DopplerWaves: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />
      <VectorSatellite scale={1.65} showWaves={true} angle={10} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 5: TriangulationGlobe (795-1080f) — Triangulação
// ==========================================
export const TriangulationGlobe: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryGreen} />
      <VectorTriangulation width={860} height={740} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 6: SatelliteConstellation (1080-1230f)
// ==========================================
export const SatelliteConstellation: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />
      <VectorEarth size={720} showOrbits={true} orbitCount={5} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 7: AtomicClock3D (1230-1419f) — Relógio Atômico
// ==========================================
export const AtomicClock3D: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />
      <VectorAtomicClock scale={1.45} showFrequency={true} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 8: ClockGlitchChaos (1419-1575f) — Alerta
// ==========================================
export const ClockGlitchChaos: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;
  const jitter = Math.sin(rel * 0.8) * 10;

  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} glowIntensity={0.35} />
      <div style={{ transform: `translateX(${jitter}px)` }}>
        <VectorAtomicClock scale={1.45} showFrequency={true} />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 9: EinsteinEquation (1575-1716f) — Relatividade
// ==========================================
export const EinsteinEquation: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />
      <VectorSpacetimeGrid width={860} height={640} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 10: TimeSlowSatellite (1716-1920f) — Velocidade
// ==========================================
export const TimeSlowSatellite: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />
      <VectorSatellite scale={1.65} showWaves={false} angle={-10} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 11: TimeFastGravity (1920-2058f) — Gravidade
// ==========================================
export const TimeFastGravity: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <VectorAtomicClock scale={1.15} showFrequency={false} />
        <VectorEarth size={620} showOrbits={false} />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 12: BigNumberPop (2058-2136f) — +38 µs
// ==========================================
export const BigNumberPop: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} glowIntensity={0.3} />
      <VectorAtomicClock scale={1.5} showFrequency={true} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 13: EquationResult (2136-2370f) — O Cálculo
// ==========================================
export const EquationResult: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />
      <VectorSpacetimeGrid width={860} height={600} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 14: CarIntoRiver3D (2370-2634f) — O Carro no Rio
// ==========================================
export const CarIntoRiver3D: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} />
      <VectorPhoneGps scale={1.35} driftError={true} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 15: EngineersReprogram (2634-2859f) — A Solução
// ==========================================
export const EngineersReprogram: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryGreen} />
      <VectorAtomicClock scale={1.45} showFrequency={true} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 16: Timeline1983 (2859-3030f) — Liberação Civil
// ==========================================
export const Timeline1983: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />
      <VectorEarth size={720} showOrbits={true} orbitCount={4} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 17: WorldDependence (3030-3267f) — O Mundo Conectado
// ==========================================
export const WorldDependence: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />
      <VectorEarth size={740} showOrbits={true} orbitCount={6} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 18: CtaLab (3267-3400f) — Call to Action
// ==========================================
export const CtaLab: React.FC<SceneComponentProps> = () => {
  return (
    <AbsoluteFill style={centeredContainerStyle}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />
      <VectorSatellite scale={1.65} showWaves={true} angle={0} />
    </AbsoluteFill>
  );
};

// ==========================================
// REGISTRO OFICIAL DAS 18 CENAS MODERN EXPLAINER
// ==========================================
export const sceneComponentRegistry: Record<string, React.FC<SceneComponentProps>> = {
  MapHook3D,
  GpsDriftCounter,
  SputnikOrbit3D,
  DopplerWaves,
  TriangulationGlobe,
  SatelliteConstellation,
  AtomicClock3D,
  ClockGlitchChaos,
  EinsteinEquation,
  TimeSlowSatellite,
  TimeFastGravity,
  BigNumberPop,
  EquationResult,
  CarIntoRiver3D,
  EngineersReprogram,
  Timeline1983,
  WorldDependence,
  CtaLab,
};

export const getSceneComponent = (componentName: string): React.FC<SceneComponentProps> => {
  return sceneComponentRegistry[componentName] || MapHook3D;
};
