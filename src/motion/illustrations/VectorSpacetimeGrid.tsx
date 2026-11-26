import React from "react";
import { useCurrentFrame } from "remotion";
import { float2D, floatLoop, pulseLoop, shimmerGlow } from "../presets";

export interface VectorSpacetimeGridProps {
  width?: number;
  height?: number;
}

export const VectorSpacetimeGrid: React.FC<VectorSpacetimeGridProps> = ({
  width = 600,
  height = 420,
}) => {
  const frame = useCurrentFrame();
  const pulse = pulseLoop(frame, 25, 0.05);
  const warpWave = floatLoop(frame, 35, 6);
  const earthFloat = float2D(frame, 45, 35, 3, 5);
  const earthPulse = pulseLoop(frame, 30, 0.03);
  const labelGlow = shimmerGlow(frame, 28, 0.65, 1);

  const cx = width / 2;
  const cy = height * 0.58;

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="warp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Malha do Espaço-Tempo Deformada (Grade de Curvatura da Gravidade de Einstein) */}
        <g stroke="#38BDF8" strokeWidth="1" opacity="0.35">
          {/* Linhas Horizontais Curvando em Direção à Massa da Terra */}
          {[-60, -30, 0, 30, 60, 90].map((yOffset, i) => (
            <path
              key={i}
              d={`M 20 ${cy + yOffset} Q ${cx} ${cy + yOffset + 45 + warpWave} ${width - 20} ${cy + yOffset}`}
              fill="none"
            />
          ))}

          {/* Linhas Verticais Afunilando para o Centro de Gravidade */}
          {[0.15, 0.28, 0.4, 0.5, 0.6, 0.72, 0.85].map((pct, i) => {
            const x = width * pct;
            return (
              <path
                key={i}
                d={`M ${x} 60 Q ${cx + (x - cx) * 0.4} ${cy + 30} ${cx + (x - cx) * 0.8} ${height - 20}`}
                fill="none"
              />
            );
          })}
        </g>

        {/* 2. Poço Gravitacional Central */}
        <ellipse cx={cx} cy={cy + 35} rx={160 * pulse} ry={60 * pulse} fill="url(#warp-glow)" />

        {/* 3. Massa da Terra no Centro Curvando o Espaço-Tempo */}
        <g transform={`translate(${earthFloat.x}, ${earthFloat.y})`}>
          <circle cx={cx} cy={cy + 10} r={48 * earthPulse} fill="#1D4ED8" stroke="#60A5FA" strokeWidth="2.5" />
          <circle
            cx={cx}
            cy={cy + 10}
            r={48 * earthPulse}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeDasharray="6 6"
            strokeDashoffset={-frame * 0.6}
          />
        </g>

        {/* Anotação Visual da Gravidade */}
        <text
          x={cx}
          y={cy + 100}
          textAnchor="middle"
          fill="#A78BFA"
          fontSize="14"
          fontWeight="800"
          fontFamily="'Space Grotesk', sans-serif"
          letterSpacing="0.08em"
          opacity={labelGlow}
        >
          CURVATURA DO ESPAÇO-TEMPO
        </text>
      </svg>
    </div>
  );
};
