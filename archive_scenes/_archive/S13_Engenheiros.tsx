import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S13_Engenheiros: React.FC<SceneProps> = ({ from, to: _to }) => {
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
        ENGENHARIA MILITAR AEROESPACIAL
      </div>

      <div
        style={{
          marginTop: 40,
          fontFamily: FONT_UI,
          fontSize: 80,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        REPROGRAMAÇÃO DE BORDO
      </div>

      {/* Caixa de Código Terminal */}
      <div
        style={{
          marginTop: 50,
          width: "100%",
          maxWidth: 860,
          border: `4px solid ${colors.BLUE}`,
          borderRadius: 24,
          backgroundColor: colors.BLACK,
          padding: "36px 44px",
          boxSizing: "border-box",
          boxShadow: `0 0 45px rgba(30, 107, 255, 0.4)`,
        }}
      >
        <div style={{ fontFamily: FONT_CODE, fontSize: 30, fontWeight: 800, color: colors.BLUE, marginBottom: 16 }}>
          $ apply_relativistic_correction
        </div>
        <div style={{ fontFamily: FONT_CODE, fontSize: 32, fontWeight: 900, color: colors.WHITE, marginBottom: 16 }}>
          OFFSET: -38.000 µs / day
        </div>
        <div style={{ fontFamily: FONT_CODE, fontSize: 28, fontWeight: 800, color: colors.WHITE, opacity: 0.8 }}>
          STATUS: CLOCK SLOWED BEFORE LAUNCH [OK]
        </div>
      </div>
    </AbsoluteFill>
  );
};
