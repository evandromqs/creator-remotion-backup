import React from "react";
import { useCurrentFrame } from "remotion";
import { float2D, pulseLoop, shimmerGlow, tiltLoop } from "../presets";

export interface VectorAtomicClockProps {
  scale?: number;
  showFrequency?: boolean;
}

export const VectorAtomicClock: React.FC<VectorAtomicClockProps> = ({
  scale = 1,
  showFrequency = true,
}) => {
  const frame = useCurrentFrame();
  const pulse = pulseLoop(frame, 15, 0.06);
  const float = float2D(frame, 50, 38, 4, 6);
  const tilt = tiltLoop(frame, 60, 1.2);
  const coreGlow = shimmerGlow(frame, 20, 0.65, 1);
  const rot1 = (frame * 1.8) % 360;
  const rot2 = (-frame * 1.5) % 360;
  const rot3 = (frame * 1.2) % 360;

  return (
    <div
      style={{
        transform: `translate(${float.x}px, ${float.y}px) rotate(${tilt}deg) scale(${scale * pulse})`,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "18px",
      }}
    >
      <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="atom-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="60%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Círculo do Gabinete do Relógio */}
        <circle cx="150" cy="150" r="135" fill="#131B2E" stroke="#38BDF8" strokeWidth="4" />
        <circle
          cx="150"
          cy="150"
          r="122"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeDashoffset={-frame * 0.5}
        />

        {/* Órbitas Eletrônicas em Torno do Núcleo de Césio */}
        <ellipse
          cx="150"
          cy="150"
          rx="105"
          ry="38"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="2"
          opacity="0.75"
          transform={`rotate(${rot1} 150 150)`}
        />
        <ellipse
          cx="150"
          cy="150"
          rx="105"
          ry="38"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          opacity="0.75"
          transform={`rotate(${rot2} 150 150)`}
        />
        <ellipse
          cx="150"
          cy="150"
          rx="105"
          ry="38"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          opacity="0.75"
          transform={`rotate(${rot3} 150 150)`}
        />

        {/* Núcleo de Césio-133 com Pulsação */}
        <circle cx="150" cy="150" r="32" fill="url(#atom-core-glow)" opacity={coreGlow} />
        <circle cx="150" cy="150" r="14" fill="#FBBF24" />
      </svg>

      {/* Badge de Precisão Atômica */}
      {showFrequency && (
        <div
          style={{
            background: "rgba(19, 27, 46, 0.95)",
            border: "2px solid #F59E0B",
            borderRadius: "14px",
            padding: "10px 20px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.25)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.1em" }}>
            CÉSIO-133 • TRANSIÇÃO ATÔMICA
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#FBBF24",
              fontFamily: "'Space Grotesk', monospace",
              letterSpacing: "-0.02em",
            }}
          >
            9.192.631.770 Hz
          </div>
        </div>
      )}
    </div>
  );
};
