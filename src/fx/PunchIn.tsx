import React from "react";
import { spring, useVideoConfig } from "remotion";
import { springPresets } from "../design/tokens";

interface PunchInProps {
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  duration?: number;
  scaleAmount?: number;
}

export const PunchIn: React.FC<PunchInProps> = ({
  children,
  frame,
  startFrame,
  duration = 20,
  scaleAmount = 0.15,
}) => {
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;

  let currentScale = 1.0;
  if (rel >= 0 && rel < duration) {
    const spr = spring({
      frame: rel,
      fps,
      config: springPresets.punchy,
    });
    const decay = Math.max(0, 1 - rel / duration);
    currentScale = 1.0 + spr * scaleAmount * decay;
  }

  // DOM 100% estável em todos os frames; sem width/height 100% para nunca quebrar flexbox
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: `scale(${currentScale.toFixed(4)})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
