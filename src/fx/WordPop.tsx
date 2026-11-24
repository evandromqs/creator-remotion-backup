import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { springPresets } from "../design/tokens";

interface WordPopProps {
  children: React.ReactNode;
  frame: number;
  startFrame: number;
  delayFrames?: number;
}

export const WordPop: React.FC<WordPopProps> = ({
  children,
  frame,
  startFrame,
  delayFrames = 0,
}) => {
  const { fps } = useVideoConfig();
  const rel = frame - (startFrame + delayFrames);

  if (rel < 0) {
    return <span style={{ opacity: 0, display: "inline-block" }}>{children}</span>;
  }

  const spr = spring({
    frame: rel,
    fps,
    config: springPresets.snappy,
  });

  const translateY = interpolate(spr, [0, 1], [40, 0]);
  const scale = interpolate(spr, [0, 1], [0.65, 1.0]);
  const opacity = interpolate(rel, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      {children}
    </span>
  );
};
