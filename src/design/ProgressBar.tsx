import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./tokens";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, frame / durationInFrames));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        zIndex: 999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${(progress * 100).toFixed(2)}%`,
          backgroundColor: colors.BLUE,
          boxShadow: `0 0 14px ${colors.BLUE}`,
        }}
      />
    </div>
  );
};
