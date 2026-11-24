import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps, at } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";

export const S04_SinalBloqueado: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S04 agora representa o Efeito Doppler
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fDoppler = Math.max(0, at("Doppler", 0) - from);
  const isDopplerActive = f >= fDoppler;

  const dopplerSpr = spring({
    frame: f,
    fps,
    config: springPresets.snappy,
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 180,
        paddingLeft: 70,
        paddingRight: 70,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          border: `3px solid ${isDopplerActive ? colors.RED : colors.BLUE}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: isDopplerActive ? colors.RED : colors.BLUE,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
        }}
      >
        ANALISADOR DE FREQUÊNCIA DE RÁDIO
      </div>

      {/* Título de Destaque */}
      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 84,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        EFEITO DOPPLER
      </div>

      {/* Gráfico Analítico de Ondas */}
      <div
        style={{
          marginTop: 50,
          width: "100%",
          maxWidth: 840,
          height: 320,
          border: `3px solid ${colors.WHITE}`,
          borderRadius: 24,
          backgroundColor: colors.BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 40px rgba(30, 107, 255, 0.3)`,
        }}
      >
        <svg width="800" height="280" viewBox="0 0 800 280" fill="none">
          {/* Ondas comprimidas na aproximação e dilatadas no afastamento */}
          <path
            d="M 50 140 Q 90 40, 130 140 T 210 140 T 290 140 T 400 140 T 540 140 T 750 140"
            stroke={isDopplerActive ? colors.RED : colors.BLUE}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Marcadores de frequência */}
          <circle cx="130" cy="140" r="12" fill={colors.WHITE} />
          <circle cx="290" cy="140" r="12" fill={colors.WHITE} />
          <circle cx="540" cy="140" r="12" fill={colors.WHITE} />
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 20,
            fontFamily: FONT_CODE,
            fontSize: 24,
            fontWeight: 800,
            color: colors.WHITE,
            letterSpacing: "0.1em",
          }}
        >
          {isDopplerActive ? "Δf = f₀ (v / c) â€¢ DESVIO DETECTADO" : "MONITORANDO FREQUÊNCIA DE ORBITA..."}
        </div>
      </div>
    </AbsoluteFill>
  );
};
