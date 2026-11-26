import React from "react";
import { useCurrentFrame } from "remotion";
import { drawOn, pulseLoop, float2D, tiltLoop } from "../presets";

export interface VectorPhoneGpsProps {
  scale?: number;
  driftError?: boolean;
}

export const VectorPhoneGps: React.FC<VectorPhoneGpsProps> = ({
  scale = 1,
  driftError = false,
}) => {
  const frame = useCurrentFrame();
  const pulse = pulseLoop(frame, 20, 0.15);
  const strokeOffset = drawOn(frame, 5, 45, 320);

  // Regra dos 3 segundos: Smartphone com micro-flutuação 2D e leve balanço angular
  const float = float2D(frame, 40, 30, 8, 12);
  const tilt = tiltLoop(frame, 45, 1.8);

  // Animação contínua da posição do carro percorrendo a rota
  // Rota tem pontos: (90,440) -> (90,320) -> (140,320) -> (140,180) -> (190,180) -> (190,80)
  const carProgress = ((frame * 1.5) % 200) / 200; // ciclo contínuo
  const carY = 440 - carProgress * 360;
  const carX = carY > 320 ? 90 : (carY > 180 ? 140 : 190);

  // Pulso de ondas de sinal do GPS descendo sobre o celular
  const signalRings = [0, 1, 2].map((idx) => {
    const phase = ((frame + idx * 25) % 75) / 75;
    return {
      r: 12 + phase * 40,
      opacity: (1 - phase) * 0.7,
    };
  });

  return (
    <div
      style={{
        transform: `translate(${float.x}px, ${float.y}px) rotate(${tilt}deg) scale(${scale})`,
        display: "inline-block",
        position: "relative",
      }}
    >
      <svg width="280" height="520" viewBox="0 0 280 520" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id="screen-clip">
            <rect x="15" y="15" width="250" height="490" rx="36" />
          </clipPath>
        </defs>

        {/* Chassi do Smartphone */}
        <rect x="5" y="5" width="270" height="510" rx="44" fill="#0B132B" stroke="#334155" strokeWidth="6" />
        <rect x="15" y="15" width="250" height="490" rx="36" fill="#0F172A" />

        {/* Tela do Mapa (Clipada) */}
        <g clipPath="url(#screen-clip)">
          {/* Malha de Ruas e Quarteirões da Cidade */}
          <rect x="15" y="15" width="250" height="490" fill="#0F1E36" />
          <path
            d="M 20 120 L 260 120 M 20 230 L 260 230 M 20 360 L 260 360 M 90 20 L 90 500 M 190 20 L 190 500"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="14"
          />

          {/* Rio ou Obstáculo Natural */}
          <path
            d="M 15 280 Q 80 250 140 290 T 265 270"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="32"
            opacity="0.85"
          />

          {/* Ponte sobre o Rio */}
          <rect x="125" y="250" width="30" height="60" rx="4" fill="#475569" stroke="#94A3B8" strokeWidth="2" />

          {/* Rota GPS Normal (Ciano/Azul) */}
          {!driftError ? (
            <path
              d="M 90 440 L 90 320 L 140 320 L 140 180 L 190 180 L 190 80"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset={strokeOffset}
            />
          ) : (
            /* Rota com Desvio de 11km caindo no rio */
            <path
              d="M 90 440 L 90 320 L 140 320 L 140 280 L 70 280"
              fill="none"
              stroke="#EF4444"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset={strokeOffset}
            />
          )}

          {/* Ondas de Sinal de GPS recebidas no Smartphone */}
          <g transform="translate(140, 46)">
            {signalRings.map((ring, i) => (
              <circle
                key={i}
                cx="0"
                cy="0"
                r={ring.r}
                fill="none"
                stroke={driftError ? "#EF4444" : "#38BDF8"}
                strokeWidth="2"
                opacity={ring.opacity}
              />
            ))}
          </g>

          {/* Pin de Localização Atual do Carro (Dinâmico / Percorrendo Rota) */}
          <g
            transform={
              driftError
                ? "translate(70, 280)"
                : `translate(${carX}, ${carY})`
            }
          >
            <circle
              cx="0"
              cy="0"
              r={18 * pulse}
              fill={driftError ? "rgba(239,68,68,0.4)" : "rgba(56,189,248,0.4)"}
            />
            <circle
              cx="0"
              cy="0"
              r="9"
              fill={driftError ? "#EF4444" : "#38BDF8"}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Ícone sutil de veículo em movimento */}
            <path
              d="M -4 2 L 0 -5 L 4 2 Z"
              fill="#FFFFFF"
              transform={`rotate(${carY > 320 ? 0 : carY > 180 ? 90 : 0})`}
            />
          </g>

          {/* Top Bar do GPS */}
          <rect x="25" y="25" width="230" height="42" rx="10" fill="rgba(15,23,42,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="45" cy="46" r="6" fill="#10B981" />
          <text x="62" y="51" fill="#F8FAFC" fontSize="13" fontWeight="700" fontFamily="sans-serif">
            {driftError ? "SINAL COM ERRO (+11 KM)" : "GPS CONECTADO (4 SAT)"}
          </text>
        </g>

        {/* Dynamic Island / Notch */}
        <rect x="100" y="20" width="80" height="18" rx="9" fill="#000" />
      </svg>
    </div>
  );
};
