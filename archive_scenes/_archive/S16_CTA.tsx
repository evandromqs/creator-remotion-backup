import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneProps } from "../lib/timing";
import { colors, FONT_CODE, FONT_UI } from "../design/tokens";

export const S16_CTA: React.FC<SceneProps> = ({ from, to: _to }) => {
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
        EVANDRO LAB â€¢ ENGENHARIA & IA
      </div>

      <div
        style={{
          marginTop: 50,
          fontFamily: FONT_UI,
          fontSize: 84,
          fontWeight: 900,
          color: colors.WHITE,
          textAlign: "center",
          lineHeight: 1.15,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
        }}
      >
        SABIA DESSA HISTÓRIA?
      </div>

      <div
        style={{
          marginTop: 60,
          border: `4px solid ${colors.WHITE}`,
          borderRadius: 24,
          padding: "28px 56px",
          backgroundColor: colors.BLACK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: `0 0 50px rgba(255, 255, 255, 0.4)`,
        }}
      >
        <span style={{ fontFamily: FONT_UI, fontSize: 52, fontWeight: 900, color: colors.WHITE }}>
          COMENTA AÍ 👇
        </span>
        <span style={{ marginTop: 14, fontFamily: FONT_CODE, fontSize: 28, fontWeight: 800, color: colors.BLUE, letterSpacing: "0.1em" }}>
          E SEGUE O LABORATÓRIO!
        </span>
      </div>
    </AbsoluteFill>
  );
};
