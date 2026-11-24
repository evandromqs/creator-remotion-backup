import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import scenesData from "../data/scenes.json";
import { theme } from "../design/theme";

export const DynamicCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Encontra a cena atual
  const currentScene = scenesData.scenes.find(
    (s) => frame >= s.from && frame < s.from + s.durationInFrames
  );

  if (!currentScene || !currentScene.captions || currentScene.captions.length === 0) {
    return null;
  }

  // Agrupa palavras da cena em blocos de até 3 palavras
  const captionWords = currentScene.captions;
  const wordIndex = captionWords.findIndex((w) => frame >= w.from && frame <= w.to);
  const activeWordIdx = wordIndex !== -1 ? wordIndex : captionWords.findIndex((w) => w.from > frame) - 1;

  // Janela visível de 3 palavras em volta da palavra ativa
  const windowStart = Math.max(0, Math.min(captionWords.length - 3, Math.floor(Math.max(0, activeWordIdx) / 3) * 3));
  const visibleWords = captionWords.slice(windowStart, windowStart + 3);

  return (
    <div
      style={{
        position: "absolute",
        top: theme.safeZones.captionsY,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 990,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 26px",
          fontFamily: theme.fonts.caption,
          fontSize: 64,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}
      >
        {visibleWords.map((w, idx) => {
          const isActive = frame >= w.from && frame <= w.to;

          // Animação spring ao ativar a palavra
          const scale = isActive
            ? spring({
                frame: frame - w.from,
                fps,
                config: { damping: 12, stiffness: 220, mass: 0.7 },
              }) * 0.14 + 1.0
            : 1.0;

          // Cor: destaque âmbar se for highlight ou ativo, branco caso contrário
          const textColor = isActive
            ? "#fbbf24"
            : w.highlight
            ? "#38bdf8"
            : "#ffffff";

          return (
            <span
              key={`${w.text}-${w.from}-${idx}`}
              style={{
                display: "inline-block",
                margin: "0 6px",
                transform: `scale(${scale.toFixed(3)})`,
                color: textColor,
                textShadow: isActive
                  ? "0 0 35px rgba(251, 191, 36, 0.7)"
                  : "0 8px 24px rgba(0,0,0,0.95)",
                WebkitTextStroke: "10px #05070d",
                paintOrder: "stroke fill",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
