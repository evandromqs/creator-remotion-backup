import React from "react";
import { useCurrentFrame } from "remotion";
import { captionGroups, CaptionGroup, Word } from "../lib/timing";
import { colors, FONT_UI, safeZone } from "../design/tokens";

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  // Encontra o grupo ativo de forma determinística
  const activeGroup: CaptionGroup | undefined = captionGroups.find(
    (g) => frame >= g.startFrame && frame < g.endFrame
  );

  if (!activeGroup) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: safeZone.captionsY - 140, // Base em y ≈ 1500
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 960,
      }}
    >
      <div
        style={{
          maxWidth: 820,
          textAlign: "center",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 18px",
          fontFamily: FONT_UI,
          fontSize: 84,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.01em",
          lineHeight: 1.15,
        }}
      >
        {activeGroup.words.map((w: Word, idx: number) => {
          const isPast = frame > w.f1;
          const isActive = frame >= w.f0 && frame <= w.f1;

          // Cor de preenchimento (RED se for palavra-chave de alerta, BLUE nas normais)
          const fillTargetColor = w.isAlert ? colors.RED : colors.BLUE;

          // Progresso linear puro da esquerda para a direita (0 a 100%)
          let fillPercent = 0;
          if (isPast) {
            fillPercent = 100;
          } else if (isActive) {
            const span = Math.max(1, w.f1 - w.f0);
            const progress = (frame - w.f0) / span;
            fillPercent = Math.min(100, Math.max(0, Math.round(progress * 100)));
          }

          // Preenchimento karaoke via background-clip: text com stops deslocados
          const gradient = `linear-gradient(90deg, ${fillTargetColor} 0%, ${fillTargetColor} ${fillPercent}%, ${colors.WHITE} ${fillPercent}%, ${colors.WHITE} 100%)`;

          return (
            <span
              key={`${w.text}-${w.f0}-${idx}`}
              style={{
                display: "inline-block",
                position: "relative",
                margin: 0,
                padding: "0 4px",
              }}
            >
              {/* Camada 1: Contorno Preto de Alto Contraste no Fundo (Silhueta Externa) */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 4,
                  right: 4,
                  color: colors.BLACK,
                  WebkitTextStroke: "16px #05070A",
                  zIndex: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                  filter: "drop-shadow(0 6px 14px rgba(5, 7, 10, 0.95))",
                }}
              >
                {w.text}
              </span>

              {/* Camada 2: Preenchimento Karaoke Puro e Cristalino na Frente (Sem Stroke) */}
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  zIndex: 2,
                }}
              >
                {w.text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
