/**
 * FLAT SHORT 30s — "Einstein e o GPS" recriado do zero
 * Estilo: Solid Flat Colors 2.5D (extrusões, sombras chapadas, isométrico, parallax)
 * Sincronia: cada cena e cada "beat" seguem os timestamps por palavra da narração (scenes.json)
 *
 *  0–177   Hook        "mapa"(19) "Einstein"(114) "perdido"(152)
 *  177–399 Erro 11 km  "GPS"(228) "erraria"(247) "11 quilômetros"(306) "todo santo dia"(348)
 *  399–597 Sputnik     "1957"(430) "guerra fria"(502) "Sputnik"(569)
 *  597–795 Doppler     "sinal de rádio"(638) "movia"(716) "Doppler"(775)
 *  795–900 A sacada    "sacada genial"(802) "órbita"(871)
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DynamicCaptions } from "../components/DynamicCaptions";

// ---------- Paleta flat ----------
const C = {
  bg: "#14213D",
  bg2: "#1C2E52",
  cream: "#F6EEDF",
  creamD: "#CFC3AC",
  coral: "#FF6B5B",
  coralD: "#C4473A",
  mustard: "#FFC145",
  mustardD: "#D3952080",
  mustardS: "#D39520",
  teal: "#2EC4B6",
  tealD: "#1E8C82",
  blue: "#3A86FF",
  blueD: "#2459B8",
  green: "#7BD389",
  greenD: "#4E9E5C",
  ink: "#0B1426",
  metal: "#DDE3EA",
  metalD: "#8D99AE",
};
const FONT = "Montserrat, 'Arial Black', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Helpers de movimento ----------
const wave = (f: number, speed: number, amp: number, phase = 0) => Math.sin(f / speed + phase) * amp;
const pop = (f: number, delay: number, fps: number, damping = 11) =>
  spring({ frame: f - delay, fps, config: { damping, stiffness: 140, mass: 0.7 } });
const kick = (f: number, at: number, len = 12, amt = 0.14) =>
  f >= at && f < at + len ? 1 + amt * (1 - (f - at) / len) : 1;

// ---------- Primitivas 2.5D ----------
const Slab: React.FC<{ x: number; y: number; w: number; h: number; r?: number; fill: string; side: string; depth?: number }> = ({
  x, y, w, h, r = 18, fill, side, depth = 14,
}) => (
  <g>
    <rect x={x} y={y + depth} width={w} height={h} rx={r} fill={side} />
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
  </g>
);

const Disc: React.FC<{ cx: number; cy: number; r: number; fill: string; side: string; depth?: number }> = ({
  cx, cy, r, fill, side, depth = 14,
}) => (
  <g>
    <circle cx={cx} cy={cy + depth} r={r} fill={side} />
    <circle cx={cx} cy={cy} r={r} fill={fill} />
  </g>
);

const Shadow: React.FC<{ cx: number; cy: number; rx: number; ry: number; o?: number }> = ({ cx, cy, rx, ry, o = 0.28 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity={o} />
);

const ExText: React.FC<{ x: number; y: number; size: number; fill: string; side: string; depth?: number; children: React.ReactNode }> = ({
  x, y, size, fill, side, depth = 12, children,
}) => (
  <g fontFamily={FONT} fontWeight={900} fontSize={size} textAnchor="middle">
    {Array.from({ length: Math.ceil(depth / 2) }).map((_, i) => (
      <text key={i} x={x} y={y + depth - i * 2} fill={side}>{children}</text>
    ))}
    <text x={x} y={y} fill={fill}>{children}</text>
  </g>
);

// Caixa isométrica: (x,y) = centro da base
const IsoBox: React.FC<{ x: number; y: number; w: number; h: number; height: number; top: string; left: string; right: string }> = ({
  x, y, w, h, height, top, left, right,
}) => {
  const t = y - height;
  return (
    <g>
      <polygon points={`${x - w / 2},${t} ${x},${t + h / 2} ${x},${y + h / 2} ${x - w / 2},${y}`} fill={left} />
      <polygon points={`${x},${t + h / 2} ${x + w / 2},${t} ${x + w / 2},${y} ${x},${y + h / 2}`} fill={right} />
      <polygon points={`${x},${t - h / 2} ${x + w / 2},${t} ${x},${t + h / 2} ${x - w / 2},${t}`} fill={top} />
    </g>
  );
};

const makeIso = (cx: number, cy: number, w: number, h: number) => (u: number, v: number) => ({
  x: cx + (u - v) * (w / 2),
  y: cy - h / 2 + (u + v) * (h / 2),
});

const Pin: React.FC<{ x: number; y: number; color: string; dark: string; s?: number; rot?: number }> = ({ x, y, color, dark, s = 1, rot = 0 }) => {
  const d = "M 0 0 C -46 -56 -46 -120 0 -120 C 46 -120 46 -56 0 0 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={d} fill={dark} transform="translate(8 8)" />
      <path d={d} fill={color} />
      <circle cx={0} cy={-80} r={18} fill={C.cream} />
    </g>
  );
};

// Mapa isométrico com ruas e prédios (reaproveitado nas cenas 1 e 2)
const CityTile: React.FC<{ cx: number; cy: number; w: number; h: number; f: number; fps: number; delay?: number }> = ({
  cx, cy, w, h, f, fps, delay = 0,
}) => {
  const iso = makeIso(cx, cy, w, h);
  const blds: [number, number, number, string][] = [
    [0.16, 0.16, 70, C.coral], [0.16, 0.82, 100, C.mustard], [0.82, 0.16, 80, C.teal],
    [0.84, 0.84, 120, C.blue], [0.16, 0.5, 55, C.teal], [0.5, 0.14, 90, C.mustard],
    [0.84, 0.5, 65, C.coral], [0.5, 0.86, 80, C.cream],
  ];
  const shade = (c: string) =>
    c === C.coral ? [C.coralD, "#A63A2F"] : c === C.mustard ? [C.mustardS, "#B07A12"] : c === C.teal ? [C.tealD, "#176E66"] : c === C.blue ? [C.blueD, "#1B448C"] : [C.creamD, "#AFA38C"];
  return (
    <g>
      <Shadow cx={cx} cy={cy + 70} rx={w * 0.55} ry={h * 0.42} o={0.25} />
      <IsoBox x={cx} y={cy + 26} w={w} h={h} height={26} top="#E9E1CF" left="#BFB49D" right="#D6CCB6" />
      {[0.33, 0.67].map((t) => {
        const a = iso(0, t), b = iso(1, t), c = iso(t, 0), d = iso(t, 1);
        return (
          <g key={t} stroke={C.metalD} strokeWidth={22} strokeLinecap="round" opacity={0.55}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
          </g>
        );
      })}
      {blds.map(([u, v, hh, col], i) => {
        const p = iso(u, v);
        const grow = pop(f, delay + 4 + i * 3, fps, 13);
        const [l, r] = shade(col);
        return <IsoBox key={i} x={p.x} y={p.y} w={86} h={43} height={hh * grow + wave(f, 22, 4, i)} top={col} left={l} right={r} />;
      })}
    </g>
  );
};

// ---------- Fundo & casca de cena ----------
const FlatBG: React.FC<{ accent: string }> = ({ accent }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <rect width={1080} height={1920} fill={C.bg} />
        <circle cx={180 + wave(f, 60, 30)} cy={420} r={280} fill={C.bg2} />
        <circle cx={920 + wave(f, 70, 26, 1)} cy={1480} r={360} fill={C.bg2} />
        <circle cx={880} cy={320 + wave(f, 50, 22)} r={110} fill={accent} opacity={0.16} />
        <circle cx={160} cy={1280 + wave(f, 45, 18, 2)} r={70} fill={accent} opacity={0.12} />
        {Array.from({ length: 36 }).map((_, i) => (
          <circle key={i} cx={(i * 197) % 1080} cy={(i * 331) % 1920} r={3 + (i % 3)} fill={C.cream} opacity={0.18 + 0.18 * Math.sin(f / 18 + i)} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clamp);
  const s = interpolate(f, [0, 12], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <FlatBG accent={accent} />
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">{children}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CENA 1 — HOOK (0–177) ============
const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tileY = interpolate(pop(f, 0, fps, 14), [0, 1], [300, 0]);
  const phoneIn = pop(f, 6, fps, 12);
  const lost = f >= 152;
  const jit = lost ? Math.sin(f * 2.3) * 7 : 0;
  const pinDrop = interpolate(pop(f, 19, fps, 8), [0, 1], [-520, 0]);
  const slide = interpolate(f, [152, 177], [0, 150], clamp);
  const ein = pop(f, 114, fps, 10);
  const routeLen = 420;
  const routeDraw = interpolate(f, [24, 90], [routeLen, 0], clamp);
  const ring = (f % 40) / 40;
  const tile = { cx: 540, cy: 1130 + tileY, w: 820, h: 410 };
  const pinX = tile.cx + slide;
  const pinY = tile.cy + pinDrop;

  return (
    <g transform={`translate(${jit} 0)`}>
      {/* Einstein — surge exatamente em "Einstein" */}
      <g transform={`translate(840 520) scale(${ein}) rotate(${wave(f, 25, 4)})`}>
        <Shadow cx={0} cy={150} rx={90} ry={16} />
        {[[-80, -40], [-60, -95], [0, -120], [60, -95], [80, -40], [-95, 20], [95, 20]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y + wave(f, 12, 3, i)} r={44} fill="#FFFFFF" />
        ))}
        <Disc cx={0} cy={0} r={82} fill="#F2C9A0" side="#CF9F74" depth={8} />
        <circle cx={-28} cy={-10} r={9} fill={C.ink} transform={`scale(1 ${f % 60 < 4 ? 0.1 : 1})`} />
        <circle cx={28} cy={-10} r={9} fill={C.ink} transform={`scale(1 ${f % 60 < 4 ? 0.1 : 1})`} />
        <path d="M -42 28 Q 0 6 42 28 Q 22 46 0 34 Q -22 46 -42 28 Z" fill="#E6E6E6" />
      </g>

      <CityTile cx={tile.cx} cy={tile.cy} w={tile.w} h={tile.h} f={f} fps={fps} delay={2} />

      {/* Pulso no chão + pino que cai em "mapa" e se perde em "perdido" */}
      {f >= 30 && (
        <ellipse cx={pinX} cy={pinY} rx={40 + ring * 110} ry={(40 + ring * 110) / 2} fill="none" stroke={lost ? C.coral : C.teal} strokeWidth={6} opacity={1 - ring} />
      )}
      {f >= 19 && <Pin x={pinX} y={pinY} color={lost ? C.coral : C.teal} dark={lost ? C.coralD : C.tealD} s={1.15} rot={lost ? wave(f, 3, 14) : 0} />}

      {/* Celular flutuando */}
      <g transform={`translate(${540 + wave(f, 40, 10)} ${640 + wave(f, 30, 14) + (1 - phoneIn) * 500}) rotate(${-6 + wave(f, 45, 2.5)})`}>
        <Shadow cx={0} cy={330} rx={130} ry={20} o={0.2} />
        <Slab x={-150} y={-270} w={300} h={540} r={46} fill={C.ink} side="#050A14" depth={22} />
        <rect x={-130} y={-248} width={260} height={496} rx={32} fill={lost ? "#3A1E2A" : "#183A5A"} />
        <path d="M -70 180 L -70 60 L 20 60 L 20 -60 L 80 -60 L 80 -170" fill="none" stroke={lost ? C.coral : C.teal} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={routeLen} strokeDashoffset={routeDraw} />
        <circle cx={-70} cy={180} r={16} fill={C.mustard} />
        <circle cx={80} cy={-170} r={16 * kick(f, 90, 14, 0.4)} fill={lost ? C.coral : C.teal} />
        <rect x={-40} y={-240} width={80} height={18} rx={9} fill="#050A14" />
      </g>

      {/* "?" em "perdido" */}
      {[[230, 820, 0], [860, 800, 4], [190, 1000, 8]].map(([x, y, d], i) => {
        const s = pop(f, 152 + d, fps, 8);
        return f >= 152 + d ? (
          <g key={i} transform={`translate(${x} ${y + wave(f, 8, 8, i)}) scale(${s}) rotate(${wave(f, 10, 12, i)})`}>
            <ExText x={0} y={0} size={130} fill={C.mustard} side={C.mustardS} depth={10}>?</ExText>
          </g>
        ) : null;
      })}
    </g>
  );
};

// ============ CENA 2 — ERRO DE 11 KM (177–399) ============
const S2Drift: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = { cx: 540, cy: 1080, w: 900, h: 450 };
  const iso = makeIso(tile.cx, tile.cy, tile.w, tile.h);
  const real = iso(0.3, 0.62);
  const far = iso(0.88, 0.14);
  const p = interpolate(f, [70, 200], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const gps = { x: real.x + (far.x - real.x) * p, y: real.y + (far.y - real.y) * p };
  const km = interpolate(f, [70, 137], [0, 11], { ...clamp, easing: Easing.out(Easing.cubic) });
  const badge = pop(f, 55, fps, 10) * kick(f, 129, 14, 0.18);
  const shake = f >= 129 && f < 150 ? Math.sin(f * 3) * 6 : 0;
  const cal = pop(f, 171, fps, 10);
  const day = Math.min(31, 1 + Math.max(0, Math.floor((f - 171) / 3)));

  return (
    <g transform={`translate(${shake} 0)`}>
      <CityTile cx={tile.cx} cy={tile.cy} w={tile.w} h={tile.h} f={f} fps={fps} />
      {f >= 70 && (
        <line x1={real.x} y1={real.y} x2={gps.x} y2={gps.y} stroke={C.coral} strokeWidth={8} strokeDasharray="18 16" strokeDashoffset={-f * 2} strokeLinecap="round" />
      )}
      <Pin x={real.x} y={real.y} color={C.teal} dark={C.tealD} s={pop(f, 8, fps)} />
      {f >= 51 && <Pin x={gps.x} y={gps.y - wave(f, 6, 6)} color={C.coral} dark={C.coralD} s={pop(f, 51, fps)} rot={wave(f, 9, 6)} />}

      {/* Contador sincronizado com "erraria" → "11 quilômetros" */}
      <g transform={`translate(540 520) scale(${badge}) rotate(${wave(f, 40, 2)})`}>
        <Slab x={-270} y={-95} w={540} h={190} r={36} fill={C.coral} side={C.coralD} depth={20} />
        <text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={128} fill={C.cream}>
          {km.toFixed(km >= 10.95 ? 0 : 1)} KM
        </text>
      </g>

      {/* Calendário em "todo santo dia" */}
      {f >= 171 && (
        <g transform={`translate(170 1340) scale(${cal}) rotate(${-8 + wave(f, 20, 3)})`}>
          <Slab x={-95} y={-100} w={190} h={200} r={22} fill={C.cream} side={C.creamD} depth={14} />
          <rect x={-95} y={-100} width={190} height={56} rx={22} fill={C.coral} />
          <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.ink}>{day}</text>
        </g>
      )}
    </g>
  );
};

// ============ CENA 3 — SPUTNIK 1957 (399–597) ============
const Sputnik: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${wave(f, 20, 10)})`}>
    {[[-80, 60], [-90, 25], [-70, 85], [-95, 45]].map(([dx, dy], i) => (
      <line key={i} x1={0} y1={0} x2={dx} y2={dy} stroke={C.metalD} strokeWidth={5} strokeLinecap="round" />
    ))}
    <Disc cx={0} cy={0} r={34} fill={C.metal} side={C.metalD} depth={6} />
    <circle cx={-10} cy={-12} r={10} fill="#FFFFFF" />
  </g>
);

const S3Sputnik: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = 540, ey = 1040, er = 250;
  const a = f * 0.04 + 2.2;
  const sx = ex + Math.cos(a) * 400;
  const sy = ey + Math.sin(a) * 130;
  const behind = Math.sin(a) < 0;
  const stamp = interpolate(pop(f, 31, fps, 9), [0, 1], [2.4, 1]);
  const stampO = interpolate(f, [31, 36], [0, 1], clamp);
  const cold = pop(f, 103, fps, 9);
  const earthIn = pop(f, 0, fps, 13);
  const shift = ((f * 1.4) % 700) - 350;

  return (
    <g>
      <defs>
        <clipPath id="s3-earth"><circle cx={ex} cy={ey} r={er} /></clipPath>
      </defs>
      <ellipse cx={ex} cy={ey} rx={400} ry={130} fill="none" stroke={C.cream} strokeWidth={4} strokeDasharray="14 14" strokeDashoffset={-f * 1.5} opacity={0.45} />
      {behind && <Sputnik x={sx} y={sy} f={f} />}
      <g transform={`translate(${ex} ${ey}) scale(${earthIn}) translate(${-ex} ${-ey + wave(f, 35, 8)})`}>
        <Shadow cx={ex} cy={ey + er + 60} rx={er * 0.9} ry={28} />
        <Disc cx={ex} cy={ey} r={er} fill={C.blue} side={C.blueD} depth={26} />
        <g clipPath="url(#s3-earth)">
          {[-700, 0, 700].map((o) => (
            <g key={o} transform={`translate(${shift + o} 0)`} fill={C.green}>
              <path d={`M ${ex - 150} ${ey - 120} q 80 -60 150 0 q 40 80 -20 140 q -90 40 -130 -40 z`} />
              <path d={`M ${ex + 90} ${ey - 40} q 90 -20 110 60 q -10 90 -90 100 q -40 -80 -20 -160 z`} />
              <circle cx={ex - 40} cy={ey + 150} r={36} />
            </g>
          ))}
          <path d={`M ${ex - er} ${ey} A ${er} ${er} 0 0 0 ${ex + er} ${ey} L ${ex + er} ${ey + er} L ${ex - er} ${ey + er} Z`} fill="#000" opacity={0.14} />
        </g>
      </g>
      {!behind && <Sputnik x={sx} y={sy} f={f} />}

      {/* Bipes do Sputnik em "Sputnik" */}
      {f >= 170 && [0, 1, 2].map((i) => {
        const r = ((f - 170) * 4 + i * 40) % 120;
        return <circle key={i} cx={sx} cy={sy} r={40 + r} fill="none" stroke={C.mustard} strokeWidth={5} opacity={1 - r / 120} />;
      })}

      {/* Carimbo "1957" */}
      {f >= 31 && (
        <g opacity={stampO} transform={`translate(540 600) scale(${stamp}) rotate(${-6 + wave(f, 30, 1.5)})`}>
          <ExText x={0} y={0} size={210} fill={C.mustard} side={C.mustardS} depth={18}>1957</ExText>
        </g>
      )}

      {/* "guerra fria": estrela vermelha × floco de neve */}
      {f >= 103 && (
        <g>
          <g transform={`translate(150 540) scale(${cold}) rotate(${wave(f, 18, 8)})`}>
            <path d="M0,-60 L17,-20 L60,-18 L26,10 L37,52 L0,28 L-37,52 L-26,10 L-60,-18 L-17,-20 Z" fill={C.coralD} transform="translate(5 7)" />
            <path d="M0,-60 L17,-20 L60,-18 L26,10 L37,52 L0,28 L-37,52 L-26,10 L-60,-18 L-17,-20 Z" fill={C.coral} />
          </g>
          <g transform={`translate(930 540) scale(${cold}) rotate(${f * 1.2})`} stroke={C.teal} strokeWidth={12} strokeLinecap="round">
            {[0, 60, 120].map((d) => (
              <line key={d} x1={0} y1={-56} x2={0} y2={56} transform={`rotate(${d})`} />
            ))}
          </g>
        </g>
      )}
    </g>
  );
};

// ============ CENA 4 — EFEITO DOPPLER (597–795) ============
const satPos = (t: number) => {
  const x = interpolate(t, [0, 197], [190, 890], clamp);
  const k = interpolate(t, [0, 197], [0, Math.PI], clamp);
  return { x, y: 740 - Math.sin(k) * 85 };
};

const S4Doppler: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sat = satPos(f);
  const dish = { x: 600, y: 1150 };
  const ang = (Math.atan2(sat.y - dish.y, sat.x - dish.x) * 180) / Math.PI + 90;
  const needle = interpolate(sat.x, [190, 540, 890], [60, 0, -60]) + wave(f, 2, 3);
  const gauge = pop(f, 20, fps, 12) * kick(f, 178, 16, 0.22);
  const groundIn = interpolate(pop(f, 0, fps, 14), [0, 1], [180, 0]);
  const waves: React.ReactNode[] = [];
  for (let t = 41; t <= f; t += 10) {
    const r = (f - t) * 4.6;
    if (r > 400 || r <= 0) continue;
    const c = satPos(t);
    const o = 1 - r / 400;
    waves.push(
      <g key={t} opacity={o} strokeWidth={7} fill="none">
        <path d={`M ${c.x} ${c.y - r} A ${r} ${r} 0 0 1 ${c.x} ${c.y + r}`} stroke={C.blue} />
        <path d={`M ${c.x} ${c.y + r} A ${r} ${r} 0 0 1 ${c.x} ${c.y - r}`} stroke={C.coral} />
      </g>
    );
  }

  return (
    <g>
      {waves}
      {/* Satélite cruzando o céu */}
      <g transform={`translate(${sat.x} ${sat.y}) scale(1.1) rotate(${wave(f, 25, 6)})`}>
        <Slab x={-150} y={-30} w={95} h={60} r={8} fill={C.blue} side={C.blueD} depth={8} />
        <Slab x={55} y={-30} w={95} h={60} r={8} fill={C.blue} side={C.blueD} depth={8} />
        <rect x={-58} y={-6} width={116} height={12} fill={C.metalD} />
        <Slab x={-42} y={-52} w={84} h={104} r={14} fill={C.mustard} side={C.mustardS} depth={10} />
        <circle cx={0} cy={-18} r={10} fill={f % 20 < 10 ? C.teal : C.cream} />
      </g>

      <g transform={`translate(0 ${groundIn})`}>
        <Shadow cx={540} cy={1315} rx={420} ry={95} o={0.26} />
        {/* Plataforma 2.5D dentro da área segura */}
        <ellipse cx={540} cy={1255 + 32} rx={410} ry={105} fill={C.greenD} />
        <ellipse cx={540} cy={1255} rx={410} ry={105} fill={C.green} />
        {/* Antena receptora apontando continuamente para o satélite */}
        <Slab x={dish.x - 22} y={dish.y} w={44} h={92} r={8} fill={C.metal} side={C.metalD} depth={8} />
        <g transform={`translate(${dish.x} ${dish.y}) rotate(${ang})`}>
          <path d="M -95 0 A 95 54 0 0 0 95 0 Z" fill={C.creamD} transform="translate(0 10)" />
          <path d="M -95 0 A 95 54 0 0 0 95 0 Z" fill={C.cream} />
          <line x1={0} y1={0} x2={0} y2={-72} stroke={C.metalD} strokeWidth={6} />
          <circle cx={0} cy={-76} r={11} fill={C.coral} />
        </g>
        {/* Medidor de frequência — desvia do azul p/ coral e pulsa em "Doppler" */}
        <g transform={`translate(300 1185) scale(${gauge}) rotate(${wave(f, 35, 2)})`}>
          <Slab x={-120} y={-80} w={240} h={150} r={24} fill={C.cream} side={C.creamD} depth={14} />
          <path d="M -80 40 A 80 80 0 0 1 80 40" fill="none" stroke={C.blue} strokeWidth={15} />
          <path d="M -80 40 A 80 80 0 0 1 0 -40" fill="none" stroke={C.coral} strokeWidth={15} />
          <line x1={0} y1={40} x2={0} y2={-48} stroke={C.ink} strokeWidth={8} strokeLinecap="round" transform={`rotate(${needle} 0 40)`} />
          <circle cx={0} cy={40} r={12} fill={C.ink} />
        </g>
      </g>
    </g>
  );
};

// ============ CENA 5 — A SACADA GENIAL (795–900) ============
// "A sacada(802) genial(816) foi:(833) se sabemos(853) a órbita(871) do satélite..."
const S5Idea: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bulb = pop(f, 5, fps, 9);
  const lift = interpolate(f, [36, 58], [160, -110], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bulbScale = interpolate(f, [36, 58], [1.05, 0.78], clamp);
  const earth = pop(f, 38, fps, 11);
  const orbitLen = 1360;
  const orbitDraw = interpolate(f, [46, 78], [orbitLen, 0], clamp);
  const pin = pop(f, 62, fps, 9);
  const ex = 540, ey = 1120, er = 185;

  return (
    <g>
      <defs>
        <clipPath id="s5-earth"><circle cx={ex} cy={ey} r={er} /></clipPath>
      </defs>

      {/* Órbita + 3 satélites triangulando um ponto na Terra ("se sabemos a órbita do satélite") */}
      {f >= 38 && (
        <g transform={`translate(${ex} ${ey}) scale(${earth}) translate(${-ex} ${-ey + wave(f, 32, 6)})`}>
          <Shadow cx={ex} cy={ey + er + 48} rx={er * 0.9} ry={24} />
          <ellipse
            cx={ex}
            cy={ey}
            rx={330}
            ry={112}
            fill="none"
            stroke={C.cream}
            strokeWidth={6}
            strokeDasharray={orbitLen}
            strokeDashoffset={orbitDraw}
            opacity={0.7}
          />
          <Disc cx={ex} cy={ey} r={er} fill={C.blue} side={C.blueD} depth={22} />
          <g clipPath="url(#s5-earth)">
            <g transform={`translate(${wave(f, 45, 22)} 0)`} fill={C.green}>
              <path d={`M ${ex - 110} ${ey - 95} q 80 -55 145 12 q 15 80 -65 105 q -80 -5 -80 -117 z`} />
              <circle cx={ex + 75} cy={ey + 70} r={42} />
            </g>
            <path d={`M ${ex - er} ${ey} A ${er} ${er} 0 0 0 ${ex + er} ${ey} L ${ex + er} ${ey + er} L ${ex - er} ${ey + er} Z`} fill="#000" opacity={0.14} />
          </g>
          {[0, 1, 2].map((i) => {
            const a = f * 0.055 + i * ((2 * Math.PI) / 3);
            const x = ex + Math.cos(a) * 330;
            const y = ey + Math.sin(a) * 112;
            return (
              <g key={i}>
                {f >= 58 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={ex}
                    y2={ey - 18}
                    stroke={C.teal}
                    strokeWidth={6}
                    strokeDasharray="12 12"
                    strokeDashoffset={-f * 2.5}
                    strokeLinecap="round"
                  />
                )}
                <Disc cx={x} cy={y} r={22} fill={C.mustard} side={C.mustardS} depth={6} />
              </g>
            );
          })}
          {f >= 62 && <Pin x={ex} y={ey - 12} color={C.coral} dark={C.coralD} s={pin * 0.85} />}
        </g>
      )}

      {/* Lâmpada 2.5D — acende em "sacada genial" e sobe abrindo espaço para o globo */}
      <g transform={`translate(540 ${720 + lift + wave(f, 20, 8)}) scale(${bulb * bulbScale}) rotate(${wave(f, 30, 4)})`}>
        <g transform={`rotate(${f * 1.5})`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={-9} y={-235 - wave(f, 6, 14, i)} width={18} height={54} rx={9} fill={C.mustard} transform={`rotate(${i * 36})`} />
          ))}
        </g>
        <Disc cx={0} cy={-30} r={132} fill={C.mustard} side={C.mustardS} depth={18} />
        <circle cx={-46} cy={-76} r={32} fill="#FFFFFF" opacity={0.65} />
        <Slab x={-58} y={92} w={116} h={34} r={10} fill={C.metal} side={C.metalD} depth={8} />
        <Slab x={-46} y={136} w={92} h={28} r={10} fill={C.metal} side={C.metalD} depth={8} />
      </g>
    </g>
  );
};

// ---------- Composição ----------
const BEATS: { Comp: React.FC; from: number; dur: number; accent: string }[] = [
  { Comp: S1Hook, from: 0, dur: 177, accent: C.teal },
  { Comp: S2Drift, from: 177, dur: 222, accent: C.coral },
  { Comp: S3Sputnik, from: 399, dur: 198, accent: C.mustard },
  { Comp: S4Doppler, from: 597, dur: 198, accent: C.blue },
  { Comp: S5Idea, from: 795, dur: 105, accent: C.mustard },
];

export const FlatShort30s: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
    <Audio src={staticFile("narracao.mp3")} endAt={900} />
    {BEATS.map(({ Comp, from, dur, accent }) => (
      <Sequence key={from} from={from} durationInFrames={dur}>
        <SceneShell accent={accent}>
          <Comp />
        </SceneShell>
      </Sequence>
    ))}
    <DynamicCaptions />
  </AbsoluteFill>
);
