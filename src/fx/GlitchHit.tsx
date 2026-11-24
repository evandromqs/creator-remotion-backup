import React from "react";
import { random } from "remotion";
import { colors } from "../design/tokens";

interface GlitchHitProps {
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  duration?: number;
  intensity?: number;
}

export const GlitchHit: React.FC<GlitchHitProps> = ({
  children,
  frame,
  startFrame,
  duration = 8,
  intensity = 12,
}) => {
  const rel = frame - startFrame;
  const isActive = rel >= 0 && rel < duration;

  // Deslocamentos pseudo-aleatórios determinísticos por frame
  const shiftX = isActive ? (random(`glitch-x-${frame}`) - 0.5) * intensity * 2 : 0;
  const shiftY = isActive ? (random(`glitch-y-${frame}`) - 0.5) * (intensity * 0.5) : 0;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isActive && (
        <>
          {/* Camada AZUL (deslocada para a esquerda, ancorada exatamente sobre o filho) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate3d(${-shiftX.toFixed(2)}px, ${-shiftY.toFixed(2)}px, 0)`,
              filter: `drop-shadow(-4px 0 0 ${colors.BLUE})`,
              mixBlendMode: "screen",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          >
            {children}
          </div>

          {/* Camada VERMELHA (deslocada para a direita, ancorada exatamente sobre o filho) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`,
              filter: `drop-shadow(4px 0 0 ${colors.RED})`,
              mixBlendMode: "screen",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          >
            {children}
          </div>
        </>
      )}

      {/* Conteúdo base com DOM 100% estável */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
