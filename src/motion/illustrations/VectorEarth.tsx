import React from "react";
import { useCurrentFrame } from "remotion";
import { MOTION_PALETTE } from "../tokens";
import { floatLoop } from "../presets";

export interface VectorEarthProps {
  size?: number;
  showOrbits?: boolean;
  orbitCount?: number;
}

export const VectorEarth: React.FC<VectorEarthProps> = ({
  size = 500,
  showOrbits = true,
  orbitCount = 3,
}) => {
  const frame = useCurrentFrame();
  const rotation = (frame * 0.4) % 360;
  const floatY = floatLoop(frame, 35, 8);

  const radius = size * 0.4;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translateY(${floatY}px)`,
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Brilho da Atmosfera */}
          <radialGradient id="earth-glow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor={MOTION_PALETTE.dominantBlue} stopOpacity="0.4" />
            <stop offset="100%" stopColor={MOTION_PALETTE.cyanSignal} stopOpacity="0" />
          </radialGradient>

          {/* Gradiente do Oceano */}
          <radialGradient id="ocean-gradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F2942" />
          </radialGradient>

          <clipPath id="earth-clip">
            <circle cx={cx} cy={cy} r={radius} />
          </clipPath>
        </defs>

        {/* 1. Halo Atmosférico Externo */}
        <circle cx={cx} cy={cy} r={radius * 1.25} fill="url(#earth-glow)" />

        {/* 2. Anéis Orbitais de Satélites */}
        {showOrbits && (
          <g opacity={0.35}>
            {Array.from({ length: orbitCount }).map((_, i) => {
              const rx = radius * (1.35 + i * 0.22);
              const ry = radius * (0.45 + i * 0.1);
              const angle = i * 40 - 20;
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={rx}
                  ry={ry}
                  fill="none"
                  stroke={MOTION_PALETTE.cyanSignal}
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  transform={`rotate(${angle} ${cx} ${cy})`}
                />
              );
            })}
          </g>
        )}

        {/* 3. Globo Terrestre */}
        <circle cx={cx} cy={cy} r={radius} fill="url(#ocean-gradient)" />

        {/* 4. Continentes Estilizados com Rotação Contínua */}
        <g clipPath="url(#earth-clip)">
          <g transform={`translate(${((rotation * 2) % (radius * 3)) - radius * 1.5}, 0)`}>
            {[-1, 0, 1].map((copyIndex) => (
              <g key={copyIndex} transform={`translate(${copyIndex * radius * 2.8}, 0)`} fill="#10B981" opacity={0.9}>
                {/* América do Norte / Sul estilizada */}
                <path d={`M ${cx - 50} ${cy - 70} Q ${cx - 20} ${cy - 90} ${cx + 10} ${cy - 60} Q ${cx + 30} ${cy - 20} ${cx} ${cy + 40} Q ${cx - 40} ${cy + 90} ${cx - 70} ${cy + 30} Z`} />
                {/* Europa / África estilizada */}
                <path d={`M ${cx + 50} ${cy - 80} Q ${cx + 90} ${cy - 60} ${cx + 70} ${cy} Q ${cx + 80} ${cy + 70} ${cx + 30} ${cy + 80} Q ${cx + 20} ${cy - 10} ${cx + 50} ${cy - 80} Z`} />
                {/* Ilhas e detalhes polares */}
                <circle cx={cx - 30} cy={cy - 100} r="14" />
                <circle cx={cx + 85} cy={cy - 95} r="18" />
              </g>
            ))}
          </g>

          {/* Sombra Esférica Suave para Profundidade */}
          <path
            d={`M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} A ${radius * 0.4} ${radius} 0 0 0 ${cx} ${cy - radius}`}
            fill="rgba(0, 0, 0, 0.35)"
          />
        </g>

        {/* Borda Iluminada */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={MOTION_PALETTE.cyanSignal}
          strokeWidth="2"
          opacity={0.6}
        />
      </svg>
    </div>
  );
};
