import React from "react";
import { useCurrentFrame } from "remotion";
import { MOTION_PALETTE } from "../tokens";
import { drawOn, float2D, pulseLoop, shimmerGlow, tiltLoop } from "../presets";

export interface VectorTriangulationProps {
  width?: number;
  height?: number;
}

export const VectorTriangulation: React.FC<VectorTriangulationProps> = ({
  width = 600,
  height = 500,
}) => {
  const frame = useCurrentFrame();
  const pulse = pulseLoop(frame, 18, 0.1);
  const sceneFloat = float2D(frame, 60, 48, 3, 4);

  // Ponto de destino (receptor GPS no solo)
  const targetX = width / 2;
  const targetY = height - 80;

  // 4 Satélites em posições orbitais com flutuação contínua
  const satellites = [
    { x: width * 0.15, y: 70, label: "SAT #01" },
    { x: width * 0.38, y: 40, label: "SAT #02" },
    { x: width * 0.65, y: 45, label: "SAT #03" },
    { x: width * 0.88, y: 80, label: "SAT #04" },
  ].map((sat, idx) => {
    const f = float2D(frame + idx * 17, 40, 32, 4, 6);
    const tilt = tiltLoop(frame + idx * 13, 45, 2.5);
    return {
      ...sat,
      cx: sat.x + f.x,
      cy: sat.y + f.y,
      tilt,
    };
  });

  return (
    <div style={{ width, height, position: "relative", transform: `translate(${sceneFloat.x}px, ${sceneFloat.y}px)` }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 1. Feixes de Sinal dos 4 Satélites Convergindo para o Receptor */}
        {satellites.map((sat, idx) => {
          const len = Math.hypot(targetX - sat.cx, targetY - (sat.cy + 15));
          const offset = drawOn(frame, idx * 8, 30, len);
          const packetProgress = ((frame + idx * 12) % 45) / 45;
          const packetX = sat.cx + (targetX - sat.cx) * packetProgress;
          const packetY = sat.cy + 15 + (targetY - (sat.cy + 15)) * packetProgress;
          const ringGlow = shimmerGlow(frame + idx * 15, 28, 0.2, 0.5);
          return (
            <g key={idx}>
              <line
                x1={sat.cx}
                y1={sat.cy + 15}
                x2={targetX}
                y2={targetY}
                stroke="url(#beam-grad)"
                strokeWidth="2.5"
                strokeDasharray={len}
                strokeDashoffset={offset}
              />
              {/* Pacote de sinal viajando continuamente do satélite ao receptor */}
              {offset === 0 && (
                <circle
                  cx={packetX}
                  cy={packetY}
                  r="4"
                  fill="#38BDF8"
                  opacity={1 - packetProgress * 0.4}
                />
              )}
              {/* Esfera / Círculo de Distância de Trilateração */}
              <circle
                cx={sat.cx}
                cy={sat.cy + 15}
                r={len * 0.55 * (0.85 + (idx % 2) * 0.1)}
                fill="none"
                stroke={MOTION_PALETTE.cyanSignal}
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeDashoffset={-frame * 0.8}
                opacity={ringGlow}
              />
            </g>
          );
        })}

        {/* 2. Satélites (Ícones Vetoriais) */}
        {satellites.map((sat, idx) => (
          <g key={idx} transform={`translate(${sat.cx}, ${sat.cy}) rotate(${sat.tilt})`}>
            {/* Painéis solares */}
            <rect x="-24" y="-8" width="16" height="16" rx="2" fill="#2563EB" stroke="#60A5FA" strokeWidth="1" />
            <rect x="8" y="-8" width="16" height="16" rx="2" fill="#2563EB" stroke="#60A5FA" strokeWidth="1" />
            {/* Corpo */}
            <rect x="-7" y="-10" width="14" height="20" rx="3" fill="#F59E0B" />
            <circle cx="0" cy="12" r="3" fill="#38BDF8" />
            <text x="0" y="-16" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              {sat.label}
            </text>
          </g>
        ))}

        {/* 3. Horizonte / Solo da Terra */}
        <path
          d={`M 0 ${height - 20} Q ${width / 2} ${height - 60} ${width} ${height - 20} L ${width} ${height} L 0 ${height} Z`}
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* 4. Receptor GPS / Carro no Ponto de Convergência */}
        <g transform={`translate(${targetX}, ${targetY})`}>
          <circle cx="0" cy="0" r={22 * pulse} fill="rgba(16,185,129,0.25)" />
          <circle cx="0" cy="0" r="10" fill="#10B981" />
          <circle cx="0" cy="0" r="4" fill="#FFF" />
          <text x="0" y="32" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="800" fontFamily="sans-serif">
            POSIÇÃO FIXADA (X, Y, Z, t)
          </text>
        </g>
      </svg>
    </div>
  );
};
