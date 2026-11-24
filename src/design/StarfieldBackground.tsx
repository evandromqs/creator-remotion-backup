import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "./theme";

export const StarfieldBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.palette.bg,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Gradiente de profundidade espacial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 35%, ${theme.palette.bgDeep} 0%, ${theme.palette.bg} 85%)`,
          opacity: 0.85,
        }}
      />

      {/* Camada 1 de Estrelas (Lenta) */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {Array.from({ length: 45 }).map((_, i) => {
          const x = ((i * 137.5) % 1080);
          const y = ((i * 223.7 + frame * 0.4) % 1920);
          const r = (i % 3) + 1;
          return <circle key={`s1-${i}`} cx={x} cy={y} r={r} fill={theme.palette.text} opacity={0.6} />;
        })}
      </svg>

      {/* Camada 2 de Estrelas (Média) */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.7 }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const x = ((i * 263.3) % 1080);
          const y = ((i * 189.1 + frame * 0.8) % 1920);
          const r = (i % 2) + 1.5;
          return <circle key={`s2-${i}`} cx={x} cy={y} r={r} fill={theme.palette.cyan} opacity={0.5} />;
        })}
      </svg>

      {/* Vinheta Dark cinemática */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 45%, rgba(5,7,13,0.85) 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
