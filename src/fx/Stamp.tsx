import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { springPresets } from "../design/tokens";

interface StampProps {
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  rotation?: number;
}

export const Stamp: React.FC<StampProps> = ({
  children,
  frame,
  startFrame,
  rotation = -8,
}) => {
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;

  if (rel < 0) {
    return null;
  }

  const spr = spring({
    frame: rel,
    fps,
    config: springPresets.punchy,
  });

  const scale = interpolate(spr, [0, 1], [3.2, 1.0]);
  const currentRot = interpolate(spr, [0, 1], [rotation * 2.5, rotation]);
  const opacity = interpolate(rel, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const shadowSpread = interpolate(spr, [0, 1], [40, 6]);

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale.toFixed(4)}) rotate(${currentRot.toFixed(2)}deg)`,
        opacity,
        transformOrigin: "center center",
        filter: `drop-shadow(0 ${shadowSpread.toFixed(1)}px ${shadowSpread.toFixed(1)}px rgba(0,0,0,0.85))`,
      }}
    >
      {children}
    </div>
  );
};
