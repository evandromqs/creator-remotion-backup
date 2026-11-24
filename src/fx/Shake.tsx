import React from "react";
import { interpolate } from "remotion";
import { noise2D } from "@remotion/noise";

interface ShakeProps {
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  duration?: number;
  amplitude?: number;
}

export const Shake: React.FC<ShakeProps> = ({
  children,
  frame,
  startFrame,
  duration = 14,
  amplitude = 18,
}) => {
  const rel = frame - startFrame;

  let x = 0;
  let y = 0;
  let rot = 0;

  if (rel >= 0 && rel < duration) {
    const decay = interpolate(rel, [0, duration], [1, 0], {
      extrapolateRight: "clamp",
    });
    x = noise2D("shake-x", frame * 0.85, 0) * amplitude * decay;
    y = noise2D("shake-y", 0, frame * 0.85) * amplitude * decay;
    rot = noise2D("shake-r", frame * 0.5, 0) * (amplitude * 0.15) * decay;
  }

  // DOM 100% estável em todos os frames; preserva tamanho intrínseco e centralização do filho
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
