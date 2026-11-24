import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../design/tokens";

interface BlackoutProps {
  frame: number;
  startFrame: number;
  duration?: number;
}

export const Blackout: React.FC<BlackoutProps> = ({
  frame,
  startFrame,
  duration = 6,
}) => {
  const rel = frame - startFrame;

  if (rel < 0 || rel >= duration) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.BLACK,
        pointerEvents: "none",
        zIndex: 920,
      }}
    />
  );
};
