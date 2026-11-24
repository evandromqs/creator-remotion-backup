import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S12_CTA: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S12 agora representa O Impacto no Mundo Real (Carro no Rio / 11 km)
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
        IMPACTO NO MUNDO REAL
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 78,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          textTransform: "uppercase",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        38 µs &times; VELOCIDADE DA LUZ
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 140,
          fontWeight: 900,
          color: colors.RED,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textShadow: `0 0 50px ${colors.RED}`,
        }}
      >
        = 11.4 KM
      </div>

      <div
        style={{
          marginTop: 40,
          border: `4px solid ${colors.RED}`,
          borderRadius: 20,
          padding: "20px 48px",
          backgroundColor: colors.BLACK,
          fontFamily: FONT_CODE,
          fontSize: 30,
          fontWeight: 800,
          color: colors.WHITE,
          textAlign: "center",
          boxShadow: `0 0 40px ${colors.RED}`,
        }}
      >
        CARRO FORA DA ROTA / DENTRO DO RIO
      </div>
    </AbsoluteFill>
  );
};
