import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S15_ConexaoHoje: React.FC<SceneProps> = ({ from, to: _to }) => {
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
        O MUNDO CONECTADO HOJE
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
        DANÇA CÓSMICA
      </div>

      {/* Três Pilares Tecnológicos */}
      <div
        style={{
          marginTop: 50,
          width: "100%",
          maxWidth: 860,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            border: `3px solid ${colors.WHITE}`,
            borderRadius: 20,
            padding: "20px 36px",
            backgroundColor: colors.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: FONT_CODE, fontSize: 32, fontWeight: 800, color: colors.WHITE }}>✈️ AVIAÇÃO CIVIL</span>
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.BLUE }}>ROTA 100% PRECISA</span>
        </div>

        <div
          style={{
            border: `3px solid ${colors.WHITE}`,
            borderRadius: 20,
            padding: "20px 36px",
            backgroundColor: colors.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: FONT_CODE, fontSize: 32, fontWeight: 800, color: colors.WHITE }}>🚗 NAVEGAÇÃO & TRÂNSITO</span>
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.BLUE }}>METROS DE PRECISÃO</span>
        </div>

        <div
          style={{
            border: `3px solid ${colors.WHITE}`,
            borderRadius: 20,
            padding: "20px 36px",
            backgroundColor: colors.BLACK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: FONT_CODE, fontSize: 32, fontWeight: 800, color: colors.WHITE }}>🍔 SEU DELIVERY</span>
          <span style={{ fontFamily: FONT_CODE, fontSize: 26, fontWeight: 800, color: colors.BLUE }}>TEMPO REAL</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
