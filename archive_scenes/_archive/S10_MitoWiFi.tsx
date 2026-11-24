import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S10_MitoWiFi: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S10 representa Relatividade Geral: Gravidade Fraca (+45 µs/dia)
  const f = useCurrentFrame();

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
          border: `3px solid ${colors.RED}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.RED,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
        }}
      >
        EFEITO 2: GRAVIDADE FRACA
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 84,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        GRAVIDADE E O TEMPO
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: FONT_UI,
          fontSize: 160,
          fontWeight: 900,
          color: colors.RED,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textShadow: `0 0 50px ${colors.RED}`,
        }}
      >
        +45 µs
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: FONT_CODE,
          fontSize: 32,
          fontWeight: 800,
          color: colors.WHITE,
          letterSpacing: "0.1em",
        }}
      >
        POR DIA (MAIS RÁPIDO)
      </div>

      <div
        style={{
          marginTop: 40,
          border: `2px solid rgba(255,255,255,0.3)`,
          borderRadius: 16,
          padding: "16px 32px",
          fontFamily: FONT_CODE,
          fontSize: 24,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        ESPAÇO-TEMPO CURVADO
      </div>
    </AbsoluteFill>
  );
};
