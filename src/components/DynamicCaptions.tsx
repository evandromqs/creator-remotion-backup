import React from "react";
import { useCurrentFrame } from "remotion";
import scenesData from "../data/scenes.json";
import { theme } from "../design/theme";

export interface CaptionWord {
  text: string;
  from: number;
  to: number;
  highlight?: boolean;
}

export interface CaptionScene {
  from: number;
  durationInFrames: number;
  captions?: CaptionWord[];
}

export interface DynamicCaptionsProps {
  scenes?: CaptionScene[];
}

export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({ scenes }) => {
  const frame = useCurrentFrame();
  const activeScenes: CaptionScene[] = scenes || scenesData.scenes;

  // Encontra a cena atual
  const currentScene = activeScenes.find(
    (s) => frame >= s.from && frame < s.from + s.durationInFrames
  );

  if (!currentScene || !currentScene.captions || currentScene.captions.length === 0) {
    return null;
  }

  // Agrupa palavras da cena em blocos de até 3 palavras
  const captionWords = currentScene.captions;
  const wordIndex = captionWords.findIndex((w) => frame >= w.from && frame <= w.to);
  const activeWordIdx =
    wordIndex !== -1 ? wordIndex : captionWords.findIndex((w) => w.from > frame) - 1;

  // Janela visível de 2 a 3 palavras em volta da palavra ativa
  const safeIdx = Math.max(0, activeWordIdx);
  const windowStart = Math.max(
    0,
    Math.min(Math.max(0, captionWords.length - 3), Math.floor(safeIdx / 3) * 3)
  );
  const visibleWords = captionWords.slice(windowStart, windowStart + 3);

  if (visibleWords.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 260,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 990,
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "4px solid #000000",
          borderRadius: 16,
          padding: "12px 24px",
          maxWidth: 920,
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 18px",
          fontFamily: theme.fonts.caption,
          fontSize: 54,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          color: "#000000",
        }}
      >
        {visibleWords.map((w, idx) => (
          <span
            key={`${w.text}-${w.from}-${idx}`}
            style={{
              display: "inline-block",
              color: "#000000",
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};
