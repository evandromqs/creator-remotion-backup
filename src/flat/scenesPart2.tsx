import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AnalogClock,
  C,
  CityTile,
  Disc,
  EinsteinHead,
  ExText,
  FONT,
  FlatEarth,
  FlatSatellite,
  IsoBox,
  Shadow,
  Slab,
  clamp,
  kick,
  makeIso,
  pop,
  wave,
} from "./primitives";

// ============ CENA 10 — VELOCIDADE: −7 µs/DIA (1716–1920, dur 204) ============
// "velocidade extrema"(7..38) -> "mais devagar no satélite"(72..122) -> "menos 7 microssegundos"(125..175)
export const S10SpeedSlow: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const satX = 320 + ((f * 9) % 520);
  const clocksIn = pop(f, 34, fps, 11);
  const minusIn = pop(f, 122, fps, 9) * kick(f, 137, 16, 0.2);
  const val = interpolate(f, [122, 150], [0, -7], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <g>
      {/* Linhas de velocidade + satélite veloz no topo da área segura */}
      <g>
        {[0, 1, 2, 3].map((i) => {
          const lx = 880 - (((f * 22 + i * 190) % 760));
          return (
            <rect
              key={i}
              x={lx}
              y={540 + i * 36}
              width={130}
              height={10}
              rx={5}
              fill={C.teal}
              opacity={0.55}
            />
          );
        })}
        <FlatSatellite x={satX} y={600 + wave(f, 10, 6)} s={0.92} rot={8} f={f} />
      </g>

      {/* Comparação: Relógio na Terra (rápido/normal) vs Satélite (câmera lenta) */}
      {f >= 34 && (
        <g transform={`translate(0 ${wave(f, 32, 6)})`}>
          <g transform={`translate(310 950) scale(${clocksIn})`}>
            <Shadow cx={0} cy={195} rx={140} ry={20} o={0.24} />
            <AnalogClock cx={0} cy={0} r={155} rim={C.blue} rimD={C.blueD} angleDeg={f * 4} minuteDeg={f * 32} />
            <Slab x={-105} y={175} w={210} h={56} r={16} fill={C.blue} side={C.blueD} depth={8} />
            <text x={0} y={213} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.cream}>
              TERRA
            </text>
          </g>
          <g transform={`translate(770 950) scale(${clocksIn})`}>
            <Shadow cx={0} cy={195} rx={140} ry={20} o={0.24} />
            <AnalogClock cx={0} cy={0} r={155} rim={C.coral} rimD={C.coralD} angleDeg={f * 0.45} minuteDeg={f * 3.2} />
            <Slab x={-120} y={175} w={240} h={56} r={16} fill={C.coral} side={C.coralD} depth={8} />
            <text x={0} y={213} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.cream}>
              SATÉLITE
            </text>
          </g>
        </g>
      )}

      {/* Placa −7 µs */}
      {f >= 122 && (
        <g transform={`translate(540 1315) scale(${minusIn}) rotate(${wave(f, 35, 1.8)})`}>
          <Slab x={-265} y={-80} w={530} h={160} r={34} fill={C.coral} side={C.coralD} depth={18} />
          <text x={0} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={106} fill={C.cream}>
            {val <= -6.9 ? "−7" : val.toFixed(1)} µs
          </text>
        </g>
      )}
    </g>
  );
};

// ============ CENA 11 — GRAVIDADE: O TEMPO CORRE MAIS RÁPIDO (1920–2058, dur 138) ============
// "Segundo:"(2..24) -> "gravidade pesada da Terra"(41..89) -> "tempo corre mais rápido"(96..138)
export const S11GravityFast: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const two = pop(f, 0, fps, 9) * interpolate(f, [32, 46], [1, 0.55], clamp);
  const twoX = interpolate(f, [32, 46], [540, 195], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const twoY = interpolate(f, [32, 46], [860, 560], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const wellIn = pop(f, 24, fps, 12);
  const fastClock = pop(f, 70, fps, 10);
  const spinSpeed = f >= 94 ? 54 : 18;

  return (
    <g>
      {/* Poço gravitacional curvado sob a Terra */}
      {f >= 24 && (
        <g opacity={wellIn}>
          {[-2, -1, 0, 1, 2].map((row) => {
            const baseY = 1090 + row * 48;
            const dip = (140 - Math.abs(row) * 22) + wave(f, 18, 10, row);
            return (
              <path
                key={row}
                d={`M 140 ${baseY} Q 540 ${baseY + dip} 940 ${baseY}`}
                fill="none"
                stroke={C.blue}
                strokeWidth={5}
                opacity={0.55}
              />
            );
          })}
          {[220, 380, 540, 700, 860].map((vx, i) => (
            <path
              key={i}
              d={`M ${vx} 980 Q ${(vx + 540) / 2} 1210 ${vx} 1310`}
              fill="none"
              stroke={C.blue}
              strokeWidth={4}
              opacity={0.38}
            />
          ))}
          <g transform={`translate(0 ${wave(f, 30, 6)})`}>
            <FlatEarth cx={540} cy={1135} r={155} f={f} clipId="s11-earth" />
          </g>
        </g>
      )}

      {/* Alto no espaço (longe da gravidade): Satélite + Relógio girando super rápido */}
      {f >= 70 && (
        <g transform={`translate(580 ${645 + wave(f, 22, 8)}) scale(${fastClock})`}>
          <FlatSatellite x={-165} y={10} s={0.78} rot={-8 + wave(f, 20, 4)} f={f} />
          <AnalogClock cx={135} cy={0} r={125} rim={C.teal} rimD={C.tealD} angleDeg={f * 8} minuteDeg={f * spinSpeed} />
          {f >= 96 &&
            [0, 1].map((i) => {
              const rr = 140 + (((f - 96) * 3.5 + i * 35) % 70);
              return <circle key={i} cx={135} cy={0} r={rr} fill="none" stroke={C.teal} strokeWidth={5} opacity={1 - (rr - 140) / 70} />;
            })}
        </g>
      )}

      {/* Medalhão "2" ("Segundo:") */}
      <g transform={`translate(${twoX} ${twoY}) scale(${two}) rotate(${wave(f, 20, 4)})`}>
        <Disc cx={0} cy={0} r={115} fill={C.mustard} side={C.mustardS} depth={16} />
        <text x={0} y={44} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={134} fill={C.ink}>
          2
        </text>
      </g>
    </g>
  );
};

// ============ CENA 12 — MAIS 45 MICROSSEGUNDOS (2058–2136, dur 78) ============
export const S12Plus45: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, 2, fps, 8) * kick(f, 11, 16, 0.2) * kick(f, 44, 16, 0.14);
  const n = Math.min(45, Math.round(interpolate(f, [2, 22], [0, 45], { ...clamp, easing: Easing.out(Easing.cubic) })));

  return (
    <g>
      {/* Setas flat subindo no fundo central */}
      {[-280, -140, 0, 140, 280].map((dx, i) => {
        const y = 1280 - (((f * 9 + i * 130) % 680));
        return (
          <polygon
            key={i}
            points={`${540 + dx},${y - 36} ${540 + dx - 30},${y + 16} ${540 + dx + 30},${y + 16}`}
            fill={C.teal}
            opacity={0.4}
          />
        );
      })}
      <g transform={`translate(540 ${910 + wave(f, 18, 10)}) scale(${s}) rotate(${wave(f, 24, 2.5)})`}>
        <Shadow cx={0} cy={220} rx={320} ry={32} o={0.3} />
        <Slab x={-360} y={-155} w={720} h={310} r={52} fill={C.teal} side={C.tealD} depth={26} />
        <ExText x={0} y={55} size={172} fill={C.cream} side={C.ink} depth={12}>
          +{n} µs
        </ExText>
      </g>
    </g>
  );
};

// ============ CENA 13 — A CONTA CÓSMICA: +45 − 7 = 38 µs (2136–2370, dur 234) ============
// "mais 45"(66..80) -> "menos 7"(98..127) -> "38 microssegundos"(128..175) -> "todo dia"(204..232)
export const S13CosmicMath: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p45 = pop(f, 62, fps, 10);
  const m7 = pop(f, 96, fps, 10);
  const res = pop(f, 126, fps, 8) * kick(f, 154, 16, 0.16);
  const shock = f >= 126 && f < 166 ? (f - 126) / 40 : -1;

  return (
    <g>
      {/* Quadro de fundo central */}
      <g transform={`translate(540 ${920 + wave(f, 36, 7)}) scale(${pop(f, 0, fps, 13)})`}>
        <Shadow cx={0} cy={380} rx={360} ry={30} o={0.26} />
        <Slab x={-400} y={-330} w={800} h={660} r={48} fill={C.slate} side={C.slateD} depth={24} />

        {/* Bloco +45 vindo da esquerda */}
        {f >= 62 && (
          <g transform={`translate(${-185 - (1 - p45) * 320} -155) scale(${p45})`}>
            <Slab x={-165} y={-80} w={330} h={160} r={30} fill={C.teal} side={C.tealD} depth={14} />
            <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={104} fill={C.ink}>
              +45
            </text>
          </g>
        )}

        {/* Bloco −7 vindo da direita */}
        {f >= 96 && (
          <g transform={`translate(${195 + (1 - m7) * 320} -155) scale(${m7})`}>
            <Slab x={-150} y={-80} w={300} h={160} r={30} fill={C.coral} side={C.coralD} depth={14} />
            <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={104} fill={C.cream}>
              −7
            </text>
          </g>
        )}

        {/* Onda de choque na fusão */}
        {shock >= 0 && (
          <circle cx={0} cy={125} r={80 + shock * 360} fill="none" stroke={C.mustard} strokeWidth={10} opacity={1 - shock} />
        )}

        {/* Resultado = 38 µs */}
        {f >= 126 && (
          <g transform={`translate(0 125) scale(${res}) rotate(${wave(f, 28, 2)})`}>
            <Slab x={-330} y={-105} w={660} h={210} r={38} fill={C.mustard} side={C.mustardS} depth={20} />
            <ExText x={0} y={46} size={136} fill={C.ink} side={C.cream} depth={6}>
              = 38 µs
            </ExText>
          </g>
        )}
      </g>
    </g>
  );
};

// ============ CENA 14 — CARRO NO RIO A 11 KM (2370–2634, dur 264) ============
// "Parece pouco?"(1..30) -> "velocidade da luz"(56..92) -> "carro dentro do rio"(167..198) -> "11 quilômetros"(210..236)
export const S14CarIntoRiver: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = { cx: 540, cy: 1090, w: 880, h: 440 };
  const iso = makeIso(tile.cx, tile.cy, tile.w, tile.h);

  // Rota errada do GPS: sai da estrada (0.48, 0.92) -> desvia para fora da ponte e cai no rio em (0.76, 0.52)
  const drive = interpolate(f, [95, 176], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const start = iso(0.48, 0.92);
  const splashPt = iso(0.76, 0.52);
  const bridgePt = iso(0.48, 0.52);
  const carX = start.x + (splashPt.x - start.x) * drive;
  const carY = start.y + (splashPt.y - start.y) * drive;
  const inWater = f >= 174;
  const sink = interpolate(f, [174, 205], [0, 26], clamp);
  const topPop = pop(f, 2, fps, 9);
  const lightBeam = pop(f, 52, fps, 10);
  const kmTag = pop(f, 208, fps, 9);

  return (
    <g>
      <CityTile cx={tile.cx} cy={tile.cy} w={tile.w} h={tile.h} f={f} fps={fps} river={true} />

      {/* Linha vermelha enganosa do GPS desviando da ponte direto pro rio */}
      {f >= 85 && (
        <line
          x1={start.x}
          y1={start.y}
          x2={splashPt.x}
          y2={splashPt.y}
          stroke={C.coral}
          strokeWidth={10}
          strokeDasharray="18 14"
          strokeDashoffset={-f * 2.5}
          strokeLinecap="round"
        />
      )}

      {/* Carro 2.5D isométrico */}
      {f >= 90 && (
        <g transform={`translate(${carX} ${carY + sink}) rotate(${inWater ? 14 + wave(f, 6, 5) : -8})`}>
          <IsoBox x={0} y={0} w={74} h={38} height={22} top={C.coral} left={C.coralD} right="#A63A2F" />
          {!inWater && <IsoBox x={0} y={-18} w={44} h={24} height={16} top={C.cream} left={C.creamD} right="#DFD5C0" />}
        </g>
      )}

      {/* Splash de água flat quando cai no rio! */}
      {inWater &&
        [-55, -25, 0, 28, 56].map((dx, i) => {
          const t = Math.min(1, (f - 174) / 28);
          const dy = -Math.sin(t * Math.PI) * (75 + (i % 2) * 35);
          return (
            <circle
              key={i}
              cx={splashPt.x + dx * (0.5 + t)}
              cy={splashPt.y + dy}
              r={(1 - t * 0.5) * 14}
              fill={C.cream}
              opacity={1 - t * 0.6}
            />
          );
        })}

      {/* Topo da composição central: "? -> × LUZ -> 11 KM" */}
      {f < 208 ? (
        <g transform={`translate(540 575) scale(${f >= 52 ? lightBeam : topPop}) rotate(${wave(f, 28, 2)})`}>
          <Slab
            x={-300}
            y={-85}
            w={600}
            h={170}
            r={34}
            fill={f >= 52 ? C.mustard : C.purple}
            side={f >= 52 ? C.mustardS : C.purpleD}
            depth={18}
          />
          <text
            x={0}
            y={34}
            textAnchor="middle"
            fontFamily={FONT}
            fontWeight={900}
            fontSize={f >= 52 ? 82 : 108}
            fill={f >= 52 ? C.ink : C.cream}
          >
            {f >= 52 ? "38 µs × LUZ" : "POUCO?"}
          </text>
        </g>
      ) : (
        <g>
          <line x1={bridgePt.x} y1={bridgePt.y - 30} x2={splashPt.x} y2={splashPt.y - 30} stroke={C.mustard} strokeWidth={8} />
          <g transform={`translate(540 575) scale(${kmTag}) rotate(${wave(f, 30, 2)})`}>
            <Slab x={-260} y={-85} w={520} h={170} r={34} fill={C.coral} side={C.coralD} depth={18} />
            <ExText x={0} y={38} size={118} fill={C.cream} side={C.ink} depth={8}>
              11 KM!
            </ExText>
          </g>
        </g>
      )}
    </g>
  );
};

// ============ CENA 15 — ENGENHEIROS REPROGRAMAM OS RELÓGIOS (2634–2859, dur 225) ============
// "reprogramar os computadores"(56..97) -> "desacelerar os relógios"(121..162) -> "antes do lançamento"(184..222)
export const S15Engineers: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const termIn = pop(f, 6, fps, 12);
  const tuned = f >= 135;
  const clockRate = tuned ? 2.2 : 24;
  const checkIn = pop(f, 178, fps, 9);

  return (
    <g>
      {/* Terminal 2.5D de bordo */}
      <g transform={`translate(540 ${740 + wave(f, 34, 7)}) scale(${termIn})`}>
        <Shadow cx={0} cy={250} rx={340} ry={24} o={0.25} />
        <Slab x={-370} y={-220} w={740} h={430} r={38} fill={C.slate} side={C.slateD} depth={22} />
        <rect x={-340} y={-160} width={680} height={340} rx={22} fill={C.ink} />
        {/* Botões da janela */}
        <circle cx={-305} cy={-190} r={11} fill={C.coral} />
        <circle cx={-270} cy={-190} r={11} fill={C.mustard} />
        <circle cx={-235} cy={-190} r={11} fill={C.green} />

        {/* Linhas de código aparecendo */}
        {[0, 1, 2].map((i) => {
          const w = interpolate(f, [25 + i * 16, 48 + i * 16], [0, 420 - i * 70], clamp);
          return <rect key={i} x={-295} y={-115 + i * 54} width={w} height={24} rx={12} fill={C.teal} opacity={0.8} />;
        })}

        {/* Linha principal de calibração */}
        {f >= 68 && (
          <g transform={`translate(0 95) scale(${pop(f, 68, fps, 10)})`}>
            <rect x={-300} y={-42} width={600} height={84} rx={18} fill={tuned ? C.green : C.mustard} />
            <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={C.ink}>
              CLOCK −38 µs/DIA
            </text>
          </g>
        )}
      </g>

      {/* Relógio desacelerando e sincronizando abaixo do terminal */}
      <g transform={`translate(540 ${1195 + wave(f, 26, 6)}) scale(${pop(f, 35, fps, 11)})`}>
        <AnalogClock
          cx={0}
          cy={0}
          r={145}
          rim={tuned ? C.green : C.coral}
          rimD={tuned ? C.greenD : C.coralD}
          angleDeg={f * (clockRate * 0.2)}
          minuteDeg={f * clockRate}
        />
        {f >= 178 && (
          <g transform={`translate(145 -95) scale(${checkIn})`}>
            <Disc cx={0} cy={0} r={54} fill={C.green} side={C.greenD} depth={10} />
            <path d="M -22 2 L -6 18 L 26 -16" fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </g>
  );
};

// ============ CENA 16 — 1983: SINAL LIBERADO PARA USO CIVIL (2859–3030, dur 171) ============
// "1983"(9..15) -> "liberou o sinal"(91..117) -> "uso civil mundial"(128..171)
export const S16Timeline1983: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yearS = interpolate(pop(f, 6, fps, 9), [0, 1], [2.2, 1]);
  const unlocked = f >= 90;
  const shackleLift = interpolate(f, [90, 108], [0, -34], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const shackleRot = interpolate(f, [90, 108], [0, 24], clamp);
  const ex = 540,
    ey = 1095,
    er = 205;

  return (
    <g>
      {/* Ano 1983 extrudado */}
      <g transform={`translate(540 565) scale(${yearS}) rotate(${-4 + wave(f, 32, 1.8)})`}>
        <ExText x={0} y={0} size={196} fill={C.mustard} side={C.mustardS} depth={18}>
          1983
        </ExText>
      </g>

      {/* Terra + ondas globais quando o sinal é liberado */}
      <g transform={`translate(0 ${wave(f, 34, 7)})`}>
        {unlocked &&
          [0, 1, 2].map((i) => {
            const rr = er + (((f - 90) * 3.8 + i * 65) % 195);
            return (
              <circle
                key={i}
                cx={ex}
                cy={ey}
                r={rr}
                fill="none"
                stroke={C.teal}
                strokeWidth={7}
                opacity={1 - (rr - er) / 195}
              />
            );
          })}
        <FlatEarth cx={ex} cy={ey} r={er} f={f} clipId="s16-earth" />

        {/* Cadeado 2.5D que se abre em "liberou o sinal" */}
        <g transform={`translate(${ex} ${ey - 10}) scale(${pop(f, 20, fps, 10) * kick(f, 90, 14, 0.2)})`}>
          <g transform={`translate(38 ${-58 + shackleLift}) rotate(${shackleRot}) translate(-38 58)`}>
            <path
              d="M -42 -50 L -42 -92 A 42 42 0 0 1 42 -92 L 42 -50"
              fill="none"
              stroke={C.metal}
              strokeWidth={20}
              strokeLinecap="round"
            />
          </g>
          <Slab
            x={-72}
            y={-56}
            w={144}
            h={120}
            r={26}
            fill={unlocked ? C.teal : C.coral}
            side={unlocked ? C.tealD : C.coralD}
            depth={14}
          />
          <circle cx={0} cy={-4} r={16} fill={C.ink} />
          <rect x={-7} y={4} width={14} height={28} rx={6} fill={C.ink} />
        </g>
      </g>
    </g>
  );
};

// ============ CENA 17 — O MUNDO DEPENDE DESSA DANÇA CÓSMICA (3030–3267, dur 237) ============
// "pedido de comida"(74..97) -> "aviões supersônicos"(104..148) -> "mundo inteiro / dança cósmica"(155..237)
export const S17WorldDependence: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = 540,
    ey = 960,
    er = 165;
  const earthS = pop(f, 0, fps, 12);

  // 4 medalhões 2.5D orbitando: comida, avião, navio, caminhão
  const icons = [
    { delay: 68, col: C.coral, colD: C.coralD, kind: "food" },
    { delay: 102, col: C.mustard, colD: C.mustardS, kind: "plane" },
    { delay: 142, col: C.teal, colD: C.tealD, kind: "ship" },
    { delay: 162, col: C.purple, colD: C.purpleD, kind: "phone" },
  ] as const;

  return (
    <g>
      {/* Órbita externa de satélites ("dança cósmica") */}
      <circle
        cx={ex}
        cy={ey}
        r={355}
        fill="none"
        stroke={C.cream}
        strokeWidth={4}
        strokeDasharray="14 16"
        strokeDashoffset={-f * 2}
        opacity={0.35}
      />

      {/* Linhas conectando os medalhões à Terra */}
      {icons.map((ic, i) => {
        const a = f * 0.018 + (i * Math.PI) / 2;
        const ix = ex + Math.cos(a) * 335;
        const iy = ey + Math.sin(a) * 335;
        return f >= ic.delay ? (
          <line
            key={i}
            x1={ex}
            y1={ey}
            x2={ix}
            y2={iy}
            stroke={C.teal}
            strokeWidth={6}
            strokeDasharray="12 12"
            strokeDashoffset={-f * 2.5}
          />
        ) : null;
      })}

      {/* Globo central */}
      <g transform={`translate(${ex} ${ey}) scale(${earthS}) translate(${-ex} ${-ey + wave(f, 30, 6)})`}>
        <FlatEarth cx={ex} cy={ey} r={er} f={f} clipId="s17-earth" />
      </g>

      {/* Medalhões 2.5D sincronizados */}
      {icons.map((ic, i) => {
        const a = f * 0.018 + (i * Math.PI) / 2;
        const ix = ex + Math.cos(a) * 335;
        const iy = ey + Math.sin(a) * 335;
        const s = pop(f, ic.delay, fps, 9);
        if (s <= 0.02) return null;
        return (
          <g key={i} transform={`translate(${ix} ${iy}) scale(${s})`}>
            <Disc cx={0} cy={0} r={78} fill={ic.col} side={ic.colD} depth={12} />
            {ic.kind === "food" && (
              <g>
                <path d="M -36 4 A 36 30 0 0 1 36 4 Z" fill={C.mustard} />
                <rect x={-38} y={6} width={76} height={12} rx={6} fill={C.green} />
                <rect x={-34} y={20} width={68} height={14} rx={7} fill={C.cream} />
              </g>
            )}
            {ic.kind === "plane" && (
              <polygon points="0,-42 12,-8 44,8 12,14 8,38 -8,38 -12,14 -44,8 -12,-8" fill={C.ink} />
            )}
            {ic.kind === "ship" && (
              <g>
                <polygon points="-40,6 40,6 28,32 -28,32" fill={C.cream} />
                <rect x={-18} y={-22} width={36} height={26} rx={5} fill={C.mustard} />
              </g>
            )}
            {ic.kind === "phone" && (
              <g>
                <rect x={-22} y={-36} width={44} height={72} rx={10} fill={C.ink} />
                <circle cx={0} cy={-4} r={10} fill={C.teal} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

// ============ CENA 18 — CTA: EINSTEIN GUIA SEU DELIVERY + LABORATÓRIO (3267–3400, dur 133) ============
// "Einstein"(19..31) -> "delivery?"(47..69) -> "Comenta aí"(71..88) -> "segue o laboratório!"(98..133)
export const S18CtaLab: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const einIn = pop(f, 8, fps, 10);
  const bagIn = pop(f, 40, fps, 9);
  const commentIn = pop(f, 68, fps, 9);
  const followIn = pop(f, 94, fps, 9) * (1 + Math.sin(f * 0.25) * 0.04);

  return (
    <g>
      {/* Einstein + mochila térmica de delivery */}
      <EinsteinHead x={430} y={680 + wave(f, 22, 8)} s={einIn * 1.05} f={f} />
      {f >= 40 && (
        <g transform={`translate(690 ${720 + wave(f, 18, 9)}) scale(${bagIn}) rotate(${6 + wave(f, 24, 3)})`}>
          <Shadow cx={0} cy={125} rx={95} ry={16} o={0.24} />
          <Slab x={-95} y={-85} w={190} h={175} r={28} fill={C.coral} side={C.coralD} depth={16} />
          <rect x={-65} y={-35} width={130} height={24} rx={10} fill={C.mustard} />
          <circle cx={0} cy={28} r={24} fill={C.cream} />
        </g>
      )}

      {/* Balão de comentário ("Comenta aí") */}
      {f >= 68 && (
        <g transform={`translate(300 ${1035 + wave(f, 20, 6)}) scale(${commentIn}) rotate(${-5 + wave(f, 28, 2)})`}>
          <Slab x={-135} y={-68} w={270} h={136} r={30} fill={C.cream} side={C.creamD} depth={14} />
          <polygon points="-35,68 5,68 -25,105" fill={C.cream} />
          {[-55, 0, 55].map((dx, i) => (
            <circle key={i} cx={dx} cy={wave(f, 6, 8, i)} r={15} fill={C.ink} />
          ))}
        </g>
      )}

      {/* Frasco do Laboratório + Botão SEGUIR ("segue o laboratório!") */}
      {f >= 68 && (
        <g transform={`translate(730 ${1025 + wave(f, 22, 7)}) scale(${commentIn}) rotate(${wave(f, 26, 4)})`}>
          <polygon points="-24,-75 24,-75 24,-25 68,65 -68,65 -24,-25" fill={C.tealD} transform="translate(0 12)" />
          <polygon points="-24,-75 24,-75 24,-25 68,65 -68,65 -24,-25" fill={C.cream} />
          <polygon points="-42,15 42,15 60,56 -60,56" fill={C.teal} />
          <rect x={-32} y={-85} width={64} height={18} rx={9} fill={C.metal} />
          <circle cx={-12} cy={35 - ((f * 2) % 35)} r={8} fill={C.mustard} />
          <circle cx={16} cy={42 - (((f + 12) * 2) % 35)} r={6} fill={C.cream} />
        </g>
      )}

      {f >= 94 && (
        <g transform={`translate(540 1275) scale(${followIn})`}>
          <Slab x={-340} y={-78} w={680} h={156} r={42} fill={C.mustard} side={C.mustardS} depth={20} />
          <text x={0} y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill={C.ink}>
            + LABORATÓRIO
          </text>
        </g>
      )}
    </g>
  );
};
