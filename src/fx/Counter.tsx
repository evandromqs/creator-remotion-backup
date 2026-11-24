import React from "react";
import { interpolate, Easing } from "remotion";
import { FONT_CODE } from "../design/tokens";

interface CounterProps {
  fromValue: number;
  toValue: number;
  frame: number;
  startFrame: number;
  durationFrames?: number;
  formatter?: (val: number) => string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export const Counter: React.FC<CounterProps> = ({
  fromValue,
  toValue,
  frame,
  startFrame,
  durationFrames = 30,
  formatter = (v) => Math.round(v).toString(),
  fontFamily = FONT_CODE,
  fontSize = 64,
  color = "#FFFFFF",
}) => {
  const rel = frame - startFrame;

  if (rel <= 0) {
    return (
      <span style={{ fontFamily, fontSize, color, display: "inline-block" }}>
        {formatter(fromValue)}
      </span>
    );
  }

  // Interpolação estritamente monotônica com desaceleração cúbica suave
  // Garante que a contagem (ex: 2026 -> 1947) nunca passe do valor e nunca volte para trás
  const progress = interpolate(rel, [0, durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const currentValue = fromValue + (toValue - fromValue) * progress;

  return (
    <span style={{ fontFamily, fontSize, color, display: "inline-block" }}>
      {formatter(currentValue)}
    </span>
  );
};
