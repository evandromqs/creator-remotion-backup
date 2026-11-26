import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

export const C = {
  bg: "#14213D",
  bg2: "#1C2E52",
  cream: "#F6EEDF",
  creamD: "#CFC3AC",
  coral: "#FF6B5B",
  coralD: "#C4473A",
  mustard: "#FFC145",
  mustardS: "#D39520",
  teal: "#2EC4B6",
  tealD: "#1E8C82",
  blue: "#3A86FF",
  blueD: "#2459B8",
  green: "#7BD389",
  greenD: "#4E9E5C",
  purple: "#8B5CF6",
  purpleD: "#5B34B8",
  ink: "#0B1426",
  slate: "#1F2F4A",
  slateD: "#101A2C",
  metal: "#DDE3EA",
  metalD: "#8D99AE",
};

export const FONT = "Montserrat, 'Arial Black', sans-serif";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const wave = (f: number, speed: number, amp: number, phase = 0) =>
  Math.sin(f / speed + phase) * amp;

export const pop = (f: number, delay: number, fps: number, damping = 11) =>
  spring({ frame: f - delay, fps, config: { damping, stiffness: 140, mass: 0.7 } });

export const kick = (f: number, at: number, len = 12, amt = 0.15) =>
  f >= at && f < at + len ? 1 + amt * (1 - (f - at) / len) : 1;

export const Slab: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  fill: string;
  side: string;
  depth?: number;
}> = ({ x, y, w, h, r = 18, fill, side, depth = 14 }) => (
  <g>
    <rect x={x} y={y + depth} width={w} height={h} rx={r} fill={side} />
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
  </g>
);

export const Disc: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
  side: string;
  depth?: number;
}> = ({ cx, cy, r, fill, side, depth = 14 }) => (
  <g>
    <circle cx={cx} cy={cy + depth} r={r} fill={side} />
    <circle cx={cx} cy={cy} r={r} fill={fill} />
  </g>
);

export const Shadow: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  o?: number;
}> = ({ cx, cy, rx, ry, o = 0.28 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity={o} />
);

export const ExText: React.FC<{
  x: number;
  y: number;
  size: number;
  fill: string;
  side: string;
  depth?: number;
  children: React.ReactNode;
}> = ({ x, y, size, fill, side, depth = 12, children }) => (
  <g fontFamily={FONT} fontWeight={900} fontSize={size} textAnchor="middle">
    {Array.from({ length: Math.ceil(depth / 2) }).map((_, i) => (
      <text key={i} x={x} y={y + depth - i * 2} fill={side}>
        {children}
      </text>
    ))}
    <text x={x} y={y} fill={fill}>
      {children}
    </text>
  </g>
);

export const IsoBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  top: string;
  left: string;
  right: string;
}> = ({ x, y, w, h, height, top, left, right }) => {
  const t = y - height;
  return (
    <g>
      <polygon points={`${x - w / 2},${t} ${x},${t + h / 2} ${x},${y + h / 2} ${x - w / 2},${y}`} fill={left} />
      <polygon points={`${x},${t + h / 2} ${x + w / 2},${t} ${x + w / 2},${y} ${x},${y + h / 2}`} fill={right} />
      <polygon points={`${x},${t - h / 2} ${x + w / 2},${t} ${x},${t + h / 2} ${x - w / 2},${t}`} fill={top} />
    </g>
  );
};

export const makeIso = (cx: number, cy: number, w: number, h: number) => (u: number, v: number) => ({
  x: cx + (u - v) * (w / 2),
  y: cy - h / 2 + (u + v) * (h / 2),
});

export const Pin: React.FC<{
  x: number;
  y: number;
  color: string;
  dark: string;
  s?: number;
  rot?: number;
}> = ({ x, y, color, dark, s = 1, rot = 0 }) => {
  const d = "M 0 0 C -46 -56 -46 -120 0 -120 C 46 -120 46 -56 0 0 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={d} fill={dark} transform="translate(8 8)" />
      <path d={d} fill={color} />
      <circle cx={0} cy={-80} r={18} fill={C.cream} />
    </g>
  );
};

export const CityTile: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  f: number;
  fps: number;
  delay?: number;
  river?: boolean;
}> = ({ cx, cy, w, h, f, fps, delay = 0, river = false }) => {
  const iso = makeIso(cx, cy, w, h);
  const blds: [number, number, number, string][] = river
    ? [
        [0.16, 0.18, 75, C.coral],
        [0.18, 0.82, 95, C.mustard],
        [0.84, 0.18, 85, C.teal],
        [0.84, 0.84, 110, C.blue],
      ]
    : [
        [0.16, 0.16, 70, C.coral],
        [0.16, 0.82, 100, C.mustard],
        [0.82, 0.16, 80, C.teal],
        [0.84, 0.84, 120, C.blue],
        [0.16, 0.5, 55, C.teal],
        [0.5, 0.14, 90, C.mustard],
        [0.84, 0.5, 65, C.coral],
        [0.5, 0.86, 80, C.cream],
      ];
  const shade = (c: string) =>
    c === C.coral
      ? [C.coralD, "#A63A2F"]
      : c === C.mustard
      ? [C.mustardS, "#B07A12"]
      : c === C.teal
      ? [C.tealD, "#176E66"]
      : c === C.blue
      ? [C.blueD, "#1B448C"]
      : [C.creamD, "#AFA38C"];

  const rA = iso(0, 0.52);
  const rB = iso(1, 0.52);
  const rdA = iso(0.48, 0);
  const rdB = iso(0.48, 1);
  const br = iso(0.48, 0.52);

  return (
    <g>
      <Shadow cx={cx} cy={cy + 70} rx={w * 0.55} ry={h * 0.42} o={0.25} />
      <IsoBox x={cx} y={cy + 26} w={w} h={h} height={26} top="#E9E1CF" left="#BFB49D" right="#D6CCB6" />
      {river ? (
        <g>
          {/* Rio azul isométrico cortando o mapa */}
          <line x1={rA.x} y1={rA.y} x2={rB.x} y2={rB.y} stroke={C.blueD} strokeWidth={66} strokeLinecap="round" />
          <line x1={rA.x} y1={rA.y - 4} x2={rB.x} y2={rB.y - 4} stroke={C.blue} strokeWidth={58} strokeLinecap="round" />
          <line
            x1={rA.x + 25}
            y1={rA.y - 6}
            x2={rB.x - 25}
            y2={rB.y - 6}
            stroke={C.cream}
            strokeWidth={5}
            strokeDasharray="20 26"
            strokeDashoffset={-f * 2.2}
            opacity={0.55}
          />
          {/* Estrada + ponte */}
          <line x1={rdA.x} y1={rdA.y} x2={rdB.x} y2={rdB.y} stroke={C.slate} strokeWidth={34} strokeLinecap="round" />
          <IsoBox x={br.x} y={br.y + 6} w={110} h={56} height={14} top={C.metal} left={C.metalD} right="#BAC4D0" />
        </g>
      ) : (
        [0.33, 0.67].map((t) => {
          const a = iso(0, t),
            b = iso(1, t),
            c = iso(t, 0),
            d = iso(t, 1);
          return (
            <g key={t} stroke={C.metalD} strokeWidth={22} strokeLinecap="round" opacity={0.55}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} />
            </g>
          );
        })
      )}
      {blds.map(([u, v, hh, col], i) => {
        const p = iso(u, v);
        const grow = pop(f, delay + 4 + i * 3, fps, 13);
        const [l, r] = shade(col);
        return (
          <IsoBox
            key={i}
            x={p.x}
            y={p.y}
            w={86}
            h={43}
            height={hh * grow + wave(f, 22, 4, i)}
            top={col}
            left={l}
            right={r}
          />
        );
      })}
    </g>
  );
};

export const EinsteinHead: React.FC<{ x: number; y: number; s?: number; f: number }> = ({
  x,
  y,
  s = 1,
  f,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${wave(f, 25, 4)})`}>
    <Shadow cx={0} cy={145} rx={90} ry={16} />
    {[
      [-80, -40],
      [-60, -95],
      [0, -120],
      [60, -95],
      [80, -40],
      [-95, 20],
      [95, 20],
    ].map(([hx, hy], i) => (
      <circle key={i} cx={hx} cy={hy + wave(f, 12, 3, i)} r={44} fill="#FFFFFF" />
    ))}
    <Disc cx={0} cy={0} r={82} fill="#F2C9A0" side="#CF9F74" depth={8} />
    <circle cx={-28} cy={-10} r={9} fill={C.ink} transform={`scale(1 ${f % 60 < 4 ? 0.1 : 1})`} />
    <circle cx={28} cy={-10} r={9} fill={C.ink} transform={`scale(1 ${f % 60 < 4 ? 0.1 : 1})`} />
    <path d="M -42 28 Q 0 6 42 28 Q 22 46 0 34 Q -22 46 -42 28 Z" fill="#E6E6E6" />
  </g>
);

export const FlatEarth: React.FC<{
  cx: number;
  cy: number;
  r: number;
  f: number;
  clipId: string;
}> = ({ cx, cy, r, f, clipId }) => {
  const shift = ((f * 1.4) % (r * 2.8)) - r * 1.4;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <Shadow cx={cx} cy={cy + r + 52} rx={r * 0.88} ry={24} />
      <Disc cx={cx} cy={cy} r={r} fill={C.blue} side={C.blueD} depth={Math.round(r * 0.1)} />
      <g clipPath={`url(#${clipId})`}>
        {[-r * 2.8, 0, r * 2.8].map((o, idx) => (
          <g key={idx} transform={`translate(${shift + o} 0)`} fill={C.green}>
            <path
              d={`M ${cx - r * 0.6} ${cy - r * 0.48} q ${r * 0.32} ${-r * 0.24} ${r * 0.6} 0 q ${r * 0.16} ${r * 0.32} ${-r * 0.08} ${r * 0.56} q ${-r * 0.36} ${r * 0.16} ${-r * 0.52} ${-r * 0.16} z`}
            />
            <path
              d={`M ${cx + r * 0.36} ${cy - r * 0.16} q ${r * 0.36} ${-r * 0.08} ${r * 0.44} ${r * 0.24} q ${-r * 0.04} ${r * 0.36} ${-r * 0.36} ${r * 0.4} q ${-r * 0.16} ${-r * 0.32} ${-r * 0.08} ${-r * 0.64} z`}
            />
            <circle cx={cx - r * 0.16} cy={cy + r * 0.6} r={r * 0.14} />
          </g>
        ))}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy} L ${cx + r} ${cy + r} L ${cx - r} ${cy + r} Z`}
          fill="#000"
          opacity={0.14}
        />
      </g>
    </g>
  );
};

export const FlatSatellite: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  f: number;
}> = ({ x, y, s = 1, rot = 0, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <Slab x={-150} y={-30} w={95} h={60} r={8} fill={C.blue} side={C.blueD} depth={8} />
    <Slab x={55} y={-30} w={95} h={60} r={8} fill={C.blue} side={C.blueD} depth={8} />
    <rect x={-58} y={-6} width={116} height={12} fill={C.metalD} />
    <Slab x={-42} y={-52} w={84} h={104} r={14} fill={C.mustard} side={C.mustardS} depth={10} />
    <circle cx={0} cy={-18} r={10} fill={f % 20 < 10 ? C.teal : C.cream} />
  </g>
);

export const AnalogClock: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rim: string;
  rimD: string;
  angleDeg: number;
  minuteDeg?: number;
}> = ({ cx, cy, r, rim, rimD, angleDeg, minuteDeg }) => {
  const mDeg = minuteDeg ?? angleDeg * 12;
  return (
    <g>
      <Disc cx={cx} cy={cy} r={r} fill={rim} side={rimD} depth={Math.round(r * 0.13)} />
      <circle cx={cx} cy={cy} r={r * 0.8} fill={C.cream} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy - r * 0.72}
          x2={cx}
          y2={cy - r * 0.6}
          stroke={C.ink}
          strokeWidth={r * 0.045}
          strokeLinecap="round"
          transform={`rotate(${i * 30} ${cx} ${cy})`}
        />
      ))}
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.45}
        stroke={C.ink}
        strokeWidth={r * 0.07}
        strokeLinecap="round"
        transform={`rotate(${angleDeg} ${cx} ${cy})`}
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.64}
        stroke={C.coral}
        strokeWidth={r * 0.05}
        strokeLinecap="round"
        transform={`rotate(${mDeg} ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r={r * 0.08} fill={C.ink} />
    </g>
  );
};

export const FlatBG: React.FC<{ accent: string }> = ({ accent }) => {
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
          <circle
            key={i}
            cx={(i * 197) % 1080}
            cy={(i * 331) % 1920}
            r={3 + (i % 3)}
            fill={C.cream}
            opacity={0.18 + 0.18 * Math.sin(f / 18 + i)}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const SceneShell: React.FC<{ accent: string; children: React.ReactNode }> = ({
  accent,
  children,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], clamp);
  const s = interpolate(f, [0, 12], [1.06, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <FlatBG accent={accent} />
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
