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
  Pin,
  Shadow,
  Slab,
  clamp,
  kick,
  makeIso,
  pop,
  wave,
} from "./primitives";

// ============ CENA 1 — HOOK (0–177) ============
export const S1Hook: React.FC = () => {
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
      <EinsteinHead x={840} y={540} s={ein} f={f} />
      <CityTile cx={tile.cx} cy={tile.cy} w={tile.w} h={tile.h} f={f} fps={fps} delay={2} />
      {f >= 30 && (
        <ellipse
          cx={pinX}
          cy={pinY}
          rx={40 + ring * 110}
          ry={(40 + ring * 110) / 2}
          fill="none"
          stroke={lost ? C.coral : C.teal}
          strokeWidth={6}
          opacity={1 - ring}
        />
      )}
      {f >= 19 && (
        <Pin
          x={pinX}
          y={pinY}
          color={lost ? C.coral : C.teal}
          dark={lost ? C.coralD : C.tealD}
          s={1.15}
          rot={lost ? wave(f, 3, 14) : 0}
        />
      )}
      <g
        transform={`translate(${540 + wave(f, 40, 10)} ${640 + wave(f, 30, 14) + (1 - phoneIn) * 500}) rotate(${-6 + wave(f, 45, 2.5)})`}
      >
        <Shadow cx={0} cy={330} rx={130} ry={20} o={0.2} />
        <Slab x={-150} y={-270} w={300} h={540} r={46} fill={C.ink} side="#050A14" depth={22} />
        <rect x={-130} y={-248} width={260} height={496} rx={32} fill={lost ? "#3A1E2A" : "#183A5A"} />
        <path
          d="M -70 180 L -70 60 L 20 60 L 20 -60 L 80 -60 L 80 -170"
          fill="none"
          stroke={lost ? C.coral : C.teal}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={routeLen}
          strokeDashoffset={routeDraw}
        />
        <circle cx={-70} cy={180} r={16} fill={C.mustard} />
        <circle cx={80} cy={-170} r={16 * kick(f, 90, 14, 0.4)} fill={lost ? C.coral : C.teal} />
        <rect x={-40} y={-240} width={80} height={18} rx={9} fill="#050A14" />
      </g>
      {[
        [230, 820, 0],
        [860, 800, 4],
        [190, 1000, 8],
      ].map(([x, y, d], i) => {
        const s = pop(f, 152 + d, fps, 8);
        return f >= 152 + d ? (
          <g key={i} transform={`translate(${x} ${y + wave(f, 8, 8, i)}) scale(${s}) rotate(${wave(f, 10, 12, i)})`}>
            <ExText x={0} y={0} size={130} fill={C.mustard} side={C.mustardS} depth={10}>
              ?
            </ExText>
          </g>
        ) : null;
      })}
    </g>
  );
};

// ============ CENA 2 — ERRO DE 11 KM (177–399) ============
export const S2Drift: React.FC = () => {
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
        <line
          x1={real.x}
          y1={real.y}
          x2={gps.x}
          y2={gps.y}
          stroke={C.coral}
          strokeWidth={8}
          strokeDasharray="18 16"
          strokeDashoffset={-f * 2}
          strokeLinecap="round"
        />
      )}
      <Pin x={real.x} y={real.y} color={C.teal} dark={C.tealD} s={pop(f, 8, fps)} />
      {f >= 51 && (
        <Pin x={gps.x} y={gps.y - wave(f, 6, 6)} color={C.coral} dark={C.coralD} s={pop(f, 51, fps)} rot={wave(f, 9, 6)} />
      )}
      <g transform={`translate(540 540) scale(${badge}) rotate(${wave(f, 40, 2)})`}>
        <Slab x={-270} y={-95} w={540} h={190} r={36} fill={C.coral} side={C.coralD} depth={20} />
        <text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={128} fill={C.cream}>
          {km.toFixed(km >= 10.95 ? 0 : 1)} KM
        </text>
      </g>
      {f >= 171 && (
        <g transform={`translate(210 1310) scale(${cal}) rotate(${-8 + wave(f, 20, 3)})`}>
          <Slab x={-95} y={-100} w={190} h={200} r={22} fill={C.cream} side={C.creamD} depth={14} />
          <rect x={-95} y={-100} width={190} height={56} rx={22} fill={C.coral} />
          <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill={C.ink}>
            {day}
          </text>
        </g>
      )}
    </g>
  );
};

// ============ CENA 3 — SPUTNIK 1957 (399–597) ============
const SputnikBall: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${wave(f, 20, 10)})`}>
    {[
      [-80, 60],
      [-90, 25],
      [-70, 85],
      [-95, 45],
    ].map(([dx, dy], i) => (
      <line key={i} x1={0} y1={0} x2={dx} y2={dy} stroke={C.metalD} strokeWidth={5} strokeLinecap="round" />
    ))}
    <Disc cx={0} cy={0} r={34} fill={C.metal} side={C.metalD} depth={6} />
    <circle cx={-10} cy={-12} r={10} fill="#FFFFFF" />
  </g>
);

export const S3Sputnik: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = 540,
    ey = 1040,
    er = 250;
  const a = f * 0.04 + 2.2;
  const sx = ex + Math.cos(a) * 400;
  const sy = ey + Math.sin(a) * 130;
  const behind = Math.sin(a) < 0;
  const stamp = interpolate(pop(f, 31, fps, 9), [0, 1], [2.4, 1]);
  const stampO = interpolate(f, [31, 36], [0, 1], clamp);
  const cold = pop(f, 103, fps, 9);
  const earthIn = pop(f, 0, fps, 13);

  return (
    <g>
      <ellipse
        cx={ex}
        cy={ey}
        rx={400}
        ry={130}
        fill="none"
        stroke={C.cream}
        strokeWidth={4}
        strokeDasharray="14 14"
        strokeDashoffset={-f * 1.5}
        opacity={0.45}
      />
      {behind && <SputnikBall x={sx} y={sy} f={f} />}
      <g transform={`translate(${ex} ${ey}) scale(${earthIn}) translate(${-ex} ${-ey + wave(f, 35, 8)})`}>
        <FlatEarth cx={ex} cy={ey} r={er} f={f} clipId="s3-earth" />
      </g>
      {!behind && <SputnikBall x={sx} y={sy} f={f} />}
      {f >= 170 &&
        [0, 1, 2].map((i) => {
          const r = ((f - 170) * 4 + i * 40) % 120;
          return <circle key={i} cx={sx} cy={sy} r={40 + r} fill="none" stroke={C.mustard} strokeWidth={5} opacity={1 - r / 120} />;
        })}
      {f >= 31 && (
        <g opacity={stampO} transform={`translate(540 600) scale(${stamp}) rotate(${-6 + wave(f, 30, 1.5)})`}>
          <ExText x={0} y={0} size={210} fill={C.mustard} side={C.mustardS} depth={18}>
            1957
          </ExText>
        </g>
      )}
      {f >= 103 && (
        <g>
          <g transform={`translate(160 555) scale(${cold}) rotate(${wave(f, 18, 8)})`}>
            <path d="M0,-60 L17,-20 L60,-18 L26,10 L37,52 L0,28 L-37,52 L-26,10 L-60,-18 L-17,-20 Z" fill={C.coralD} transform="translate(5 7)" />
            <path d="M0,-60 L17,-20 L60,-18 L26,10 L37,52 L0,28 L-37,52 L-26,10 L-60,-18 L-17,-20 Z" fill={C.coral} />
          </g>
          <g transform={`translate(920 555) scale(${cold}) rotate(${f * 1.2})`} stroke={C.teal} strokeWidth={12} strokeLinecap="round">
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

export const S4Doppler: React.FC = () => {
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
      <FlatSatellite x={sat.x} y={sat.y} s={1.1} rot={wave(f, 25, 6)} f={f} />
      <g transform={`translate(0 ${groundIn})`}>
        <Shadow cx={540} cy={1315} rx={420} ry={95} o={0.26} />
        <ellipse cx={540} cy={1255 + 32} rx={410} ry={105} fill={C.greenD} />
        <ellipse cx={540} cy={1255} rx={410} ry={105} fill={C.green} />
        <Slab x={dish.x - 22} y={dish.y} w={44} h={92} r={8} fill={C.metal} side={C.metalD} depth={8} />
        <g transform={`translate(${dish.x} ${dish.y}) rotate(${ang})`}>
          <path d="M -95 0 A 95 54 0 0 0 95 0 Z" fill={C.creamD} transform="translate(0 10)" />
          <path d="M -95 0 A 95 54 0 0 0 95 0 Z" fill={C.cream} />
          <line x1={0} y1={0} x2={0} y2={-72} stroke={C.metalD} strokeWidth={6} />
          <circle cx={0} cy={-76} r={11} fill={C.coral} />
        </g>
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

// ============ CENA 5 — A SACADA GENIAL / NASCEU O GPS (795–1080, dur 285) ============
// "sacada genial"(7..35) -> "órbita do satélite pelo som"(76..131) -> "qualquer ponto na Terra"(160..206) -> "projeto GPS"(244..285)
export const S5Idea: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bulb = pop(f, 5, fps, 9);
  const lift = interpolate(f, [55, 85], [170, -140], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const bulbScale = interpolate(f, [55, 85], [1.05, 0.72], clamp) * interpolate(f, [225, 248], [1, 0], clamp);
  const earth = pop(f, 60, fps, 11);
  const orbitLen = 1420;
  const orbitDraw = interpolate(f, [70, 115], [orbitLen, 0], clamp);
  const pin = pop(f, 155, fps, 9);
  const gpsBadge = pop(f, 232, fps, 9) * kick(f, 263, 16, 0.18);
  const ex = 540,
    ey = 1090,
    er = 205;

  return (
    <g>
      {f >= 60 && (
        <g transform={`translate(${ex} ${ey}) scale(${earth}) translate(${-ex} ${-ey + wave(f, 32, 7)})`}>
          <ellipse
            cx={ex}
            cy={ey}
            rx={355}
            ry={120}
            fill="none"
            stroke={C.cream}
            strokeWidth={6}
            strokeDasharray={orbitLen}
            strokeDashoffset={orbitDraw}
            opacity={0.7}
          />
          <FlatEarth cx={ex} cy={ey} r={er} f={f} clipId="s5-earth-full" />
          {[0, 1, 2].map((i) => {
            const a = f * 0.045 + i * ((2 * Math.PI) / 3);
            const x = ex + Math.cos(a) * 355;
            const y = ey + Math.sin(a) * 120;
            return (
              <g key={i}>
                {f >= 145 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={ex}
                    y2={ey - 22}
                    stroke={C.teal}
                    strokeWidth={6}
                    strokeDasharray="12 12"
                    strokeDashoffset={-f * 2.5}
                    strokeLinecap="round"
                  />
                )}
                <Disc cx={x} cy={y} r={24} fill={C.mustard} side={C.mustardS} depth={6} />
              </g>
            );
          })}
          {f >= 155 && (
            <g>
              <circle
                cx={ex}
                cy={ey - 20}
                r={26 + ((f - 155) % 36) * 2.4}
                fill="none"
                stroke={C.coral}
                strokeWidth={5}
                opacity={1 - ((f - 155) % 36) / 36}
              />
              <Pin x={ex} y={ey - 16} color={C.coral} dark={C.coralD} s={pin * 0.92} />
            </g>
          )}
        </g>
      )}

      {/* Lâmpada 2.5D */}
      {bulbScale > 0.02 && (
        <g transform={`translate(540 ${730 + lift + wave(f, 20, 8)}) scale(${bulb * bulbScale}) rotate(${wave(f, 30, 4)})`}>
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
      )}

      {/* Selo "GPS" — "Assim nasceu o projeto GPS" */}
      {f >= 232 && (
        <g transform={`translate(540 575) scale(${gpsBadge}) rotate(${wave(f, 32, 2)})`}>
          <Slab x={-235} y={-95} w={470} h={185} r={38} fill={C.teal} side={C.tealD} depth={20} />
          <ExText x={0} y={42} size={148} fill={C.cream} side={C.ink} depth={10}>
            GPS
          </ExText>
        </g>
      )}
    </g>
  );
};

// ============ CENA 6 — CONSTELAÇÃO DE 31 SATÉLITES (1080–1230, dur 150) ============
// "31 satélites"(40..74) -> "20 mil quilômetros de altitude"(92..150)
export const S6Constellation: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ex = 500,
    ey = 1040,
    er = 165;
  const count = Math.min(31, Math.max(0, Math.round(interpolate(f, [12, 58], [0, 31], clamp))));
  const badge = pop(f, 18, fps, 10) * kick(f, 40, 14, 0.18);
  const ruler = pop(f, 88, fps, 11);

  const planes = [-52, -18, 18, 52];

  return (
    <g>
      {/* 4 planos orbitais com 31 satélites acendendo em stagger */}
      <g transform={`translate(0 ${wave(f, 34, 7)})`}>
        {planes.map((tilt, pIdx) => (
          <ellipse
            key={pIdx}
            cx={ex}
            cy={ey}
            rx={335}
            ry={118}
            fill="none"
            stroke={C.cream}
            strokeWidth={3.5}
            strokeDasharray="10 12"
            strokeDashoffset={-f * 1.6}
            opacity={0.35}
            transform={`rotate(${tilt} ${ex} ${ey})`}
          />
        ))}
        <FlatEarth cx={ex} cy={ey} r={er} f={f} clipId="s6-earth" />
        {Array.from({ length: 31 }).map((_, i) => {
          const pIdx = i % 4;
          const tilt = (planes[pIdx] * Math.PI) / 180;
          const a = f * 0.032 + (i * 2 * Math.PI) / 8 + pIdx * 0.7;
          const lx = Math.cos(a) * 335;
          const ly = Math.sin(a) * 118;
          const x = ex + lx * Math.cos(tilt) - ly * Math.sin(tilt);
          const y = ey + lx * Math.sin(tilt) + ly * Math.cos(tilt);
          const s = pop(f, 8 + i * 1.4, fps, 10);
          return s > 0.02 ? (
            <Disc key={i} cx={x} cy={y} r={14 * s} fill={i % 3 === 0 ? C.mustard : C.teal} side={i % 3 === 0 ? C.mustardS : C.tealD} depth={4} />
          ) : null;
        })}
      </g>

      {/* Contador 31 SAT */}
      <g transform={`translate(500 545) scale(${badge}) rotate(${wave(f, 36, 2)})`}>
        <Slab x={-260} y={-85} w={520} h={170} r={34} fill={C.mustard} side={C.mustardS} depth={18} />
        <text x={0} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={112} fill={C.ink}>
          {count} SAT
        </text>
      </g>

      {/* Régua vertical de altitude 20.000 KM */}
      {f >= 88 && (
        <g transform={`translate(905 960) scale(${ruler})`}>
          <line x1={0} y1={-250} x2={0} y2={250} stroke={C.teal} strokeWidth={8} strokeLinecap="round" />
          {[-250, -125, 0, 125, 250].map((ty, idx) => (
            <line key={idx} x1={-22} y1={ty} x2={22} y2={ty} stroke={C.teal} strokeWidth={7} strokeLinecap="round" />
          ))}
          <g transform={`translate(-95 -290)`}>
            <Slab x={-135} y={-44} w={270} h={88} r={20} fill={C.teal} side={C.tealD} depth={10} />
            <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={C.ink}>
              20.000 KM
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ============ CENA 7 — RELÓGIO ATÔMICO DE CÉSIO (1230–1419, dur 189) ============
// "relógio atômico de césio"(42..88) -> "bilionésimos de segundo"(140..189)
export const S7AtomicClock: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const satIn = pop(f, 0, fps, 12);
  const hatchOpen = interpolate(f, [38, 68], [0, 220], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const atomIn = pop(f, 48, fps, 10);
  const digitsIn = pop(f, 128, fps, 10) * kick(f, 142, 14, 0.14);
  const nano = ((f * 73) % 999).toString().padStart(3, "0");

  return (
    <g>
      {/* Chassi X-Ray do satélite com átomo de césio brilhando lá dentro */}
      <g transform={`translate(540 ${850 + wave(f, 30, 10)}) scale(${satIn})`}>
        <Shadow cx={0} cy={320} rx={260} ry={28} o={0.25} />
        {/* Painéis solares laterais */}
        <Slab x={-440} y={-85} w={175} h={170} r={16} fill={C.blue} side={C.blueD} depth={14} />
        <Slab x={265} y={-85} w={175} h={170} r={16} fill={C.blue} side={C.blueD} depth={14} />
        <rect x={-270} y={-16} width={540} height={32} fill={C.metalD} />

        {/* Câmara interna escura do relógio atômico */}
        <Slab x={-215} y={-235} w={430} h={470} r={42} fill={C.slate} side={C.slateD} depth={22} />
        <rect x={-185} y={-205} width={370} height={410} rx={28} fill={C.ink} />

        {/* Átomo de Césio-133 com 3 órbitas de elétrons */}
        <g transform={`scale(${atomIn})`}>
          {[-55, 0, 55].map((deg, idx) => {
            const ea = f * 0.11 + idx * 2.1;
            const ex = Math.cos(ea) * 145;
            const ey = Math.sin(ea) * 56;
            return (
              <g key={idx} transform={`rotate(${deg})`}>
                <ellipse cx={0} cy={0} rx={145} ry={56} fill="none" stroke={C.teal} strokeWidth={5} opacity={0.75} />
                <circle cx={ex} cy={ey} r={13} fill={C.mustard} />
              </g>
            );
          })}
          <Disc cx={0} cy={0} r={44 + wave(f, 8, 4)} fill={C.coral} side={C.coralD} depth={8} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={C.cream}>
            Cs
          </text>
        </g>

        {/* Tampa dourada que desliza abrindo o satélite em "relógio atômico" */}
        {hatchOpen < 215 && (
          <g opacity={1 - hatchOpen / 220} transform={`translate(${hatchOpen * 1.4} 0)`}>
            <Slab x={-215} y={-235} w={430} h={470} r={42} fill={C.mustard} side={C.mustardS} depth={22} />
            <circle cx={0} cy={0} r={38} fill={C.teal} />
          </g>
        )}
      </g>

      {/* Mostrador de bilionésimos de segundo */}
      {f >= 128 && (
        <g transform={`translate(540 1285) scale(${digitsIn})`}>
          <Slab x={-350} y={-72} w={700} h={144} r={28} fill={C.cream} side={C.creamD} depth={16} />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={C.ink}>
            0.000000{f >= 168 ? "001" : nano} s
          </text>
        </g>
      )}
    </g>
  );
};

// ============ CENA 8 — O TEMPO ENLOUQUECEU (1419–1575, dur 156) ============
// "primeiros satélites subiram"(20..71) -> "tempo no espaço enlouqueceu"(79..146)
export const S8ClockChaos: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crazy = f >= 76;
  const shakeX = crazy ? Math.sin(f * 2.7) * 14 : 0;
  const shakeY = crazy ? Math.cos(f * 3.4) * 10 : 0;
  const rocketY = interpolate(f, [0, 72], [1260, 420], { ...clamp, easing: Easing.in(Easing.cubic) });
  const clockScale = pop(f, 56, fps, 9) * (crazy ? 1 + Math.sin(f * 1.3) * 0.05 : 1);
  const crazyAngle = crazy ? f * 23 + Math.sin(f * 0.7) * 140 : f * 4;
  const crazyMin = crazy ? -f * 41 : f * 24;

  const flyingNums = [
    ["12", -290, -250, 0],
    ["3", 310, -190, 5],
    ["9", -320, 170, 9],
    ["6", 295, 220, 13],
    ["!", 0, -340, 3],
  ] as const;

  return (
    <g transform={`translate(${shakeX} ${shakeY})`}>
      {/* Foguete levando o satélite na abertura */}
      {f < 78 && (
        <g transform={`translate(540 ${rocketY}) rotate(${wave(f, 5, 4)})`}>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={wave(f, 4, 22, i)}
              cy={150 + i * 48}
              r={36 - i * 6}
              fill={i === 0 ? C.mustard : C.coral}
            />
          ))}
          <polygon points="-70,95 0,25 70,95" fill={C.coral} />
          <Slab x={-52} y={-90} w={104} h={190} r={46} fill={C.cream} side={C.creamD} depth={12} />
          <polygon points="-52,-70 0,-165 52,-70" fill={C.coral} />
          <circle cx={0} cy={-10} r={24} fill={C.blue} />
        </g>
      )}

      {/* Relógio gigante desgovernado */}
      {f >= 56 && (
        <g transform={`translate(540 940) scale(${clockScale}) rotate(${crazy ? wave(f, 3, 11) : 0})`}>
          <Shadow cx={0} cy={275} rx={220} ry={28} o={0.28} />
          <AnalogClock
            cx={0}
            cy={0}
            r={230}
            rim={crazy ? C.coral : C.mustard}
            rimD={crazy ? C.coralD : C.mustardS}
            angleDeg={crazyAngle}
            minuteDeg={crazyMin}
          />
          {crazy &&
            flyingNums.map(([txt, nx, ny, d], i) => {
              const s = pop(f, 92 + d, fps, 8);
              return f >= 92 + d ? (
                <g key={i} transform={`translate(${nx} ${ny + wave(f, 6, 14, i)}) scale(${s}) rotate(${wave(f, 5, 20, i)})`}>
                  <ExText x={0} y={0} size={115} fill={i === 4 ? C.coral : C.mustard} side={i === 4 ? C.coralD : C.mustardS} depth={10}>
                    {txt}
                  </ExText>
                </g>
              ) : null;
            })}
        </g>
      )}
    </g>
  );
};

// ============ CENA 9 — RELATIVIDADE: DOIS EFEITOS OPOSTOS (1575–1716, dur 141) ============
// "relatividade de Einstein"(19..59) -> "dois efeitos opostos"(76..124) -> "Primeiro."(129..141)
export const S9Relativity: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ein = pop(f, 4, fps, 11);
  const board = pop(f, 16, fps, 11);
  const arrows = pop(f, 74, fps, 9);
  const split = interpolate(f, [74, 108], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const first = pop(f, 124, fps, 8);

  return (
    <g>
      {/* Einstein no topo do conjunto central */}
      <EinsteinHead x={540} y={590 + wave(f, 28, 6)} s={ein * 0.95} f={f} />

      {/* Quadro 2.5D E = mc² */}
      <g transform={`translate(540 870) scale(${board}) rotate(${wave(f, 40, 1.5)})`}>
        <Slab x={-260} y={-85} w={520} h={170} r={30} fill={C.slate} side={C.slateD} depth={18} />
        <rect x={-238} y={-65} width={476} height={130} rx={20} fill={C.ink} />
        <text x={0} y={28} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={92} fill={C.cream}>
          E = mc²
        </text>
      </g>

      {/* Duas setas opostas 2.5D (Coral para baixo vs Teal para cima) */}
      {f >= 74 && (
        <g>
          <g transform={`translate(${320 - split * 40} ${1160 + split * 35 + wave(f, 14, 8)}) scale(${arrows})`}>
            <Slab x={-85} y={-95} w={170} h={190} r={28} fill={C.coral} side={C.coralD} depth={16} />
            <polygon points="0,62 -52,-8 -22,-8 -22,-62 22,-62 22,-8 52,-8" fill={C.cream} />
          </g>
          <g transform={`translate(${760 + split * 40} ${1160 - split * 35 - wave(f, 14, 8)}) scale(${arrows})`}>
            <Slab x={-85} y={-95} w={170} h={190} r={28} fill={C.teal} side={C.tealD} depth={16} />
            <polygon points="0,-62 -52,8 -22,8 -22,62 22,62 22,8 52,8" fill={C.cream} />
          </g>
        </g>
      )}

      {/* Selo "1" em "Primeiro." */}
      {f >= 124 && (
        <g transform={`translate(540 1165) scale(${first}) rotate(${-6 + wave(f, 18, 3)})`}>
          <Disc cx={0} cy={0} r={105} fill={C.mustard} side={C.mustardS} depth={16} />
          <text x={0} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={126} fill={C.ink}>
            1
          </text>
        </g>
      )}
    </g>
  );
};
