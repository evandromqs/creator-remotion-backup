import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOTION_PALETTE } from "./tokens";

export interface BackgroundProps {
  showGrid?: boolean;
  accentColor?: string;
  glowIntensity?: number;
}

export const ModernBackground: React.FC<BackgroundProps> = ({
  showGrid = true,
  accentColor = MOTION_PALETTE.dominantBlue,
  glowIntensity = 0.18,
}) => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 0.3) % 60;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: MOTION_PALETTE.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* 1. Gradiente Radial Atmosférico */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 40%, ${accentColor}${Math.round(
            glowIntensity * 255
          ).toString(16).padStart(2, "0")} 0%, rgba(9, 13, 26, 0.95) 75%)`,
        }}
      />

      {/* 2. Grade de Coordenadas Técnicas (Modern Explainer Blueprint) */}
      {showGrid && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.12,
          }}
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              x={0}
              y={gridOffset}
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={MOTION_PALETTE.cyanSignal}
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill={MOTION_PALETTE.cyanSignal} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      )}

      {/* 3. Vinheta Suave nas Bordas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 120px rgba(0, 0, 0, 0.75)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
