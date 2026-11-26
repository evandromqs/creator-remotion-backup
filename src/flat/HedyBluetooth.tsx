/**
 * HEDY BLUETOOTH — "A estrela de Hollywood que inventou a base do Bluetooth"
 * Padrão: remotion-flat-25d-shorts (Solid Flat Colors 2.5D, 1080x1920 @ 30fps)
 * Área segura central (~50%), sem elementos no topo (y < 420), legendas na área segura inferior do Instagram.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DynamicCaptions } from "../components/DynamicCaptions";
import hedyScenes from "../data/hedy_scenes.json";
import { C, Disc, ExText, FONT, SceneShell, Shadow, Slab, clamp, kick, pop, wave } from "./primitives";

// ---------- Atores reutilizáveis do vídeo ----------
const BluetoothGlyph: React.FC<{ x: number; y: number; s?: number; f: number; col?: string; side?: string }> = ({
  x,
  y,
  s = 1,
  f,
  col = C.blue,
  side = C.blueD,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${wave(f, 34, 3)})`}>
    <Shadow cx={0} cy={135} rx={85} ry={18} o={0.25} />
    <Slab x={-85} y={-110} w={170} h={220} r={55} fill={col} side={side} depth={18} />
    <path
      d="M -32 -36 L 34 32 L 0 66 L 0 -68 L 34 -34 L -32 34"
      fill="none"
      stroke={C.cream}
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const HeadphoneActor: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${wave(f, 28, 4)})`}>
    <Shadow cx={0} cy={160} rx={130} ry={20} o={0.24} />
    {/* Arco */}
    <path
      d="M -110 20 A 110 115 0 0 1 110 20"
      fill="none"
      stroke={C.slate}
      strokeWidth={28}
      strokeLinecap="round"
    />
    <path
      d="M -110 14 A 110 115 0 0 1 110 14"
      fill="none"
      stroke={C.teal}
      strokeWidth={16}
      strokeLinecap="round"
    />
    {/* Conchas 2.5D */}
    <Slab x={-138} y={-10} w={56} h={108} r={24} fill={C.coral} side={C.coralD} depth={12} />
    <Slab x={82} y={-10} w={56} h={108} r={24} fill={C.coral} side={C.coralD} depth={12} />
    <rect x={-96} y={6} width={18} height={76} rx={9} fill={C.cream} />
    <rect x={78} y={6} width={18} height={76} rx={9} fill={C.cream} />
  </g>
);

const HedyStar: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${wave(f, 28, 3)})`}>
    <Shadow cx={0} cy={145} rx={88} ry={16} o={0.24} />
    {/* Cabelo escuro Hollywood */}
    <circle cx={-56} cy={-16} r={46} fill={C.ink} />
    <circle cx={56} cy={-16} r={46} fill={C.ink} />
    <circle cx={0} cy={-44} r={62} fill={C.ink} />
    {/* Rosto */}
    <Disc cx={0} cy={0} r={68} fill="#F4C7A1" side="#D49E75" depth={8} />
    {/* Olhos piscando */}
    <circle cx={-24} cy={-8} r={8} fill={C.ink} transform={`scale(1 ${f % 65 < 4 ? 0.1 : 1})`} />
    <circle cx={24} cy={-8} r={8} fill={C.ink} transform={`scale(1 ${f % 65 < 4 ? 0.1 : 1})`} />
    {/* Sorriso coral */}
    <path d="M -20 22 Q 0 36 20 22" fill="none" stroke={C.coral} strokeWidth={7} strokeLinecap="round" />
    {/* Estrela de cinema no cabelo */}
    <g transform={`translate(56 -56) rotate(${f * 1.2})`}>
      <path d="M0,-24 L7,-7 L24,-6 L10,5 L14,22 L0,12 L-14,22 L-10,5 L-24,-6 L-7,-7 Z" fill={C.mustard} />
    </g>
  </g>
);

const TorpedoActor: React.FC<{ x: number; y: number; s?: number; jammed?: boolean; f: number }> = ({
  x,
  y,
  s = 1,
  jammed = false,
  f,
}) => (
  <g transform={`translate(${x} ${y + wave(f, 16, 6)}) scale(${s}) rotate(${jammed ? wave(f, 4, 5) : 0})`}>
    <Shadow cx={0} cy={95} rx={150} ry={18} o={0.22} />
    {/* Hélice e barbatanas */}
    <polygon points="-155,-34 -115,0 -155,34" fill={C.coralD} />
    <rect x={-168} y={-24 + wave(f, 3, 6)} width={14} height={48} rx={6} fill={C.mustard} />
    {/* Corpo do torpedo */}
    <Slab x={-125} y={-36} w={250} h={72} r={36} fill={C.metal} side={C.metalD} depth={12} />
    <path d="M 85 -36 A 40 36 0 0 1 85 36 Z" fill={jammed ? C.coral : C.teal} />
    {/* Antena */}
    <line x1={-20} y1={-36} x2={-20} y2={-66} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx={-20} cy={-70} r={10} fill={jammed ? C.coral : C.mustard} />
  </g>
);

const PianoKeys: React.FC<{ x: number; y: number; s?: number; f: number; activeIdx: number }> = ({
  x,
  y,
  s = 1,
  f,
  activeIdx,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow cx={0} cy={135} rx={290} ry={22} o={0.25} />
    <Slab x={-290} y={-95} w={580} h={205} r={24} fill={C.slate} side={C.slateD} depth={18} />
    {/* 8 teclas brancas */}
    {Array.from({ length: 8 }).map((_, i) => {
      const pressed = i === activeIdx % 8;
      const fill = pressed ? C.mustard : C.cream;
      const side = pressed ? C.mustardS : C.creamD;
      return (
        <Slab
          key={i}
          x={-264 + i * 67}
          y={-75 + (pressed ? 8 : 0)}
          w={60}
          h={165}
          r={10}
          fill={fill}
          side={side}
          depth={pressed ? 4 : 12}
        />
      );
    })}
    {/* Teclas pretas */}
    {[0, 1, 3, 4, 5].map((i) => (
      <Slab
        key={i}
        x={-222 + i * 67}
        y={-75}
        w={36}
        h={98}
        r={8}
        fill={C.ink}
        side="#040812"
        depth={8}
      />
    ))}
  </g>
);

// ============ CENA 1 — GANCHO (0–154f) ============
// "Bluetooth@5 ... fone@33 ... atriz@92 Hollywood@110 ... piano@135"
const S1HedyHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btPop = pop(f, 4, fps, 10) * kick(f, 5, 14, 0.16);
  const hpPop = pop(f, 28, fps, 10) * kick(f, 33, 14, 0.15);
  const starPop = pop(f, 88, fps, 9);
  const pianoPop = pop(f, 128, fps, 9);

  return (
    <g>
      {/* Fone + Bluetooth no centro esquerdo */}
      <g transform={`translate(${f >= 88 ? -120 : 0} 0)`}>
        <HeadphoneActor x={540} y={760 + wave(f, 24, 10)} s={hpPop * 1.1} f={f} />
        <BluetoothGlyph x={540} y={960 + wave(f, 26, 8)} s={btPop * 0.72} f={f} />
      </g>

      {/* Atriz de Hollywood */}
      {f >= 88 && (
        <g>
          <HedyStar x={740} y={740 + wave(f, 22, 8)} s={starPop * 1.05} f={f} />
        </g>
      )}

      {/* Piano 2.5D entrando em "e um piano" */}
      {f >= 128 && (
        <PianoKeys x={540} y={1180 + wave(f, 20, 5)} s={pianoPop * 0.9} f={f} activeIdx={Math.floor(f / 5)} />
      )}
    </g>
  );
};

// ============ CENA 2 — TORPEDO BLOQUEADO EM 1942 (154–476f) ============
// "1942@4 ... Hedy@107 ... torpedos@160 ... rádio@205 ... bloqueados@269 inimigo@301"
const S2TorpedoJam: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yr = interpolate(pop(f, 2, fps, 9), [0, 1], [2.1, 1]);
  const hedy = pop(f, 95, fps, 10);
  const torpX = interpolate(f, [155, 270], [210, 480], clamp);
  const jammed = f >= 265;
  const wall = pop(f, 265, fps, 9);
  const shake = jammed && f < 290 ? Math.sin(f * 2.8) * 8 : 0;

  return (
    <g transform={`translate(${shake} 0)`}>
      {/* Carimbo 1942 */}
      <g transform={`translate(${f >= 95 ? 360 : 540} 585) scale(${yr * (f >= 95 ? 0.78 : 1)}) rotate(${-5 + wave(f, 30, 2)})`}>
        <ExText x={0} y={0} size={185} fill={C.mustard} side={C.mustardS} depth={16}>
          1942
        </ExText>
      </g>

      {/* Hedy Lamarr entra em "estrela Hedy Lamarr" */}
      {f >= 95 && <HedyStar x={765} y={595 + wave(f, 22, 8)} s={hedy * 0.95} f={f} />}

      {/* Mar / Submerso 2.5D na faixa central */}
      {f >= 145 && (
        <g>
          <Slab x={110} y={810} w={860} h={430} r={42} fill={C.blueD} side={C.ink} depth={20} />
          <rect x={130} y={830} width={820} height={390} rx={30} fill={C.blue} opacity={0.45} />
          {/* Ondas de rádio tentando guiar o torpedo */}
          {[0, 1, 2].map((i) => {
            const r = ((f * 4 + i * 45) % 135) + 25;
            return (
              <circle
                key={i}
                cx={torpX - 20}
                cy={955}
                r={r}
                fill="none"
                stroke={jammed ? C.coral : C.teal}
                strokeWidth={6}
                opacity={1 - r / 160}
              />
            );
          })}
          <TorpedoActor x={torpX} y={1025} s={1.05} jammed={jammed} f={f} />

          {/* Barreira inimiga bloqueando o sinal */}
          {jammed && (
            <g transform={`translate(780 1025) scale(${wall})`}>
              <Slab x={-48} y={-145} w={96} h={290} r={24} fill={C.coral} side={C.coralD} depth={16} />
              <line x1={-26} y1={-40} x2={26} y2={40} stroke={C.cream} strokeWidth={16} strokeLinecap="round" />
              <line x1={26} y1={-40} x2={-26} y2={40} stroke={C.cream} strokeWidth={16} strokeLinecap="round" />
            </g>
          )}
        </g>
      )}
    </g>
  );
};

// ============ CENA 3 — GEORGE ANTHEIL & PIANO MECÂNICO (476–675f) ============
// "compositor@16 George@37 ... genial@107 ... piano@149 mecânico@159 perfurado@176"
const S3PianoIdea: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hedy = pop(f, 0, fps, 11);
  const george = pop(f, 28, fps, 10);
  const bulb = pop(f, 102, fps, 9);
  const piano = pop(f, 138, fps, 10);
  const rollShift = (f * 3) % 120;

  return (
    <g>
      <HedyStar x={330} y={620 + wave(f, 24, 8)} s={hedy * 0.9} f={f} />

      {/* Compositor George Antheil */}
      <g transform={`translate(750 ${620 + wave(f, 22, 8)}) scale(${george * 0.9}) rotate(${wave(f, 26, 3)})`}>
        <Shadow cx={0} cy={145} rx={82} ry={16} o={0.24} />
        <Disc cx={0} cy={0} r={66} fill="#F2C9A0" side="#CF9F74" depth={8} />
        <path d="M -62 -24 Q 0 -86 62 -24 Z" fill={C.slate} />
        <circle cx={-22} cy={-8} r={8} fill={C.ink} />
        <circle cx={22} cy={-8} r={8} fill={C.ink} />
        <path d="M -18 22 Q 0 34 18 22" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* Notas musicais subindo */}
      {[0, 1, 2].map((i) => (
        <text
          key={i}
          x={640 + i * 75}
          y={530 - ((f * 2 + i * 35) % 80)}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={44}
          fill={C.mustard}
          opacity={0.85}
        >
          ♪
        </text>
      ))}

      {/* Lâmpada da ideia genial */}
      {f >= 102 && (
        <g transform={`translate(540 ${625 + wave(f, 16, 7)}) scale(${bulb * 0.65})`}>
          <Disc cx={0} cy={0} r={74} fill={C.mustard} side={C.mustardS} depth={12} />
          <Slab x={-30} y={68} w={60} h={24} r={8} fill={C.metal} side={C.metalD} depth={6} />
        </g>
      )}

      {/* Rolo perfurado + Teclas de piano */}
      <g transform={`translate(540 945) scale(${pop(f, 75, fps, 10)})`}>
        <Slab x={-260} y={-68} w={520} h={124} r={18} fill={C.cream} side={C.creamD} depth={12} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={-210 + ((i * 85 + rollShift) % 420)} cy={-16 + (i % 2) * 30} r={11} fill={C.ink} />
        ))}
      </g>

      {f >= 138 && (
        <PianoKeys x={540} y={1185 + wave(f, 20, 4)} s={piano * 0.88} f={f} activeIdx={Math.floor(f / 6)} />
      )}
    </g>
  );
};

// ============ CENA 4 — 88 FREQUÊNCIAS EM SINCRONIA (675–909f) ============
// "saltava@14 ... 88@44 frequências@60 ... sincronia@102 ... impossível@137 interceptar@162 ... torpedo@215"
const S4FrequencyHopping: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = pop(f, 38, fps, 9) * kick(f, 44, 14, 0.2);
  const hopStep = Math.floor(f / 10);
  const activeChannel = [1, 4, 2, 5, 0, 3, 2, 4][hopStep % 8];
  const channels = [0, 1, 2, 3, 4, 5];

  return (
    <g>
      {/* Badge 88 FREQUÊNCIAS */}
      <g transform={`translate(540 565) scale(${badge}) rotate(${wave(f, 32, 2)})`}>
        <Slab x={-270} y={-85} w={540} h={170} r={34} fill={C.mustard} side={C.mustardS} depth={18} />
        <ExText x={0} y={38} size={112} fill={C.ink} side={C.cream} depth={6}>
          88 CANAIS
        </ExText>
      </g>

      {/* Painel de salto de frequência em sincronia */}
      <g transform={`translate(540 945)`}>
        <Shadow cx={0} cy={220} rx={360} ry={24} o={0.25} />
        <Slab x={-390} y={-195} w={780} h={390} r={34} fill={C.slate} side={C.slateD} depth={20} />
        <rect x={-360} y={-165} width={720} height={330} rx={22} fill={C.ink} />

        {channels.map((ch) => {
          const cy = -120 + ch * 48;
          const isHot = ch === activeChannel;
          return (
            <g key={ch}>
              <line x1={-320} y1={cy} x2={320} y2={cy} stroke={C.slate} strokeWidth={6} strokeLinecap="round" />
              {isHot && (
                <g>
                  <line x1={-320} y1={cy} x2={320} y2={cy} stroke={C.teal} strokeWidth={10} strokeLinecap="round" />
                  <Disc cx={-260 + ((f * 18) % 520)} cy={cy} r={18} fill={C.teal} side={C.tealD} depth={5} />
                </g>
              )}
              {/* Tentativa falha de interceptação coral num canal errado */}
              {ch === (activeChannel + 2) % 6 && (
                <g transform={`translate(80 ${cy})`}>
                  <circle cx={0} cy={0} r={16} fill={C.coral} opacity={0.85} />
                  <line x1={-8} y1={-8} x2={8} y2={8} stroke={C.cream} strokeWidth={4} />
                  <line x1={8} y1={-8} x2={-8} y2={8} stroke={C.cream} strokeWidth={4} />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Torpedo guiado livremente abaixo */}
      <TorpedoActor x={240 + ((f * 3) % 600)} y={1280} s={0.78} jammed={false} f={f} />
    </g>
  );
};

// ============ CENA 5 — DA GAVETA AO BLUETOOTH (909–1149f) ============
// "engavetou@15 patente@35 ... décadas@79 ... salto@119 ... Bluetooth@183 conexão@206 sem fio@228"
const S5NavyToBluetooth: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isModern = f >= 120;
  const drawerClose = interpolate(f, [15, 50], [0, 1], clamp);
  const modernPop = pop(f, 120, fps, 9) * kick(f, 183, 16, 0.18);

  return (
    <g>
      {!isModern ? (
        /* Pasta da patente sendo engavetada */
        <g transform={`translate(540 ${900 + wave(f, 26, 6)}) scale(${pop(f, 0, fps, 11)})`}>
          <Shadow cx={0} cy={230} rx={260} ry={26} o={0.25} />
          {/* Gaveta da Marinha */}
          <Slab x={-260} y={-80} w={520} h={280} r={28} fill={C.slate} side={C.slateD} depth={22} />
          {/* Patente deslizando para dentro */}
          <g transform={`translate(0 ${interpolate(drawerClose, [0, 1], [-170, 10])}) scale(${1 - drawerClose * 0.25})`}>
            <Slab x={-160} y={-120} w={320} h={200} r={16} fill={C.cream} side={C.creamD} depth={10} />
            <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={C.ink}>
              PATENTE
            </text>
            <text x={0} y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill={C.coral}>
              2,292,387
            </text>
          </g>
          {/* Frente da gaveta fechando */}
          <Slab x={-260} y={20} w={520} h={180} r={24} fill={C.metalD} side={C.slateD} depth={18} />
          <Slab x={-60} y={92} w={120} h={24} r={10} fill={C.ink} side="#000" depth={6} />
        </g>
      ) : (
        /* Transformação no Bluetooth conectando ao fone sem fio */
        <g transform={`scale(${modernPop})`} style={{ transformOrigin: "540px 900px" }}>
          {[0, 1, 2].map((i) => {
            const rr = 120 + (((f - 120) * 5 + i * 75) % 230);
            return (
              <circle
                key={i}
                cx={540}
                cy={760}
                r={rr}
                fill="none"
                stroke={C.teal}
                strokeWidth={7}
                opacity={1 - (rr - 120) / 230}
              />
            );
          })}
          <BluetoothGlyph x={540} y={730} s={1.05} f={f} />
          <HeadphoneActor x={540} y={1145 + wave(f, 20, 8)} s={0.95} f={f} />
        </g>
      )}
    </g>
  );
};

// ============ CENA 6 — CTA EVANDRO LAB (1149–1444f) ============
// "atriz@46 ... fone@99 ... Comenta@134 ... segue@194 canal@204 Evandro@215 Lab@229"
const S6EvandroLabCta: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hedy = pop(f, 6, fps, 10);
  const hp = pop(f, 88, fps, 9);
  const comment = pop(f, 130, fps, 9);
  const follow = pop(f, 190, fps, 9) * (1 + Math.sin(f * 0.25) * 0.04);

  return (
    <g>
      {/* Hedy + Fone sem fio */}
      <HedyStar x={380} y={670 + wave(f, 24, 8)} s={hedy * 0.95} f={f} />
      {f >= 88 && <HeadphoneActor x={700} y={675 + wave(f, 20, 8)} s={hp * 0.85} f={f} />}

      {/* Balão de comentário ("Comenta aqui embaixo") */}
      {f >= 130 && (
        <g transform={`translate(320 ${1010 + wave(f, 20, 6)}) scale(${comment}) rotate(${-5 + wave(f, 28, 2)})`}>
          <Slab x={-135} y={-68} w={270} h={136} r={30} fill={C.cream} side={C.creamD} depth={14} />
          <polygon points="-35,68 5,68 -25,105" fill={C.cream} />
          {[-55, 0, 55].map((dx, i) => (
            <circle key={i} cx={dx} cy={wave(f, 6, 8, i)} r={15} fill={C.ink} />
          ))}
        </g>
      )}

      {/* Frasco Evandro Lab */}
      {f >= 130 && (
        <g transform={`translate(730 ${1005 + wave(f, 22, 7)}) scale(${comment}) rotate(${wave(f, 26, 4)})`}>
          <polygon points="-24,-75 24,-75 24,-25 68,65 -68,65 -24,-25" fill={C.tealD} transform="translate(0 12)" />
          <polygon points="-24,-75 24,-75 24,-25 68,65 -68,65 -24,-25" fill={C.cream} />
          <polygon points="-42,15 42,15 60,56 -60,56" fill={C.teal} />
          <rect x={-32} y={-85} width={64} height={18} rx={9} fill={C.metal} />
          <circle cx={-12} cy={35 - ((f * 2) % 35)} r={8} fill={C.mustard} />
          <circle cx={16} cy={42 - (((f + 12) * 2) % 35)} r={6} fill={C.cream} />
        </g>
      )}

      {/* Botão + EVANDRO LAB ("segue o canal Evandro Lab") */}
      {f >= 190 && (
        <g transform={`translate(540 1255) scale(${follow})`}>
          <Slab x={-360} y={-78} w={720} h={156} r={42} fill={C.mustard} side={C.mustardS} depth={20} />
          <text x={0} y={24} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={66} fill={C.ink}>
            + EVANDRO LAB
          </text>
        </g>
      )}
    </g>
  );
};

// ---------- Orquestração ----------
const HEDY_MAP: Record<string, { Comp: React.FC; accent: string }> = {
  HedyHook: { Comp: S1HedyHook, accent: C.blue },
  TorpedoJam: { Comp: S2TorpedoJam, accent: C.coral },
  PianoIdea: { Comp: S3PianoIdea, accent: C.mustard },
  FrequencyHopping: { Comp: S4FrequencyHopping, accent: C.teal },
  NavyToBluetooth: { Comp: S5NavyToBluetooth, accent: C.blue },
  EvandroLabCta: { Comp: S6EvandroLabCta, accent: C.mustard },
};

export const HedyBluetooth: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    <Audio src={staticFile("hedy_narracao.mp3")} />

    {hedyScenes.scenes.map((scene) => {
      const entry = HEDY_MAP[scene.component] || { Comp: S1HedyHook, accent: C.blue };
      const { Comp, accent } = entry;
      return (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
          <SceneShell accent={accent}>
            <Comp />
          </SceneShell>
        </Sequence>
      );
    })}

    <DynamicCaptions scenes={hedyScenes.scenes} />
  </AbsoluteFill>
);
