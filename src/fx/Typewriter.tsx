import React from "react";
import { colors, FONT_CODE } from "../design/tokens";

interface TypewriterProps {
  text: string;
  frame: number;
  startFrame: number;
  speed?: number;
  cursorColor?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  frame,
  startFrame,
  speed = 1.2,
  cursorColor = colors.BLUE,
  fontFamily = FONT_CODE,
  fontSize = 36,
  color = colors.WHITE,
}) => {
  const rel = frame - startFrame;

  if (rel < 0) {
    return null;
  }

  const charsToShow = Math.min(text.length, Math.floor(rel * speed));
  const visibleText = text.slice(0, charsToShow);
  const cursorBlink = Math.floor(frame / 6) % 2 === 0;

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        color,
        display: "inline-block",
        letterSpacing: "0.05em",
      }}
    >
      {visibleText}
      <span
        style={{
          color: cursorColor,
          opacity: cursorBlink ? 1 : 0,
          marginLeft: 2,
        }}
      >
        ▎
      </span>
    </span>
  );
};
