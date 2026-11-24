import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S11_Evolucao: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S11 representa O Cálculo Cósmico (+45 - 7 = +38 µs)
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
          border: `3px solid ${colors.WHITE}`,
          borderRadius: 16,
          padding: "12px 28px",
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.WHITE,
          backgroundColor: colors.BLACK,
          letterSpacing: "0.15em",
        }}
      >
        A CONTA CÓSMICA FINAL
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_CODE,
          fontSize: 48,
          fontWeight: 900,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.08em",
        }}
      >
        +45 µs &minus; 7 µs
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: FONT_UI,
          fontSize: 180,
          fontWeight: 900,
          color: colors.WHITE,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          textShadow: `0 0 60px ${colors.BLUE}`,
        }}
      >
        +38 µs
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: FONT_CODE,
          fontSize: 32,
          fontWeight: 800,
          color: colors.BLUE,
          letterSpacing: "0.1em",
        }}
      >
        MICROSSEGUNDOS / DIA
      </div>

      <div
        style={{
          marginTop: 50,
          border: `3px solid ${colors.BLUE}`,
          borderRadius: 20,
          padding: "18px 44px",
          backgroundColor: colors.BLACK,
          fontFamily: FONT_CODE,
          fontSize: 26,
          fontWeight: 800,
          color: colors.WHITE,
          boxShadow: `0 0 35px ${colors.BLUE}`,
        }}
      >
        DIFERENÇA CRÍTICA ACUMULADA
      </div>
    </AbsoluteFill>
  );
};
