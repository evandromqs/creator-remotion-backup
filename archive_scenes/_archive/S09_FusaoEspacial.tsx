import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S09_FusaoEspacial: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S09 representa Relatividade Especial: Velocidade Extrema (-7 µs/dia)
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
          border: `3px solid ${colors.BLUE}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.BLUE,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
        }}
      >
        EFEITO 1: VELOCIDADE ORBITAL
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
        DILATAÇÃO TEMPORAL
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: FONT_UI,
          fontSize: 160,
          fontWeight: 900,
          color: colors.BLUE,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textShadow: `0 0 50px ${colors.BLUE}`,
        }}
      >
        -7 µs
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
        POR DIA (MAIS DEVAGAR)
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
        VELOCIDADE: 14.000 KM/H
      </div>
    </AbsoluteFill>
  );
};
