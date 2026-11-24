import React from "react";
import { useCurrentFrame } from "remotion";
import { MOTION_PALETTE } from "../tokens";
import { floatLoop } from "../presets";

export interface VectorSatelliteProps {
  scale?: number;
  showWaves?: boolean;
  angle?: number;
}

export const VectorSatellite: React.FC<VectorSatelliteProps> = ({
  scale = 1,
  showWaves = true,
  angle = -15,
}) => {
  const frame = useCurrentFrame();
  const floatY = floatLoop(frame, 30, 8);
  const floatX = floatLoop(frame + 15, 45, 4);

  return (
    <div
      style={{
        transform: `translate(${floatX}px, ${floatY}px) rotate(${angle}deg) scale(${scale})`,
        display: "inline-block",
        position: "relative",
      }}
    >
      <svg width="340" height="240" viewBox="0 0 340 240" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="solar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* 1. Painel Solar Esquerdo */}
        <g transform="translate(10, 85)">
          <rect width="110" height="65" rx="6" fill="url(#solar-gradient)" stroke="#60A5FA" strokeWidth="2" />
          {/* Células fotovoltaicas */}
          <line x1="37" y1="0" x2="37" y2="65" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          <line x1="74" y1="0" x2="74" y2="65" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          <line x1="0" y1="32" x2="110" y2="32" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          {/* Braço de conexão */}
          <rect x="110" y="27" width="22" height="10" fill="#94A3B8" />
        </g>

        {/* 2. Painel Solar Direito */}
        <g transform="translate(200, 85)">
          {/* Braço de conexão */}
          <rect x="-2" y="27" width="22" height="10" fill="#94A3B8" />
          <rect x="20" width="110" height="65" rx="6" fill="url(#solar-gradient)" stroke="#60A5FA" strokeWidth="2" />
          {/* Células fotovoltaicas */}
          <line x1="57" y1="0" x2="57" y2="65" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          <line x1="94" y1="0" x2="94" y2="65" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
          <line x1="20" y1="32" x2="130" y2="32" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
        </g>

        {/* 3. Corpo Central do Satélite (Chassi Dourado / Moderno) */}
        <g transform="translate(132, 60)">
          <rect width="76" height="110" rx="14" fill="url(#gold-foil)" stroke="#FDE68A" strokeWidth="2" />
          {/* Linhas de blindagem térmica */}
          <rect x="10" y="15" width="56" height="40" rx="6" fill="rgba(0, 0, 0, 0.18)" />
          <circle cx="28" cy="35" r="5" fill="#38BDF8" />
          <circle cx="48" cy="35" r="5" fill="#10B981" />
          {/* Antena Parabólica Transmissora voltada para a Terra */}
          <path d="M 18 110 Q 38 135 58 110 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="38" y1="125" x2="38" y2="148" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="148" r="4" fill="#38BDF8" />
        </g>

        {/* 4. Ondas de Rádio / Pulso de Sinal GPS descendo */}
        {showWaves && (
          <g transform="translate(170, 208)">
            {[0, 1, 2].map((i) => {
              const phase = ((frame + i * 18) % 54) / 54;
              const r = 20 + phase * 60;
              const opacity = (1 - phase) * 0.7;
              return (
                <path
                  key={i}
                  d={`M ${-r} 0 A ${r} ${r * 0.4} 0 0 0 ${r} 0`}
                  fill="none"
                  stroke={MOTION_PALETTE.cyanSignal}
                  strokeWidth="2.5"
                  opacity={opacity}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
