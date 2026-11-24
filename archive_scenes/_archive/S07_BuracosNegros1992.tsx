import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI, springPresets } from "../design/tokens";

export const S07_BuracosNegros1992: React.FC<SceneProps> = ({ from, to: _to }) => {
  // S07 representa O Relógio Atômico de Césio
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({ frame: f, fps, config: springPresets.snappy });
  const osc = Math.sin(f * 0.4);

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
        PRECISÃO TEMPORAL QUÂNTICA
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
        RELÓGIO ATÔMICO
      </div>

      {/* Caixa do Oscilador de Césio */}
      <div
        style={{
          marginTop: 50,
          width: 520,
          height: 340,
          border: `5px solid ${colors.BLUE}`,
          borderRadius: 28,
          backgroundColor: colors.BLACK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 50px rgba(30, 107, 255, 0.5)`,
          padding: 30,
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontFamily: FONT_CODE, fontSize: 32, fontWeight: 800, color: colors.BLUE, letterSpacing: "0.1em" }}>
          ISÓTOPO Cs-133
        </span>
        <span
          style={{
            marginTop: 16,
            fontFamily: FONT_CODE,
            fontSize: 44,
            fontWeight: 900,
            color: colors.WHITE,
            textShadow: `0 0 25px ${colors.WHITE}`,
          }}
        >
          9.192.631.770 Hz
        </span>
        <span style={{ marginTop: 20, fontFamily: FONT_CODE, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
          1 BILIONÉSIMO DE SEGUNDO
        </span>
      </div>
    </AbsoluteFill>
  );
};
