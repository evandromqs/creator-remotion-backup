import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S14_LiberadoCivil: React.FC<SceneProps> = ({ from, to: _to }) => {
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
        DECRETO GLOBAL â€¢ 1983
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
        ABERTURA CIVIL MUNDIAL
      </div>

      <div
        style={{
          marginTop: 60,
          border: `5px solid ${colors.BLUE}`,
          borderRadius: 24,
          padding: "36px 64px",
          backgroundColor: colors.BLACK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: `0 0 50px ${colors.BLUE}`,
        }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: 110, fontWeight: 900, color: colors.WHITE }}>
          100% LIVRE
        </span>
        <span style={{ marginTop: 12, fontFamily: FONT_CODE, fontSize: 28, fontWeight: 800, color: colors.BLUE, letterSpacing: "0.1em" }}>
          PARA TODA A HUMANIDADE
        </span>
      </div>
    </AbsoluteFill>
  );
};
