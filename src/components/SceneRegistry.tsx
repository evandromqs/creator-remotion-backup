import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ModernBackground } from "../motion/Background";
import { InfographicCard } from "../motion/InfographicCard";
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

// ==========================================
// CENA 1: MapHook3D (0-177f) — Introdução
// ==========================================
export const MapHook3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;
  const pop = springPop(rel, 30, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />
      
      <div style={{ transform: `scale(${pop})`, marginTop: "120px" }}>
        <VectorPhoneGps scale={1.15} driftError={false} />
      </div>

      <div style={{ position: "absolute", top: "140px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={12}
          title="NAVEGAÇÃO POR SATÉLITE"
          subtitle="Você já parou para pensar como o GPS do seu celular sabe onde você está?"
          accent={MOTION_PALETTE.cyanSignal}
          badge="GPS GLOBAL"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 2: GpsDriftCounter (177-399f) — O Desvio
// ==========================================
export const GpsDriftCounter: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const countSpr = spring({
    frame: rel - 10,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.0 },
  });
  const kmValue = interpolate(countSpr, [0, 1], [0.0, 11.4]);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} />

      {/* Satélite acima emitindo sinal para a Terra */}
      <div style={{ position: "absolute", top: "240px" }}>
        <VectorSatellite scale={1.1} showWaves={true} angle={0} />
      </div>

      <div style={{ position: "absolute", bottom: "-120px" }}>
        <VectorEarth size={680} showOrbits={true} />
      </div>

      <div style={{ position: "absolute", top: "120px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="DESVIO ACUMULADO DIÁRIO"
          value={`+${kmValue.toFixed(1)} KM`}
          subtitle="Sem a física de Einstein, o seu mapa erraria mais de 11 quilômetros todos os dias!"
          accent={MOTION_PALETTE.secondaryCoral}
          badge="SEM CORREÇÃO"
        />
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
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />

      <div style={{ position: "absolute", top: "280px" }}>
        <VectorEarth size={580} showOrbits={true} orbitCount={4} />
      </div>

      {/* Mini Satélite Sputnik orbitando com rastro */}
      <div
        style={{
          position: "absolute",
          top: "420px",
          transform: `rotate(${rel * 1.5}deg) translateX(320px) rotate(-${rel * 1.5}deg)`,
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E2E8F0", boxShadow: "0 0 20px #F59E0B" }} />
      </div>

      <div style={{ position: "absolute", top: "130px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={8}
          title="ERA ESPACIAL • 1957"
          value="SPUTNIK 1"
          subtitle="Cientistas usaram o rádio do satélite soviético para rastrear posições na Terra."
          accent={MOTION_PALETTE.accentAmber}
          badge="HISTÓRIA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 4: DopplerWaves (597-795f) — Efeito Doppler
// ==========================================
export const DopplerWaves: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />

      <div style={{ transform: `scale(1.2) translateY(60px)` }}>
        <VectorSatellite scale={1.25} showWaves={true} angle={10} />
      </div>

      <div style={{ position: "absolute", top: "130px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={6}
          title="EFEITO DOPPLER NO ESPAÇO"
          value="1.575,42 MHz"
          subtitle="A mudança na frequência do sinal revela a velocidade e trajetória orbital exata."
          accent={MOTION_PALETTE.cyanSignal}
          badge="RADIOFREQUÊNCIA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 5: TriangulationGlobe (795-1080f) — Triangulação
// ==========================================
export const TriangulationGlobe: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryGreen} />

      <div style={{ marginTop: "140px" }}>
        <VectorTriangulation width={760} height={640} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="TRILATERAÇÃO DE SINAIS"
          value="4 SATÉLITES"
          subtitle="Três satélites calculam latitude, longitude e altitude. O quarto corrige o tempo."
          accent={MOTION_PALETTE.secondaryGreen}
          badge="GEOMETRIA 3D"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 6: SatelliteConstellation (1080-1230f)
// ==========================================
export const SatelliteConstellation: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />

      <div style={{ marginTop: "120px" }}>
        <VectorEarth size={620} showOrbits={true} orbitCount={5} />
      </div>

      <div style={{ position: "absolute", top: "120px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="CONSTELAÇÃO GLOBAL GPS"
          value="31 SATÉLITES"
          subtitle="Orbitando a 20.200 km da Terra a uma velocidade impressionante de 14.000 km/h."
          accent={MOTION_PALETTE.dominantBlue}
          badge="ÓRBITA MÉDIA (MEO)"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 7: AtomicClock3D (1230-1419f) — Relógio Atômico
// ==========================================
export const AtomicClock3D: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />

      <div style={{ marginTop: "160px" }}>
        <VectorAtomicClock scale={1.2} showFrequency={true} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="CORAÇÃO DO SISTEMA"
          value="10⁻⁹ SEGUNDOS"
          subtitle="Cada satélite carrega relógios atômicos de césio de altíssima precisão."
          accent={MOTION_PALETTE.accentAmber}
          badge="PRECISÃO NANO"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 8: ClockGlitchChaos (1419-1575f) — Alerta
// ==========================================
export const ClockGlitchChaos: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;
  const jitter = Math.sin(rel * 0.8) * 8;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} glowIntensity={0.35} />

      <div style={{ marginTop: "160px", transform: `translateX(${jitter}px)` }}>
        <VectorAtomicClock scale={1.2} showFrequency={true} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={4}
          title="PROBLEMA CRÍTICO"
          value="DESSINCRONIA!"
          subtitle="No espaço, o tempo passa em um ritmo diferente do solo terrestre!"
          accent={MOTION_PALETTE.secondaryCoral}
          badge="ALERTA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 9: EinsteinEquation (1575-1716f) — Relatividade
// ==========================================
export const EinsteinEquation: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />

      <div style={{ marginTop: "160px" }}>
        <VectorSpacetimeGrid width={720} height={520} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="ALBERT EINSTEIN (1905 & 1915)"
          value="RELATIVIDADE"
          subtitle="Dois efeitos físicos opostos entram em ação ao mesmo tempo no espaço."
          accent={MOTION_PALETTE.cyanSignal}
          badge="FÍSICA TEÓRICA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 10: TimeSlowSatellite (1716-1920f) — Velocidade
// ==========================================
export const TimeSlowSatellite: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel, fps, config: { damping: 14, stiffness: 80 } });
  const val = interpolate(spr, [0, 1], [0.0, -7.0]);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />

      <div style={{ marginTop: "180px" }}>
        <VectorSatellite scale={1.3} showWaves={false} angle={-10} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="1. RELATIVIDADE ESPECIAL (VELOCIDADE)"
          value={`${val.toFixed(1)} µs / DIA`}
          subtitle="Por se mover a 14.000 km/h, o relógio do satélite se atrasa 7 microssegundos por dia."
          accent={MOTION_PALETTE.cyanSignal}
          badge="TEMPO DILATA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 11: TimeFastGravity (1920-2058f) — Gravidade
// ==========================================
export const TimeFastGravity: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel, fps, config: { damping: 14, stiffness: 80 } });
  const val = interpolate(spr, [0, 1], [0.0, 45.0]);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />

      <div style={{ position: "absolute", bottom: "-140px" }}>
        <VectorEarth size={700} showOrbits={false} />
      </div>

      <div style={{ position: "absolute", top: "280px" }}>
        <VectorAtomicClock scale={0.9} showFrequency={false} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="2. RELATIVIDADE GERAL (GRAVIDADE)"
          value={`+${val.toFixed(1)} µs / DIA`}
          subtitle="Com a gravidade mais fraca a 20.000 km, o tempo corre 45 microssegundos mais rápido!"
          accent={MOTION_PALETTE.accentAmber}
          badge="TEMPO ACELERA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 12: BigNumberPop (2058-2136f) — +38 µs
// ==========================================
export const BigNumberPop: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel, fps, config: { damping: 12, stiffness: 100 } });
  const val = interpolate(spr, [0, 1], [0.0, 38.0]);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} glowIntensity={0.3} />

      <div style={{ marginTop: "140px" }}>
        <VectorAtomicClock scale={1.25} showFrequency={true} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={3}
          title="O SALDO LÍQUIDO DIÁRIO"
          value={`+${Math.round(val)} µs / DIA`}
          subtitle="+45 µs (gravidade) menos 7 µs (velocidade) = o relógio no espaço ganha 38 microssegundos!"
          accent={MOTION_PALETTE.accentAmber}
          badge="DIFERENÇA CRÍTICA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 13: EquationResult (2136-2370f) — O Cálculo
// ==========================================
export const EquationResult: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />

      <div style={{ marginTop: "140px" }}>
        <VectorSpacetimeGrid width={720} height={460} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="A MATEMÁTICA CÓSMICA"
          value="45 - 7 = +38 µs"
          subtitle="Parece insignificante? A velocidade da luz multiplica cada microssegundo por centenas de metros!"
          accent={MOTION_PALETTE.dominantBlue}
          badge="EQUAÇÃO FINAL"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 14: CarIntoRiver3D (2370-2634f) — O Carro no Rio
// ==========================================
export const CarIntoRiver3D: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryCoral} />

      <div style={{ marginTop: "130px" }}>
        <VectorPhoneGps scale={1.15} driftError={true} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={6}
          title="CONSEQUÊNCIA NA PRÁTICA"
          value="11,4 KM DE ERRO"
          subtitle="Sem a correção de Einstein, o mapa diria que você está na ponte enquanto você cai no rio!"
          accent={MOTION_PALETTE.secondaryCoral}
          badge="DESASTRE DE NAVEGAÇÃO"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 15: EngineersReprogram (2634-2859f) — A Solução
// ==========================================
export const EngineersReprogram: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.secondaryGreen} />

      <div style={{ marginTop: "160px" }}>
        <VectorAtomicClock scale={1.2} showFrequency={true} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="A SOLUÇÃO DOS ENGENHEIROS"
          value="10,22999999543 MHz"
          subtitle="Eles reprogramaram o relógio atômico para bater um tiquinho mais devagar antes de subir ao espaço!"
          accent={MOTION_PALETTE.secondaryGreen}
          badge="CALIBRAÇÃO PERFEITA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 16: Timeline1983 (2859-3030f) — Liberação Civil
// ==========================================
export const Timeline1983: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.accentAmber} />

      <div style={{ marginTop: "120px" }}>
        <VectorEarth size={620} showOrbits={true} orbitCount={4} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="LINHA DO TEMPO HISTÓRICA"
          value="ANO 1983"
          subtitle="O presidente Ronald Reagan decreta que o sistema de satélites militar passaria a ser civil e gratuito."
          accent={MOTION_PALETTE.accentAmber}
          badge="GUERRA FRIA → CIVIL"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 17: WorldDependence (3030-3267f) — O Mundo Conectado
// ==========================================
export const WorldDependence: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.cyanSignal} />

      <div style={{ marginTop: "120px" }}>
        <VectorEarth size={640} showOrbits={true} orbitCount={6} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={5}
          title="IMPACTO GLOBAL HOJE"
          value="+6 BILHÕES"
          subtitle="Bolsas de valores, tráfego aéreo, antenas 5G e entregas dependem dos cálculos de Einstein."
          accent={MOTION_PALETTE.cyanSignal}
          badge="CIVILIZAÇÃO MODERNA"
        />
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 18: CtaLab (3267-3400f) — Call to Action
// ==========================================
export const CtaLab: React.FC<SceneComponentProps> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <ModernBackground showGrid={true} accentColor={MOTION_PALETTE.dominantBlue} />

      <div style={{ marginTop: "180px" }}>
        <VectorSatellite scale={1.3} showWaves={true} angle={0} />
      </div>

      <div style={{ position: "absolute", top: "110px", width: "90%", maxWidth: "860px" }}>
        <InfographicCard
          delay={4}
          title="EINSTEIN NO SEU DELIVERY"
          value="SEGUE O CANAL!"
          subtitle="Comenta aqui embaixo o que você achou dessa história e compartilhe com um amigo curioso!"
          accent={MOTION_PALETTE.dominantBlue}
          badge="LABORATÓRIO"
        />
      </div>
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
