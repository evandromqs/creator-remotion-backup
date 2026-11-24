import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { colors } from "../design/tokens";

interface FlashProps {
  frame: number;
  startFrame: number;
  duration?: number;
  color?: string;
}

export const Flash: React.FC<FlashProps> = ({
  frame,
  startFrame,
  duration = 8,
  color = colors.WHITE,
}) => {
  const rel = frame - startFrame;

  if (rel < 0 || rel >= duration) {
    return null;
  }

  const opacity = interpolate(rel, [0, 1, duration], [0.95, 0.8, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
        zIndex: 900,
        mixBlendMode: "screen",
      }}
    />
  );
};
